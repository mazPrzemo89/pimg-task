import multer from 'multer'
import AWS from 'aws-sdk'
import { S3Client } from "@aws-sdk/client-s3";

const credentials = {
 accessKeyId: process.env.AWS_ACCESS_KEY_ID,
 secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
 region:'eu-west-2'
}

export const upload = multer({
    limits:{
      fileSize: 10000000
    },
    fileFilter(req, file, cb){
      if (!file.originalname.match(/\.(jpg|jpeg|pdf|doc|docx)$/)){
        return cb(new Error('not a jpg!'))
      }
  
      return cb(null, true)
    }
})

export const client = new S3Client(credentials)

export const s3 = new AWS.S3(credentials)