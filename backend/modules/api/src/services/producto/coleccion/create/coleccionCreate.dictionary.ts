/**
 * Diccionario de errores para crear colección.
 */

export type RValidationsNamesColeccionCreate =
  | "slugDuplicated"
  | "errorCreating";

export interface ColeccionCreateDictionaryItem {
  dictionaryId: number;
  statusCode: number;
  defaultMessage: string;
}

export const coleccionCreateDictionary: Record<
  RValidationsNamesColeccionCreate,
  ColeccionCreateDictionaryItem
> = {
  slugDuplicated: {
    dictionaryId: 2011001,
    statusCode: 409,
    defaultMessage: "Ya existe una colección con ese slug",
  },
  errorCreating: {
    dictionaryId: 2011002,
    statusCode: 500,
    defaultMessage: "Error al crear colección",
  },
};

export interface ErrorDictionaryGenerator<T extends string> {
  create(args: { validationName: T; parameters?: string[] }): Promise<{
    statusCode: number;
    message: string;
  }>;
}

export type DictionaryColeccionCreateType = typeof coleccionCreateDictionary;

