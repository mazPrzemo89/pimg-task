import express, { Request, Response, NextFunction } from "express";
import multer from 'multer'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid';
import { s3 } from '../config';
import { ManagedUpload } from "aws-sdk/clients/s3";
import { validateImageFormat } from "../utils/utils";

export const router  = express.Router();

const upload = multer({
  limits:{
    fileSize: 10000000
  },
  fileFilter(_req, file, cb){
    if (!validateImageFormat(file.originalname)){
      return cb(new Error('not a jpg!'))
    }

    return cb(null, true)
  }
})

  router.post('/upload-s3', upload.single('upload'), async (req: Request, res: Response) => {  
    if(!req.file){
        throw new Error('no file provided!')
    }

    const fileId = uuidv4()


    console.log(req.params.format)
    const fileNameComponents = req.file.originalname.split('.')
  
    const format = fileNameComponents[fileNameComponents.length - 1]

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: `${fileId}`,
        Body: req.file.buffer,
        ContentType: `image/${format}`
      }
      
     s3.upload(params, (err: Error, data: ManagedUpload.SendData) => {
        if (err) {
           return res.status(400).send({err})
        }
        res.send({imageId:fileId})
      }) 
      return;
  });