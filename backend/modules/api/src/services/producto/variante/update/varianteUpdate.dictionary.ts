export const RValidationsNamesVarianteUpdate = {
  NOT_FOUND: "NOT_FOUND",
  ERROR_UPDATING: "ERROR_UPDATING",
  DUPLICATE_SKU: "DUPLICATE_SKU",
} as const;

export type RValidationsNamesVarianteUpdate =
  (typeof RValidationsNamesVarianteUpdate)[keyof typeof RValidationsNamesVarianteUpdate];

export type VarianteUpdateDictionaryItem = {
  dictionaryId: RValidationsNamesVarianteUpdate;
  statusCode: number;
  defaultMessage: string;
};

export type DictionaryVarianteUpdateType = {
  [key in RValidationsNamesVarianteUpdate]: VarianteUpdateDictionaryItem;
};

export const varianteUpdateDictionary: DictionaryVarianteUpdateType = {
  NOT_FOUND: {
    dictionaryId: "NOT_FOUND",
    statusCode: 404,
    defaultMessage: "Variante no encontrada",
  },
  ERROR_UPDATING: {
    dictionaryId: "ERROR_UPDATING",
    statusCode: 500,
    defaultMessage: "Error al actualizar la variante",
  },
  DUPLICATE_SKU: {
    dictionaryId: "DUPLICATE_SKU",
    statusCode: 409,
    defaultMessage: "Ya existe una variante con ese SKU",
  },
};

export type ErrorDictionaryGenerator<T extends string> = (
  validationName: T
) => VarianteUpdateDictionaryItem;

export const generateErrorDictionary = (
  validationName: RValidationsNamesVarianteUpdate
): VarianteUpdateDictionaryItem => {
  return varianteUpdateDictionary[validationName];
};

