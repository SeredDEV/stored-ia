/**
 * Diccionario de errores para el servicio de creación de productos.
 */

export type RValidationsNamesProductoCreate =
  | "productoCreationFailed"
  | "invalidSlug"
  | "slugAlreadyExists"
  | "invalidVariantOptions"
  | "tipoProductoNotFound"
  | "coleccionNotFound"
  | "categoriaNotFound"
  | "etiquetaNotFound";

export interface ProductoCreateDictionaryItem {
  dictionaryId: number;
  statusCode: number;
  defaultMessage: string;
}

export const productoCreateDictionary: Record<
  RValidationsNamesProductoCreate,
  ProductoCreateDictionaryItem
> = {
  productoCreationFailed: {
    dictionaryId: 2000001,
    statusCode: 500,
    defaultMessage: "Error al crear el producto",
  },
  invalidSlug: {
    dictionaryId: 2000002,
    statusCode: 400,
    defaultMessage: "El slug del producto es inválido",
  },
  slugAlreadyExists: {
    dictionaryId: 2000003,
    statusCode: 409,
    defaultMessage: "Ya existe un producto con ese slug",
  },
  invalidVariantOptions: {
    dictionaryId: 2000004,
    statusCode: 400,
    defaultMessage: "Las opciones de variantes son inválidas",
  },
  tipoProductoNotFound: {
    dictionaryId: 2000005,
    statusCode: 404,
    defaultMessage: "El tipo de producto especificado no existe",
  },
  coleccionNotFound: {
    dictionaryId: 2000006,
    statusCode: 404,
    defaultMessage: "La colección especificada no existe",
  },
  categoriaNotFound: {
    dictionaryId: 2000007,
    statusCode: 404,
    defaultMessage: "Una o más categorías especificadas no existen",
  },
  etiquetaNotFound: {
    dictionaryId: 2000008,
    statusCode: 404,
    defaultMessage: "Una o más etiquetas especificadas no existen",
  },
};

export interface ErrorDictionaryGenerator<T extends string> {
  create(args: { validationName: T; parameters?: string[] }): Promise<{
    statusCode: number;
    message: string;
  }>;
}

export type DictionaryProductoCreateType = typeof productoCreateDictionary;

