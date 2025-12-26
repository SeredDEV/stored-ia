export const RValidationsNamesStorageDelete = {
  ERROR_DELETING: "ERROR_DELETING",
  INVALID_URL: "INVALID_URL",
  NOT_FOUND: "NOT_FOUND",
} as const;

export type RValidationsNamesStorageDelete =
  (typeof RValidationsNamesStorageDelete)[keyof typeof RValidationsNamesStorageDelete];

export type StorageDeleteDictionaryItem = {
  dictionaryId: RValidationsNamesStorageDelete;
  statusCode: number;
  defaultMessage: string;
};

export type DictionaryStorageDeleteType = {
  [key in RValidationsNamesStorageDelete]: StorageDeleteDictionaryItem;
};

export const storageDeleteDictionary: DictionaryStorageDeleteType = {
  ERROR_DELETING: {
    dictionaryId: "ERROR_DELETING",
    statusCode: 500,
    defaultMessage: "Error al eliminar el archivo multimedia",
  },
  INVALID_URL: {
    dictionaryId: "INVALID_URL",
    statusCode: 400,
    defaultMessage: "URL de archivo inválida",
  },
  NOT_FOUND: {
    dictionaryId: "NOT_FOUND",
    statusCode: 404,
    defaultMessage: "Archivo no encontrado",
  },
};

export type ErrorDictionaryGenerator<T extends string> = (
  validationName: T
) => StorageDeleteDictionaryItem;

export const generateErrorDictionary = (
  validationName: RValidationsNamesStorageDelete
): StorageDeleteDictionaryItem => {
  return storageDeleteDictionary[validationName];
};

