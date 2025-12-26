/**
 * Diccionario de errores para eliminar categoría.
 */

export type RValidationsNamesCategoriaDelete =
  | "notFound"
  | "errorDeleting"
  | "hasChildren";

export interface CategoriaDeleteDictionaryItem {
  dictionaryId: number;
  statusCode: number;
  defaultMessage: string;
}

export const categoriaDeleteDictionary: Record<
  RValidationsNamesCategoriaDelete,
  CategoriaDeleteDictionaryItem
> = {
  notFound: {
    dictionaryId: 2004001,
    statusCode: 404,
    defaultMessage: "Categoría no encontrada",
  },
  errorDeleting: {
    dictionaryId: 2004002,
    statusCode: 500,
    defaultMessage: "Error al eliminar categoría",
  },
  hasChildren: {
    dictionaryId: 2004003,
    statusCode: 400,
    defaultMessage: "No se puede eliminar una categoría con subcategorías",
  },
};

export interface ErrorDictionaryGenerator<T extends string> {
  create(args: { validationName: T; parameters?: string[] }): Promise<{
    statusCode: number;
    message: string;
  }>;
}

export type DictionaryCategoriaDeleteType = typeof categoriaDeleteDictionary;
