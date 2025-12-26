export const RValidationsNamesTipoDelete = {
  NOT_FOUND: "NOT_FOUND",
  ERROR_DELETING: "ERROR_DELETING",
} as const;

export type RValidationsNamesTipoDelete =
  (typeof RValidationsNamesTipoDelete)[keyof typeof RValidationsNamesTipoDelete];

export type TipoDeleteDictionaryItem = {
  dictionaryId: RValidationsNamesTipoDelete;
  statusCode: number;
  defaultMessage: string;
};

export type DictionaryTipoDeleteType = {
  [key in RValidationsNamesTipoDelete]: TipoDeleteDictionaryItem;
};

export const tipoDeleteDictionary: DictionaryTipoDeleteType = {
  NOT_FOUND: {
    dictionaryId: "NOT_FOUND",
    statusCode: 404,
    defaultMessage: "Tipo de producto no encontrado",
  },
  ERROR_DELETING: {
    dictionaryId: "ERROR_DELETING",
    statusCode: 500,
    defaultMessage: "Error al eliminar el tipo de producto",
  },
};

export type ErrorDictionaryGenerator<T extends string> = (
  validationName: T
) => TipoDeleteDictionaryItem;

export const generateErrorDictionary = (
  validationName: RValidationsNamesTipoDelete
): TipoDeleteDictionaryItem => {
  return tipoDeleteDictionary[validationName];
};

