export const RValidationsNamesTipoUpdate = {
  NOT_FOUND: "NOT_FOUND",
  ERROR_UPDATING: "ERROR_UPDATING",
  DUPLICATE_VALUE: "DUPLICATE_VALUE",
} as const;

export type RValidationsNamesTipoUpdate =
  (typeof RValidationsNamesTipoUpdate)[keyof typeof RValidationsNamesTipoUpdate];

export type TipoUpdateDictionaryItem = {
  dictionaryId: RValidationsNamesTipoUpdate;
  statusCode: number;
  defaultMessage: string;
};

export type DictionaryTipoUpdateType = {
  [key in RValidationsNamesTipoUpdate]: TipoUpdateDictionaryItem;
};

export const tipoUpdateDictionary: DictionaryTipoUpdateType = {
  NOT_FOUND: {
    dictionaryId: "NOT_FOUND",
    statusCode: 404,
    defaultMessage: "Tipo de producto no encontrado",
  },
  ERROR_UPDATING: {
    dictionaryId: "ERROR_UPDATING",
    statusCode: 500,
    defaultMessage: "Error al actualizar el tipo de producto",
  },
  DUPLICATE_VALUE: {
    dictionaryId: "DUPLICATE_VALUE",
    statusCode: 409,
    defaultMessage: "Ya existe un tipo de producto con ese valor",
  },
};

export type ErrorDictionaryGenerator<T extends string> = (
  validationName: T
) => TipoUpdateDictionaryItem;

export const generateErrorDictionary = (
  validationName: RValidationsNamesTipoUpdate
): TipoUpdateDictionaryItem => {
  return tipoUpdateDictionary[validationName];
};

