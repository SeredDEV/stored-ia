/**
 * Diccionario de errores para el servicio de nueva contraseña.
 * Centraliza mensajes y códigos de error.
 */

export type RValidationsNamesAuthNewPassword =
  | "invalidToken"
  | "tokenExpired"
  | "passwordRequired"
  | "passwordTooShort"
  | "passwordTooWeak"
  | "rateLimitExceeded";

export interface AuthNewPasswordDictionaryItem {
  dictionaryId: number;
  statusCode: number;
  defaultMessage: string;
}

export const authNewPasswordDictionary: Record<
  RValidationsNamesAuthNewPassword,
  AuthNewPasswordDictionaryItem
> = {
  invalidToken: {
    dictionaryId: 1000201,
    statusCode: 401,
    defaultMessage:
      "El token de restablecimiento no es válido. Por favor solicita un nuevo enlace de recuperación.",
  },
  tokenExpired: {
    dictionaryId: 1000202,
    statusCode: 401,
    defaultMessage:
      "El token de restablecimiento ha expirado. Por favor solicita un nuevo enlace de recuperación.",
  },
  passwordRequired: {
    dictionaryId: 1000203,
    statusCode: 400,
    defaultMessage: "La contraseña es requerida",
  },
  passwordTooShort: {
    dictionaryId: 1000204,
    statusCode: 400,
    defaultMessage: "La contraseña debe tener al menos 6 caracteres",
  },
  passwordTooWeak: {
    dictionaryId: 1000205,
    statusCode: 400,
    defaultMessage:
      "La contraseña no cumple con los requisitos de seguridad. Por favor elige una contraseña más segura.",
  },
  rateLimitExceeded: {
    dictionaryId: 1000206,
    statusCode: 429,
    defaultMessage:
      "Demasiados intentos. Por favor espera unos minutos antes de intentar nuevamente.",
  },
};

export interface ErrorDictionaryGenerator<T extends string> {
  create(args: { validationName: T; parameters?: string[] }): Promise<{
    statusCode: number;
    message: string;
  }>;
}

export type DictionaryAuthNewPasswordType =
  typeof authNewPasswordDictionary;

