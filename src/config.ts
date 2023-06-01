
import AWS from 'aws-sdk';
import { S3Client } from "@aws-sdk/client-s3";

const credentials = {
 accessKeyId: process.env.AWS_ACCESS_KEY_ID,
 secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
 region: process.env.AWS_REGION
};

export const client = new S3Client(credentials);

export const s3 = new AWS.S3(credentials);