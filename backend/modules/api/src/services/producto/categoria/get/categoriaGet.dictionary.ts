/**
 * Diccionario de errores para obtener categoría.
 */

export type RValidationsNamesCategoriaGet = "notFound" | "errorFetching";

export interface CategoriaGetDictionaryItem {
  dictionaryId: number;
  statusCode: number;
  defaultMessage: string;
}

export const categoriaGetDictionary: Record<
  RValidationsNamesCategoriaGet,
  CategoriaGetDictionaryItem
> = {
  notFound: {
    dictionaryId: 2002001,
    statusCode: 404,
    defaultMessage: "Categoría no encontrada",
  },
  errorFetching: {
    dictionaryId: 2002002,
    statusCode: 500,
    defaultMessage: "Error al obtener categoría",
  },
};

export interface ErrorDictionaryGenerator<T extends string> {
  create(args: { validationName: T; parameters?: string[] }): Promise<{
    statusCode: number;
    message: string;
  }>;
}

export type DictionaryCategoriaGetType = typeof categoriaGetDictionary;
