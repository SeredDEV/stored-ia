export const RValidationsNamesTipoGet = {
  NOT_FOUND: "NOT_FOUND",
} as const;

export type RValidationsNamesTipoGet =
  (typeof RValidationsNamesTipoGet)[keyof typeof RValidationsNamesTipoGet];

export type TipoGetDictionaryItem = {
  dictionaryId: RValidationsNamesTipoGet;
  statusCode: number;
  defaultMessage: string;
};

export type DictionaryTipoGetType = {
  [key in RValidationsNamesTipoGet]: TipoGetDictionaryItem;
};

export const tipoGetDictionary: DictionaryTipoGetType = {
  NOT_FOUND: {
    dictionaryId: "NOT_FOUND",
    statusCode: 404,
    defaultMessage: "Tipo de producto no encontrado",
  },
};

export type ErrorDictionaryGenerator<T extends string> = (
  validationName: T
) => TipoGetDictionaryItem;

export const generateErrorDictionary = (
  validationName: RValidationsNamesTipoGet
): TipoGetDictionaryItem => {
  return tipoGetDictionary[validationName];
};

