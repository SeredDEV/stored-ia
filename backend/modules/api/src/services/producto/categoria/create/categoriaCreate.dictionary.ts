/**
 * Diccionario de errores para crear categoría.
 */

export type RValidationsNamesCategoriaCreate =
  | "categoriaPadreNotFound"
  | "errorCreating";

export interface CategoriaCreateDictionaryItem {
  dictionaryId: number;
  statusCode: number;
  defaultMessage: string;
}

export const categoriaCreateDictionary: Record<
  RValidationsNamesCategoriaCreate,
  CategoriaCreateDictionaryItem
> = {
  categoriaPadreNotFound: {
    dictionaryId: 2001001,
    statusCode: 404,
    defaultMessage: "Categoría padre no encontrada",
  },
  errorCreating: {
    dictionaryId: 2001002,
    statusCode: 500,
    defaultMessage: "Error al crear categoría",
  },
};

export interface ErrorDictionaryGenerator<T extends string> {
  create(args: { validationName: T; parameters?: string[] }): Promise<{
    statusCode: number;
    message: string;
  }>;
}

export type DictionaryCategoriaCreateType = typeof categoriaCreateDictionary;
