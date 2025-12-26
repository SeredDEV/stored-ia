export const RValidationsNamesEtiquetaCreate = {
  ERROR_CREATING: "ERROR_CREATING",
  DUPLICATE_VALUE: "DUPLICATE_VALUE",
} as const;

export type RValidationsNamesEtiquetaCreate =
  (typeof RValidationsNamesEtiquetaCreate)[keyof typeof RValidationsNamesEtiquetaCreate];

export type EtiquetaCreateDictionaryItem = {
  dictionaryId: RValidationsNamesEtiquetaCreate;
  statusCode: number;
  defaultMessage: string;
};

export type DictionaryEtiquetaCreateType = {
  [key in RValidationsNamesEtiquetaCreate]: EtiquetaCreateDictionaryItem;
};

export const etiquetaCreateDictionary: DictionaryEtiquetaCreateType = {
  ERROR_CREATING: {
    dictionaryId: "ERROR_CREATING",
    statusCode: 500,
    defaultMessage: "Error al crear la etiqueta",
  },
  DUPLICATE_VALUE: {
    dictionaryId: "DUPLICATE_VALUE",
    statusCode: 409,
    defaultMessage: "Ya existe una etiqueta con ese valor",
  },
};

export type ErrorDictionaryGenerator<T extends string> = (
  validationName: T
) => EtiquetaCreateDictionaryItem;

export const generateErrorDictionary = (
  validationName: RValidationsNamesEtiquetaCreate
): EtiquetaCreateDictionaryItem => {
  return etiquetaCreateDictionary[validationName];
};
