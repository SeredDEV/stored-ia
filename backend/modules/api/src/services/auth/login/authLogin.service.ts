import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../config/env";
import type { AuthLoginModel, IAuthService } from "../authModel";
import type {
  ErrorDictionaryGenerator,
  RValidationsNamesAuthLogin,
} from "./authLogin.dictionary";
import { InvalidCredentialsError, RateLimitError } from "../../../lib/authError";

/**
 * Implementación del servicio de autenticación usando Supabase.
 * Similar al patrón del ejemplo: DAuthLoginService implementa MAuthLogin.
 */
export class AuthService implements IAuthService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesAuthLogin>
  ) {}

  /**
   * Fábrica para crear el servicio usando la configuración centralizada.
   */
  static fromConfig(): AuthService {
    const { url, anonKey } = ensureSupabaseConfig();
    const client = createClient(url, anonKey);
    return new AuthService(client);
  }

  async loginWithEmailPassword(
    email: string,
    password: string
  ): Promise<AuthLoginModel> {
    // Intentamos hacer login con Supabase (valida contra la DB)
    const result = await this.supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    // Si hay error, lanzamos una excepción (como en el ejemplo)
    if (result.error) {
      const errorMessage = result.error.message.toLowerCase();

      // Supabase devuelve "Invalid login credentials" tanto para usuario inexistente
      // como para contraseña incorrecta (por seguridad, no distingue)
      if (
        errorMessage.includes("invalid login credentials") ||
        errorMessage.includes("invalid credentials") ||
        errorMessage.includes("email not confirmed")
      ) {
        // Si tenemos errorDictionaryGenerator, usamos el diccionario
        if (this.errorDictionaryGenerator) {
          const error = await this.errorDictionaryGenerator.create({
            validationName: "invalidCredentials",
            parameters: [email],
          });
          throw new InvalidCredentialsError(error.message);
        }

        // Fallback sin diccionario
        throw new InvalidCredentialsError(
          "Credenciales inválidas. El usuario no existe o la contraseña es incorrecta"
        );
      }

      // Otros errores específicos de la DB
      if (errorMessage.includes("email rate limit")) {
        if (this.errorDictionaryGenerator) {
          const error = await this.errorDictionaryGenerator.create({
            validationName: "rateLimitExceeded",
            parameters: [],
          });
          throw new RateLimitError(error.message);
        }

        throw new RateLimitError(
          "Demasiados intentos. Por favor espera unos minutos antes de intentar nuevamente"
        );
      }

      // Error desconocido de Supabase
      throw new InvalidCredentialsError(result.error.message);
    }

    // Éxito: devolvemos tokens y usuario
    const { session, user } = result.data;

    return {
      access_token: session?.access_token || "",
      refresh_token: session?.refresh_token || "",
      user: {
        id: user.id,
        email: user.email || "",
        email_confirmed_at: user.email_confirmed_at,
        phone: user.phone,
        confirmed_at: user.confirmed_at,
        last_sign_in_at: user.last_sign_in_at,
        app_metadata: user.app_metadata,
        user_metadata: user.user_metadata,
        identities: user.identities?.map((identity) => ({
          identity_id: identity.identity_id,
          id: identity.id,
          user_id: identity.user_id,
          identity_data: identity.identity_data as {
            email: string;
            email_verified: boolean;
            phone_verified: boolean;
            sub: string;
          },
          provider: identity.provider,
          last_sign_in_at: identity.last_sign_in_at,
          created_at: identity.created_at,
          updated_at: identity.updated_at,
          email: (identity as any).email || user.email,
        })),
        created_at: user.created_at,
        updated_at: user.updated_at,
        is_anonymous: user.is_anonymous,
      },
    };
  }

  /**
   * Registra la acción del usuario (logging de auditoría).
   * Similar al patrón del ejemplo: logUserAction.
   */
  async logUserAction(user: AuthLoginModel): Promise<void> {
    // TODO: Implementar logging de acciones del usuario
    // Por ahora solo logueamos en consola
    console.log(`[Auth] User action logged:`, {
      userId: user.user.id,
      email: user.user.email,
      timestamp: new Date().toISOString(),
    });
  }
}
