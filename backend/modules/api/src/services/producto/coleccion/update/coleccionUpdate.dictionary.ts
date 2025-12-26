/**
 * Diccionario de errores para actualizar colección.
 */

export type RValidationsNamesColeccionUpdate = "notFound" | "errorUpdating";

export interface ColeccionUpdateDictionaryItem {
  dictionaryId: number;
  statusCode: number;
  defaultMessage: string;
}

export const coleccionUpdateDictionary: Record<
  RValidationsNamesColeccionUpdate,
  ColeccionUpdateDictionaryItem
> = {
  notFound: {
    dictionaryId: 2013001,
    statusCode: 404,
    defaultMessage: "Colección no encontrada",
  },
  errorUpdating: {
    dictionaryId: 2013002,
    statusCode: 500,
    defaultMessage: "Error al actualizar colección",
  },
};

export interface ErrorDictionaryGenerator<T extends string> {
  create(args: { validationName: T; parameters?: string[] }): Promise<{
    statusCode: number;
    message: string;
  }>;
}

export type DictionaryColeccionUpdateType = typeof coleccionUpdateDictionary;

