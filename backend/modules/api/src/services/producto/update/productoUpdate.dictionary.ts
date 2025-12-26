export type RValidationsNamesProductoUpdate = "notFound" | "errorUpdating" | "slugAlreadyExists";

export interface ProductoUpdateDictionaryItem {
  dictionaryId: number;
  statusCode: number;
  defaultMessage: string;
}

export const productoUpdateDictionary: Record<
  RValidationsNamesProductoUpdate,
  ProductoUpdateDictionaryItem
> = {
  notFound: {
    dictionaryId: 2002001,
    statusCode: 404,
    defaultMessage: "Producto no encontrado",
  },
  errorUpdating: {
    dictionaryId: 2002002,
    statusCode: 500,
    defaultMessage: "Error al actualizar el producto",
  },
  slugAlreadyExists: {
    dictionaryId: 2002003,
    statusCode: 409,
    defaultMessage: "Ya existe un producto con ese slug",
  },
};

export type ErrorDictionaryGenerator<T extends string> = {
  create: (params: {
    validationName: T;
    parameters?: Array<string | number>;
  }) => Promise<Error>;
};

