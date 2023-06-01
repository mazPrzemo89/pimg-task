import express, { Request, Response, NextFunction } from "express";
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid';
import { upload, s3 } from '../config';

import { ManagedUpload } from "aws-sdk/clients/s3";
import { ImageFormat } from "../interfaces";

export const router  = express.Router();


router.post('/upload', upload.single('upload'), async (req: Request, res: Response) => {

    if(!req.file){
      throw new Error('no file provided!')
    }
  
    const fileNameComponents = req.file.originalname.split('.')
  
    const fileExtension = fileNameComponents[fileNameComponents.length-1]
  
    console.log(fileExtension);
  
    const image = await sharp(req.file.buffer).resize(500, 500, {
      fit: sharp.fit.outside,
      withoutReduction: true
    })["webp"]().toBuffer();
    res.set("Content-type","image/webp");
    res.send(image);
  
  }, (error:Error, _req: Request, res: Response, _next: NextFunction)=>{
    res.status(400).send({error: error.message});
  })


  router.post('/upload-s3/:format', upload.single('upload'), async (req: Request, res: Response) => {  
    if(!req.file){
        throw new Error('no file provided!')
    }

    const fileId = uuidv4()

    // let format: ImageFormat

    // if(req.params.format && (req.params.format).match(/^(?!.*\s)(?<!\S)(jpeg|png|webp|avif|tiff|gif)(?!\S).*$/)){
    //   format = req.params.format as ImageFormat
    // } else {
    //   format = "jpeg"
    // }

    console.log(req.params.format)
    const fileNameComponents = req.file.originalname.split('.')
  
    const format = fileNameComponents[fileNameComponents.length - 1]

    // const image = await sharp(req.file.buffer).resize(150, 150, {
    //     fit: sharp.fit.outside,
    //     withoutReduction: true
    //   })[format]().toBuffer();

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: `${fileId}.${format}`,
        Body: req.file.buffer
      }
      
     s3.upload(params, (err: Error, data: ManagedUpload.SendData) => {
        if (err) {
           return res.status(400).send({err})
        }
        res.send({imageId:fileId})
      }) 
      return;
  });