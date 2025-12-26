export type RValidationsNamesProductoGet = "notFound";

export interface ProductoGetDictionaryItem {
  dictionaryId: number;
  statusCode: number;
  defaultMessage: string;
}

export const productoGetDictionary: Record<
  RValidationsNamesProductoGet,
  ProductoGetDictionaryItem
> = {
  notFound: {
    dictionaryId: 2001001,
    statusCode: 404,
    defaultMessage: "Producto no encontrado",
  },
};

export type ErrorDictionaryGenerator<T extends string> = {
  create: (params: {
    validationName: T;
    parameters?: Array<string | number>;
  }) => Promise<Error>;
};
