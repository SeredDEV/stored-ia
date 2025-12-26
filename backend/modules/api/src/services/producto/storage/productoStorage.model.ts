export interface UploadMediaInput {
  file: Buffer | string;
  fileName: string;
  contentType?: string;
}

export interface IStorageUploadService {
  execute(input: UploadMediaInput): Promise<string>;
  executeMultiple(files: UploadMediaInput[]): Promise<string[]>;
}

export interface IStorageDeleteService {
  execute(mediaUrl: string): Promise<void>;
  executeMultiple(mediaUrls: string[]): Promise<void>;
}

// Tipos de archivo permitidos
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/mpeg",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

export const BUCKET_NAME = "productos";

