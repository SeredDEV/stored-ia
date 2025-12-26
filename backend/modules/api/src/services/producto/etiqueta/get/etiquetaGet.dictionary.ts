export const RValidationsNamesEtiquetaGet = {
  NOT_FOUND: "NOT_FOUND",
} as const;

export type RValidationsNamesEtiquetaGet =
  (typeof RValidationsNamesEtiquetaGet)[keyof typeof RValidationsNamesEtiquetaGet];

export type EtiquetaGetDictionaryItem = {
  dictionaryId: RValidationsNamesEtiquetaGet;
  statusCode: number;
  defaultMessage: string;
};

export type DictionaryEtiquetaGetType = {
  [key in RValidationsNamesEtiquetaGet]: EtiquetaGetDictionaryItem;
};

export const etiquetaGetDictionary: DictionaryEtiquetaGetType = {
  NOT_FOUND: {
    dictionaryId: "NOT_FOUND",
    statusCode: 404,
    defaultMessage: "Etiqueta no encontrada",
  },
};

export type ErrorDictionaryGenerator<T extends string> = (
  validationName: T
) => EtiquetaGetDictionaryItem;

export const generateErrorDictionary = (
  validationName: RValidationsNamesEtiquetaGet
): EtiquetaGetDictionaryItem => {
  return etiquetaGetDictionary[validationName];
};
