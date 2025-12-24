/**
 * Diccionario de errores para el servicio de reset de contraseña.
 * Centraliza mensajes y códigos de error.
 */

export type RValidationsNamesAuthResetPassword =
  | "rateLimitExceeded"
  | "invalidToken"
  | "tokenExpired"
  | "smtpNotConfigured"
  | "redirectUrlNotAllowed"
  | "resendDomainNotVerified";

export interface AuthResetPasswordDictionaryItem {
  dictionaryId: number;
  statusCode: number;
  defaultMessage: string;
}

export const authResetPasswordDictionary: Record<
  RValidationsNamesAuthResetPassword,
  AuthResetPasswordDictionaryItem
> = {
  rateLimitExceeded: {
    dictionaryId: 1000101,
    statusCode: 429,
    defaultMessage:
      "Ya se ha enviado un enlace de recuperación. Por favor espera 2 minutos antes de solicitar otro enlace.",
  },
  invalidToken: {
    dictionaryId: 1000102,
    statusCode: 401,
    defaultMessage:
      "El token de restablecimiento es inválido. Por favor solicita un nuevo enlace.",
  },
  tokenExpired: {
    dictionaryId: 1000103,
    statusCode: 401,
    defaultMessage:
      "El token de restablecimiento ha expirado. Por favor solicita un nuevo enlace.",
  },
  smtpNotConfigured: {
    dictionaryId: 1000104,
    statusCode: 401,
    defaultMessage:
      "El email no está autorizado para recibir correos. Por favor configura un SMTP personalizado en Supabase.",
  },
  redirectUrlNotAllowed: {
    dictionaryId: 1000105,
    statusCode: 401,
    defaultMessage:
      "La URL de redirección no está permitida. Por favor configura la URL en las URLs permitidas de Supabase.",
  },
  resendDomainNotVerified: {
    dictionaryId: 1000106,
    statusCode: 401,
    defaultMessage:
      "Para enviar emails a otros destinatarios, necesitas verificar un dominio en Resend. Por ahora, solo puedes enviar a tu email de cuenta de Resend.",
  },
};

export interface ErrorDictionaryGenerator<T extends string> {
  create(args: { validationName: T; parameters?: string[] }): Promise<{
    statusCode: number;
    message: string;
  }>;
}

export type DictionaryAuthResetPasswordType =
  typeof authResetPasswordDictionary;
