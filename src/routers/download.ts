import express, { Request, Response, NextFunction } from "express";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { client } from '../config';

export const router  = express.Router();

const main = async (Key:string) => {
    let result;
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key
    });
  
    try {
      const response = await client.send(command);
      if(!response.Body){
          throw 'empty response'
      }
      // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
      result = await response.Body.transformToString('base64');
      
    } catch (err) {
      console.error(err);
      throw 'error downloading file'
    }
    return result;
  };
  
router.post('/download', async (req, res) => {
    let string;
    try {
        string = await main('index3.png')
    } catch (error) {
        return res.status(400).send(error);
    }
   const response = Buffer.from(string, 'base64');
   res.set('Content-Type', 'image/png');
   return res.send(response);
})

