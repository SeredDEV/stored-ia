/**
 * Diccionario de errores para el servicio de autenticación.
 * Similar al patrón del ejemplo: centraliza mensajes y códigos de error.
 */

export type RValidationsNamesAuthLogin =
  | "invalidCredentials"
  | "rateLimitExceeded"
  | "userNotExist"
  | "userPasswordWrong"
  | "userIsInactive";

export interface AuthLoginDictionaryItem {
  dictionaryId: number;
  statusCode: number;
  defaultMessage: string;
}

export const authLoginDictionary: Record<
  RValidationsNamesAuthLogin,
  AuthLoginDictionaryItem
> = {
  invalidCredentials: {
    dictionaryId: 1000001,
    statusCode: 401,
    defaultMessage:
      "Credenciales inválidas. El usuario no existe o la contraseña es incorrecta",
  },
  rateLimitExceeded: {
    dictionaryId: 1000002,
    statusCode: 429,
    defaultMessage:
      "Demasiados intentos. Por favor espera unos minutos antes de intentar nuevamente",
  },
  userNotExist: {
    dictionaryId: 3,
    statusCode: 404,
    defaultMessage: "El usuario no existe",
  },
  userPasswordWrong: {
    dictionaryId: 1000004,
    statusCode: 401,
    defaultMessage: "La contraseña es incorrecta",
  },
  userIsInactive: {
    dictionaryId: 1000005,
    statusCode: 401,
    defaultMessage: "El usuario no está activo",
  },
};

export interface ErrorDictionaryGenerator<T extends string> {
  create(args: { validationName: T; parameters?: string[] }): Promise<{
    statusCode: number;
    message: string;
  }>;
}

export type DictionaryAuthLoginType = typeof authLoginDictionary;
