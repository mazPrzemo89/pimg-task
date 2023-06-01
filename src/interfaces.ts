export type ImageFormat = "jpeg" | "png" | "webp" | "avif" | "tiff" | "gif";

export type Endpoint = "upload" | "download";

export interface DownloadResult {
    result: string;
    contentType: string | undefined;
}

export interface DownloadQuery  {
    formatToConvert: string;
    widthToConvert: undefined | number;
    heightToConvert: undefined | number
}

export enum EndpointType  {
    upload = "upload",
    download = "download"
}
