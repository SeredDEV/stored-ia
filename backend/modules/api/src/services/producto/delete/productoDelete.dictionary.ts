export type RValidationsNamesProductoDelete = "notFound" | "errorDeleting";

export interface ProductoDeleteDictionaryItem {
  dictionaryId: number;
  statusCode: number;
  defaultMessage: string;
}

export const productoDeleteDictionary: Record<
  RValidationsNamesProductoDelete,
  ProductoDeleteDictionaryItem
> = {
  notFound: {
    dictionaryId: 2003001,
    statusCode: 404,
    defaultMessage: "Producto no encontrado",
  },
  errorDeleting: {
    dictionaryId: 2003002,
    statusCode: 500,
    defaultMessage: "Error al eliminar el producto",
  },
};

export type ErrorDictionaryGenerator<T extends string> = {
  create: (params: {
    validationName: T;
    parameters?: Array<string | number>;
  }) => Promise<Error>;
};

