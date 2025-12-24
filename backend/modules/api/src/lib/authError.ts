/**
 * Errores de autenticación.
 * Se lanzan cuando hay problemas en el proceso de autenticación.
 */
export class AuthError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(message: string = "Credenciales inválidas") {
    super(401, message);
    this.name = "InvalidCredentialsError";
  }
}

export class RateLimitError extends AuthError {
  constructor(message: string = "Demasiados intentos") {
    super(429, message);
    this.name = "RateLimitError";
  }
}
