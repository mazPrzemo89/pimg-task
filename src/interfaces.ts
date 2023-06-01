export type ImageFormat = "jpeg" | "png" | "webp" | "avif" | "tiff" | "gif";

export interface DownloadResult {
    result: string;
    contentType: string | undefined;
}

export interface DownloadQuery  {
    formatToConvert: string;
    widthToConvert: undefined | number;
    heightToConvert: undefined | number
}