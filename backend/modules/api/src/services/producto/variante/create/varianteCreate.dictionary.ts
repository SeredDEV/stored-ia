export const RValidationsNamesVarianteCreate = {
  ERROR_CREATING: "ERROR_CREATING",
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  DUPLICATE_SKU: "DUPLICATE_SKU",
} as const;

export type RValidationsNamesVarianteCreate =
  (typeof RValidationsNamesVarianteCreate)[keyof typeof RValidationsNamesVarianteCreate];

export type VarianteCreateDictionaryItem = {
  dictionaryId: RValidationsNamesVarianteCreate;
  statusCode: number;
  defaultMessage: string;
};

export type DictionaryVarianteCreateType = {
  [key in RValidationsNamesVarianteCreate]: VarianteCreateDictionaryItem;
};

export const varianteCreateDictionary: DictionaryVarianteCreateType = {
  ERROR_CREATING: {
    dictionaryId: "ERROR_CREATING",
    statusCode: 500,
    defaultMessage: "Error al crear la variante",
  },
  PRODUCT_NOT_FOUND: {
    dictionaryId: "PRODUCT_NOT_FOUND",
    statusCode: 404,
    defaultMessage: "Producto no encontrado",
  },
  DUPLICATE_SKU: {
    dictionaryId: "DUPLICATE_SKU",
    statusCode: 409,
    defaultMessage: "Ya existe una variante con ese SKU",
  },
};

export type ErrorDictionaryGenerator<T extends string> = (
  validationName: T
) => VarianteCreateDictionaryItem;

export const generateErrorDictionary = (
  validationName: RValidationsNamesVarianteCreate
): VarianteCreateDictionaryItem => {
  return varianteCreateDictionary[validationName];
};

