import{ Request } from "express";
import { DownloadQuery } from "../interfaces";
import { imageFormatErrorMessage, invalidDimensionsError } from "../errors/errors";

export function validateImageFormat(value: string){
    const values = value.split('.');
    const format = values[values.length -1];
    return format.match(/(jpeg|webp|gif|png|tiff)$/);
}

export function validateDonwloadQuery(req: Request): DownloadQuery {
    const format = req.query.format as string;
    const width = req.query.width as string;
    const height = req.query.height as string;

    if(format && !validateImageFormat(format)){
        throw new Error(imageFormatErrorMessage)
    }

    if(width && !width.match(/[0-9]/) || height && !height.match(/[0-9]/)){
        throw new Error(invalidDimensionsError)
    }

    return {
        formatToConvert: format,
        widthToConvert: width ? parseInt(width) : undefined,
        heightToConvert: height ? parseInt(height) : undefined
    }
    
}