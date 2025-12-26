export const RValidationsNamesEtiquetaDelete = {
  NOT_FOUND: "NOT_FOUND",
  ERROR_DELETING: "ERROR_DELETING",
} as const;

export type RValidationsNamesEtiquetaDelete =
  (typeof RValidationsNamesEtiquetaDelete)[keyof typeof RValidationsNamesEtiquetaDelete];

export type EtiquetaDeleteDictionaryItem = {
  dictionaryId: RValidationsNamesEtiquetaDelete;
  statusCode: number;
  defaultMessage: string;
};

export type DictionaryEtiquetaDeleteType = {
  [key in RValidationsNamesEtiquetaDelete]: EtiquetaDeleteDictionaryItem;
};

export const etiquetaDeleteDictionary: DictionaryEtiquetaDeleteType = {
  NOT_FOUND: {
    dictionaryId: "NOT_FOUND",
    statusCode: 404,
    defaultMessage: "Etiqueta no encontrada",
  },
  ERROR_DELETING: {
    dictionaryId: "ERROR_DELETING",
    statusCode: 500,
    defaultMessage: "Error al eliminar la etiqueta",
  },
};

export type ErrorDictionaryGenerator<T extends string> = (
  validationName: T
) => EtiquetaDeleteDictionaryItem;

export const generateErrorDictionary = (
  validationName: RValidationsNamesEtiquetaDelete
): EtiquetaDeleteDictionaryItem => {
  return etiquetaDeleteDictionary[validationName];
};

