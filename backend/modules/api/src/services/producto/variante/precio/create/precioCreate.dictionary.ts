export const RValidationsNamesPrecioCreate = {
  ERROR_CREATING: "ERROR_CREATING",
  VARIANTE_NOT_FOUND: "VARIANTE_NOT_FOUND",
  ERROR_CREATING_CONJUNTO: "ERROR_CREATING_CONJUNTO",
  ERROR_CREATING_RELACION: "ERROR_CREATING_RELACION",
  ERROR_CREATING_PRECIO: "ERROR_CREATING_PRECIO",
} as const;

export type RValidationsNamesPrecioCreate =
  (typeof RValidationsNamesPrecioCreate)[keyof typeof RValidationsNamesPrecioCreate];

export type PrecioCreateDictionaryItem = {
  dictionaryId: RValidationsNamesPrecioCreate;
  statusCode: number;
  defaultMessage: string;
};

export type DictionaryPrecioCreateType = {
  [key in RValidationsNamesPrecioCreate]: PrecioCreateDictionaryItem;
};

export const precioCreateDictionary: DictionaryPrecioCreateType = {
  ERROR_CREATING: {
    dictionaryId: "ERROR_CREATING",
    statusCode: 500,
    defaultMessage: "Error al crear el precio",
  },
  VARIANTE_NOT_FOUND: {
    dictionaryId: "VARIANTE_NOT_FOUND",
    statusCode: 404,
    defaultMessage: "Variante no encontrada",
  },
  ERROR_CREATING_CONJUNTO: {
    dictionaryId: "ERROR_CREATING_CONJUNTO",
    statusCode: 500,
    defaultMessage: "Error al crear el conjunto de precios",
  },
  ERROR_CREATING_RELACION: {
    dictionaryId: "ERROR_CREATING_RELACION",
    statusCode: 500,
    defaultMessage: "Error al relacionar variante con conjunto de precios",
  },
  ERROR_CREATING_PRECIO: {
    dictionaryId: "ERROR_CREATING_PRECIO",
    statusCode: 500,
    defaultMessage: "Error al crear el precio",
  },
};

export type ErrorDictionaryGenerator<T extends string> = (
  validationName: T
) => PrecioCreateDictionaryItem;

export const generateErrorDictionary = (
  validationName: RValidationsNamesPrecioCreate
): PrecioCreateDictionaryItem => {
  return precioCreateDictionary[validationName];
};
