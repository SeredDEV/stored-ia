/**
 * Diccionario de errores para eliminar colección.
 */

export type RValidationsNamesColeccionDelete = "notFound" | "errorDeleting";

export interface ColeccionDeleteDictionaryItem {
  dictionaryId: number;
  statusCode: number;
  defaultMessage: string;
}

export const coleccionDeleteDictionary: Record<
  RValidationsNamesColeccionDelete,
  ColeccionDeleteDictionaryItem
> = {
  notFound: {
    dictionaryId: 2014001,
    statusCode: 404,
    defaultMessage: "Colección no encontrada",
  },
  errorDeleting: {
    dictionaryId: 2014002,
    statusCode: 500,
    defaultMessage: "Error al eliminar colección",
  },
};

export interface ErrorDictionaryGenerator<T extends string> {
  create(args: { validationName: T; parameters?: string[] }): Promise<{
    statusCode: number;
    message: string;
  }>;
}

export type DictionaryColeccionDeleteType = typeof coleccionDeleteDictionary;

