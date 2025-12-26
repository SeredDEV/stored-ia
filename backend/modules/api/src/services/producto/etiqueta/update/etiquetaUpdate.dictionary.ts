export const RValidationsNamesEtiquetaUpdate = {
  NOT_FOUND: "NOT_FOUND",
  ERROR_UPDATING: "ERROR_UPDATING",
  DUPLICATE_VALUE: "DUPLICATE_VALUE",
} as const;

export type RValidationsNamesEtiquetaUpdate =
  (typeof RValidationsNamesEtiquetaUpdate)[keyof typeof RValidationsNamesEtiquetaUpdate];

export type EtiquetaUpdateDictionaryItem = {
  dictionaryId: RValidationsNamesEtiquetaUpdate;
  statusCode: number;
  defaultMessage: string;
};

export type DictionaryEtiquetaUpdateType = {
  [key in RValidationsNamesEtiquetaUpdate]: EtiquetaUpdateDictionaryItem;
};

export const etiquetaUpdateDictionary: DictionaryEtiquetaUpdateType = {
  NOT_FOUND: {
    dictionaryId: "NOT_FOUND",
    statusCode: 404,
    defaultMessage: "Etiqueta no encontrada",
  },
  ERROR_UPDATING: {
    dictionaryId: "ERROR_UPDATING",
    statusCode: 500,
    defaultMessage: "Error al actualizar la etiqueta",
  },
  DUPLICATE_VALUE: {
    dictionaryId: "DUPLICATE_VALUE",
    statusCode: 409,
    defaultMessage: "Ya existe una etiqueta con ese valor",
  },
};

export type ErrorDictionaryGenerator<T extends string> = (
  validationName: T
) => EtiquetaUpdateDictionaryItem;

export const generateErrorDictionary = (
  validationName: RValidationsNamesEtiquetaUpdate
): EtiquetaUpdateDictionaryItem => {
  return etiquetaUpdateDictionary[validationName];
};

