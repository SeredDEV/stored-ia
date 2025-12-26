export const RValidationsNamesVarianteGet = {
  NOT_FOUND: "NOT_FOUND",
} as const;

export type RValidationsNamesVarianteGet =
  (typeof RValidationsNamesVarianteGet)[keyof typeof RValidationsNamesVarianteGet];

export type VarianteGetDictionaryItem = {
  dictionaryId: RValidationsNamesVarianteGet;
  statusCode: number;
  defaultMessage: string;
};

export type DictionaryVarianteGetType = {
  [key in RValidationsNamesVarianteGet]: VarianteGetDictionaryItem;
};

export const varianteGetDictionary: DictionaryVarianteGetType = {
  NOT_FOUND: {
    dictionaryId: "NOT_FOUND",
    statusCode: 404,
    defaultMessage: "Variante no encontrada",
  },
};

export type ErrorDictionaryGenerator<T extends string> = (
  validationName: T
) => VarianteGetDictionaryItem;

export const generateErrorDictionary = (
  validationName: RValidationsNamesVarianteGet
): VarianteGetDictionaryItem => {
  return varianteGetDictionary[validationName];
};

