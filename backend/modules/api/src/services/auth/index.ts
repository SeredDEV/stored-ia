import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../config/env";

/**
 * Servicio de autenticación basado en Supabase.
 * Se implementa como clase para poder inyectarlo (por ejemplo, en tests o en otros módulos).
 */
export interface AuthServiceResult {
  status: number;
  body: any;
}

export class AuthService {
  private client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  /**
   * Fábrica para crear el servicio usando la configuración centralizada.
   */
  static fromConfig(): AuthService {
    const { url, anonKey } = ensureSupabaseConfig();
    const client = createClient(url, anonKey);
    return new AuthService(client);
  }

  /**
   * Login por email/password usando Supabase Auth.
   * Valida contra la DB si el usuario existe y si la contraseña es correcta.
   * Asume que los parámetros ya fueron validados en la ruta (formato, etc.).
   * Devuelve un resultado listo para ser enviado por HTTP.
   */
  async loginWithEmailPassword(email: string, password: string): Promise<AuthServiceResult> {
    // Intentamos hacer login con Supabase (valida contra la DB)
    const result = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    // Si hay error, analizamos el tipo de error de la DB
    if (result.error) {
      const errorMessage = result.error.message.toLowerCase();
      const errorCode = result.error.status || 401;

      // Supabase devuelve "Invalid login credentials" tanto para usuario inexistente
      // como para contraseña incorrecta (por seguridad, no distingue)
      if (
        errorMessage.includes("invalid login credentials") ||
        errorMessage.includes("invalid credentials") ||
        errorMessage.includes("email not confirmed")
      ) {
        return {
          status: errorCode,
          body: {
            error:
              "Credenciales inválidas. El usuario no existe o la contraseña es incorrecta",
          },
        };
      }

      // Otros errores específicos de la DB
      if (errorMessage.includes("email rate limit")) {
        return {
          status: 429,
          body: {
            error:
              "Demasiados intentos. Por favor espera unos minutos antes de intentar nuevamente",
          },
        };
      }

      // Error desconocido de Supabase
      return {
        status: errorCode,
        body: { error: result.error.message },
      };
    }

    // Éxito: devolvemos tokens y usuario
    const { session, user } = result.data;

    return {
      status: 200,
      body: {
        access_token: session?.access_token,
        refresh_token: session?.refresh_token,
        user,
      },
    };
  }
}
