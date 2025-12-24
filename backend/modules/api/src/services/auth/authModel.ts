/**
 * Modelos de autenticación.
 * Define las interfaces de datos que se usan en el servicio de autenticación.
 * Similar al patrón del ejemplo: sAuthModel.ts
 */

/**
 * Modelo de respuesta de login.
 * Contiene los datos del usuario autenticado y sus tokens.
 */
export interface AuthLoginModel {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    email_confirmed_at?: string;
    phone?: string;
    confirmed_at?: string;
    last_sign_in_at?: string;
    app_metadata?: {
      provider?: string;
      providers?: string[];
      role?: string;
    };
    user_metadata?: {
      email_verified?: boolean;
      role?: string;
    };
    identities?: Array<{
      identity_id: string;
      id: string;
      user_id: string;
      identity_data: {
        email: string;
        email_verified: boolean;
        phone_verified: boolean;
        sub: string;
      };
      provider: string;
      last_sign_in_at?: string;
      created_at?: string;
      updated_at?: string;
      email?: string;
    }>;
    created_at?: string;
    updated_at?: string;
    is_anonymous?: boolean;
  };
}

/**
 * Modelo de datos de usuario para autenticación.
 * Representa la información básica del usuario necesaria para el login.
 */
export interface AuthUserData {
  id: string;
  email: string;
  role?: string;
}

/**
 * Modelo de resultado del servicio de autenticación.
 * Contiene el estado HTTP y el cuerpo de la respuesta.
 */
export interface AuthServiceResult {
  status: number;
  body: AuthLoginModel | { error: string; details?: any[] };
}

/**
 * Interfaz del servicio de autenticación.
 * Define el contrato que debe cumplir cualquier implementación.
 */
export interface IAuthService {
  /**
   * Login por email/password.
   * Valida contra la DB si el usuario existe y si la contraseña es correcta.
   * Si hay error, lanza una excepción (AuthError).
   * Si es exitoso, devuelve los datos del login.
   */
  loginWithEmailPassword(
    email: string,
    password: string
  ): Promise<AuthLoginModel>;

  /**
   * Registra la acción del usuario (logging de auditoría).
   */
  logUserAction(user: AuthLoginModel): Promise<void>;
}
