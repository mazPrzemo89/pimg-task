import express, { Request, Response, NextFunction } from "express";
import sharp from 'sharp'
import { upload, s3 } from '../config';

import { ManagedUpload } from "aws-sdk/clients/s3";

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
    console.log(process.env.AWS_BUCKET_NAME)
    if(!req.file){
        throw new Error('no file provided!')
    }

    let format: ImageFormat

    if(req.params.format && (req.params.format).match(/^(?!.*\s)(?<!\S)(jpg|png|webp|avif|tiff|gif)(?!\S).*$/)){
      format = req.params.format as ImageFormat
    } else {
      format = "jpeg"
    }

    const fileNameComponents = req.file.originalname.split('.')
  
    const fileName = fileNameComponents[0]

    const image = await sharp(req.file.buffer).resize(150, 150, {
        fit: sharp.fit.outside,
        withoutReduction: true
      })[format]().toBuffer();

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: `${fileName}.${format}`,
        Body: image
      }
      
     s3.upload(params, (err: Error, data: ManagedUpload.SendData) => {
        if (err) {
           return res.status(400).send({err})
        }
        res.send(data.Location)
      }) 
      return;
  });