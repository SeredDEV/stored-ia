export const RValidationsNamesVarianteDelete = {
  NOT_FOUND: "NOT_FOUND",
  ERROR_DELETING: "ERROR_DELETING",
} as const;

export type RValidationsNamesVarianteDelete =
  (typeof RValidationsNamesVarianteDelete)[keyof typeof RValidationsNamesVarianteDelete];

export type VarianteDeleteDictionaryItem = {
  dictionaryId: RValidationsNamesVarianteDelete;
  statusCode: number;
  defaultMessage: string;
};

export type DictionaryVarianteDeleteType = {
  [key in RValidationsNamesVarianteDelete]: VarianteDeleteDictionaryItem;
};

export const varianteDeleteDictionary: DictionaryVarianteDeleteType = {
  NOT_FOUND: {
    dictionaryId: "NOT_FOUND",
    statusCode: 404,
    defaultMessage: "Variante no encontrada",
  },
  ERROR_DELETING: {
    dictionaryId: "ERROR_DELETING",
    statusCode: 500,
    defaultMessage: "Error al eliminar la variante",
  },
};

export type ErrorDictionaryGenerator<T extends string> = (
  validationName: T
) => VarianteDeleteDictionaryItem;

export const generateErrorDictionary = (
  validationName: RValidationsNamesVarianteDelete
): VarianteDeleteDictionaryItem => {
  return varianteDeleteDictionary[validationName];
};

