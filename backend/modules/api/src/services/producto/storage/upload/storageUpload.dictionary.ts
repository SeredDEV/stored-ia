export const RValidationsNamesStorageUpload = {
  ERROR_UPLOADING: "ERROR_UPLOADING",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
} as const;

export type RValidationsNamesStorageUpload =
  (typeof RValidationsNamesStorageUpload)[keyof typeof RValidationsNamesStorageUpload];

export type StorageUploadDictionaryItem = {
  dictionaryId: RValidationsNamesStorageUpload;
  statusCode: number;
  defaultMessage: string;
};

export type DictionaryStorageUploadType = {
  [key in RValidationsNamesStorageUpload]: StorageUploadDictionaryItem;
};

export const storageUploadDictionary: DictionaryStorageUploadType = {
  ERROR_UPLOADING: {
    dictionaryId: "ERROR_UPLOADING",
    statusCode: 500,
    defaultMessage: "Error al subir el archivo multimedia",
  },
  INVALID_FILE_TYPE: {
    dictionaryId: "INVALID_FILE_TYPE",
    statusCode: 400,
    defaultMessage:
      "Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP, SVG) y videos (MP4, MPEG, WebM, OGG, MOV)",
  },
  FILE_TOO_LARGE: {
    dictionaryId: "FILE_TOO_LARGE",
    statusCode: 400,
    defaultMessage: "El archivo es demasiado grande",
  },
};

export type ErrorDictionaryGenerator<T extends string> = (
  validationName: T
) => StorageUploadDictionaryItem;

export const generateErrorDictionary = (
  validationName: RValidationsNamesStorageUpload
): StorageUploadDictionaryItem => {
  return storageUploadDictionary[validationName];
};

