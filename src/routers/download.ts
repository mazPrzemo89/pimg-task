import express, { Request, Response } from "express";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { client } from "../config";
import { DownloadQuery, DownloadResult, EndpointType, ImageFormat } from "../interfaces";
import { validateDonwloadQuery, validateImageFormat } from "../validators/validators";
import {  imageFormatErrorMessage } from "../errors/errors";

export const router = express.Router();

const main = async (Key: string): Promise<DownloadResult> => {
  let result;
  let contentType;
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key,
  });

  try {
    const response = await client.send(command);
    if (!response.Body) {
      throw "empty response";
    }
    result = await response.Body.transformToString("base64");
    if(response.ContentType){
      contentType = response.ContentType.split("/")[1];
    }
    
  } catch (err) {
    console.error(err);
    throw "error downloading file";
  }
  return { result, contentType };
};

router.post("/download/:id", async (req: Request, res: Response) => {
  const imageId = req.params.id;
  let query: DownloadQuery;
  try{
    query = validateDonwloadQuery(req);
  } catch (error){
    return res.status(400).send(error.message);
  }

  const format = query.formatToConvert;
  const width = query.widthToConvert;
  const height = query.heightToConvert;
  
  let contentType: string;

  let data;

  try {
    data = await main(imageId);
    if (format) {
      contentType = format;
    } else if (data.contentType) {
      contentType = data.contentType;
    } else {
      contentType = "jpeg";
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  if (!validateImageFormat(contentType, EndpointType.download)) {
    return res
      .status(400)
      .send(imageFormatErrorMessage);
  }

  const response = Buffer.from(data.result, "base64");
  const image = await sharp(response)
    .resize(width, height, {
      fit: sharp.fit.outside,
      withoutReduction: true,
    })[`${contentType as ImageFormat}`]()
    .toBuffer();

  res.set("Content-Type", `image/${contentType}`);
  return res.send(image);
});
