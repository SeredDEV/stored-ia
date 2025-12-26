/**
 * Diccionario de errores para obtener colección.
 */

export type RValidationsNamesColeccionGet = "notFound" | "errorFetching";

export interface ColeccionGetDictionaryItem {
  dictionaryId: number;
  statusCode: number;
  defaultMessage: string;
}

export const coleccionGetDictionary: Record<
  RValidationsNamesColeccionGet,
  ColeccionGetDictionaryItem
> = {
  notFound: {
    dictionaryId: 2012001,
    statusCode: 404,
    defaultMessage: "Colección no encontrada",
  },
  errorFetching: {
    dictionaryId: 2012002,
    statusCode: 500,
    defaultMessage: "Error al obtener colección",
  },
};

export interface ErrorDictionaryGenerator<T extends string> {
  create(args: { validationName: T; parameters?: string[] }): Promise<{
    statusCode: number;
    message: string;
  }>;
}

export type DictionaryColeccionGetType = typeof coleccionGetDictionary;

