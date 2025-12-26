export const RValidationsNamesTipoCreate = {
  ERROR_CREATING: "ERROR_CREATING",
  DUPLICATE_VALUE: "DUPLICATE_VALUE",
} as const;

export type RValidationsNamesTipoCreate =
  (typeof RValidationsNamesTipoCreate)[keyof typeof RValidationsNamesTipoCreate];

export type TipoCreateDictionaryItem = {
  dictionaryId: RValidationsNamesTipoCreate;
  statusCode: number;
  defaultMessage: string;
};

export type DictionaryTipoCreateType = {
  [key in RValidationsNamesTipoCreate]: TipoCreateDictionaryItem;
};

export const tipoCreateDictionary: DictionaryTipoCreateType = {
  ERROR_CREATING: {
    dictionaryId: "ERROR_CREATING",
    statusCode: 500,
    defaultMessage: "Error al crear el tipo de producto",
  },
  DUPLICATE_VALUE: {
    dictionaryId: "DUPLICATE_VALUE",
    statusCode: 409,
    defaultMessage: "Ya existe un tipo de producto con ese valor",
  },
};

export type ErrorDictionaryGenerator<T extends string> = (
  validationName: T
) => TipoCreateDictionaryItem;

export const generateErrorDictionary = (
  validationName: RValidationsNamesTipoCreate
): TipoCreateDictionaryItem => {
  return tipoCreateDictionary[validationName];
};

