import express, { Request, Response, NextFunction } from "express";
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { s3 } from '../config';
import { ManagedUpload } from "aws-sdk/clients/s3";
import { validateImageFormat } from "../validators/validators";
import { imageFormatErrorMessage, noFileError } from "../errors/errors";
import { EndpointType } from "../interfaces";

export const router  = express.Router();

const upload = multer({
  limits:{
    fileSize: 10000000
  },
  fileFilter(_req, _file, cb){
    return cb(null, true);
  }
});

  router.post('/uploadS3', upload.single('upload'), async (req: Request, res: Response) => {  
    if(!req.file){
      return res.status(400).send(noFileError);
    }
    if (!validateImageFormat(req.file.originalname, EndpointType.upload)){
      return res.status(400).send(imageFormatErrorMessage);
    }

    const fileId = uuidv4();

    const fileNameComponents = req.file.originalname.split('.');
  
    const format = fileNameComponents[fileNameComponents.length - 1];

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: `${fileId}`,
        Body: req.file.buffer,
        ContentType: `image/${format}`
      };
      
     s3.upload(params, (error: Error, _data: ManagedUpload.SendData) => {
        if (error) {
           return res.status(400).send(error.message);
        }
        res.send({imageId:fileId});
      });
      return;
  });