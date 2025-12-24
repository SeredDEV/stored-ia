import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../config/env";
import {
  InvalidCredentialsError,
  RateLimitError,
} from "../../../lib/authError";
import type { IAuthNewPasswordService } from "../authModel";
import type {
  ErrorDictionaryGenerator,
  RValidationsNamesAuthNewPassword,
} from "./authNewPassword.dictionary";

/**
 * Servicio de nueva contraseña.
 * Maneja la lógica de establecer una nueva contraseña después del reset.
 */
export class AuthNewPasswordService implements IAuthNewPasswordService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesAuthNewPassword>
  ) {}

  /**
   * Establece una nueva contraseña usando el token de recuperación.
   * Valida el token y actualiza la contraseña del usuario.
   *
   * Nota: Los tokens vienen del hash de la URL que Supabase envía:
   * #access_token=...&refresh_token=...&type=recovery
   */
  async setNewPassword(
    token: string,
    newPassword: string,
    refreshToken?: string
  ): Promise<void> {
    // Validaciones básicas
    if (!token || token.trim().length === 0) {
      if (this.errorDictionaryGenerator) {
        const error = await this.errorDictionaryGenerator.create({
          validationName: "invalidToken",
        });
        throw new InvalidCredentialsError(error.message);
      }
      throw new InvalidCredentialsError(
        "Token de restablecimiento no válido. Por favor solicita un nuevo enlace."
      );
    }

    if (!newPassword || newPassword.trim().length === 0) {
      if (this.errorDictionaryGenerator) {
        const error = await this.errorDictionaryGenerator.create({
          validationName: "passwordRequired",
        });
        throw new InvalidCredentialsError(error.message);
      }
      throw new InvalidCredentialsError("La contraseña es requerida");
    }

    // Validar longitud mínima de contraseña
    if (newPassword.length < 6) {
      if (this.errorDictionaryGenerator) {
        const error = await this.errorDictionaryGenerator.create({
          validationName: "passwordTooShort",
        });
        throw new InvalidCredentialsError(error.message);
      }
      throw new InvalidCredentialsError(
        "La contraseña debe tener al menos 6 caracteres"
      );
    }

    console.log("[AuthNewPassword] Setting new password with token");

    // Crear un cliente temporal para establecer la sesión de recuperación
    const { createClient } = await import("@supabase/supabase-js");
    const { url, anonKey } = await import("../../../config/env").then((m) =>
      m.ensureSupabaseConfig()
    );

    const tempClient = createClient(url, anonKey);

    // Establecer la sesión usando los tokens de recuperación
    // Si tenemos refresh_token, lo usamos; si no, intentamos solo con access_token
    const sessionResult = await tempClient.auth.setSession({
      access_token: token,
      refresh_token: refreshToken || token, // Usar refresh_token si está disponible
    });

    // Si falla, intentar con el token directamente en el header
    let clientToUse = tempClient;
    if (sessionResult.error) {
      console.log("[AuthNewPassword] setSession failed, trying with token in header");
      
      // Crear cliente con token en el header
      clientToUse = createClient(url, anonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      // Validar que el token es válido intentando obtener el usuario
      const { error: userError } = await clientToUse.auth.getUser();

      if (userError) {
        const errorMessage = userError.message.toLowerCase();
        
        console.error("[AuthNewPassword] Token validation error:", {
          message: userError.message,
          status: userError.status,
        });

        if (
          errorMessage.includes("expired") ||
          errorMessage.includes("token has expired") ||
          errorMessage.includes("session expired")
        ) {
          if (this.errorDictionaryGenerator) {
            const error = await this.errorDictionaryGenerator.create({
              validationName: "tokenExpired",
            });
            throw new InvalidCredentialsError(error.message);
          }
          throw new InvalidCredentialsError(
            "El token de restablecimiento ha expirado. Por favor solicita un nuevo enlace de recuperación."
          );
        }

        if (
          errorMessage.includes("invalid") ||
          errorMessage.includes("token") ||
          errorMessage.includes("jwt") ||
          errorMessage.includes("malformed") ||
          errorMessage.includes("session missing")
        ) {
          if (this.errorDictionaryGenerator) {
            const error = await this.errorDictionaryGenerator.create({
              validationName: "invalidToken",
            });
            throw new InvalidCredentialsError(error.message);
          }
          throw new InvalidCredentialsError(
            "El token de restablecimiento no es válido. Por favor solicita un nuevo enlace de recuperación."
          );
        }

        throw new InvalidCredentialsError(
          userError.message || "No se pudo validar el token de recuperación."
        );
      }
    }

    // Intentar actualizar la contraseña
    const result = await clientToUse.auth.updateUser({
      password: newPassword,
    });

    if (result.error) {
      const errorMessage = result.error.message.toLowerCase();

      console.error("[AuthNewPassword] Set new password error:", {
        message: result.error.message,
        status: result.error.status,
        error: result.error,
      });

      // Error de sesión (ya lo manejamos arriba, pero por si acaso)
      if (
        errorMessage.includes("session") &&
        (errorMessage.includes("missing") || errorMessage.includes("expired"))
      ) {
        if (this.errorDictionaryGenerator) {
          const error = await this.errorDictionaryGenerator.create({
            validationName: "tokenExpired",
          });
          throw new InvalidCredentialsError(error.message);
        }
        throw new InvalidCredentialsError(
          "La sesión de recuperación no es válida. Por favor solicita un nuevo enlace de recuperación."
        );
      }

      // Error de rate limiting
      if (
        result.error.status === 429 ||
        errorMessage.includes("rate limit") ||
        errorMessage.includes("too many requests")
      ) {
        if (this.errorDictionaryGenerator) {
          const error = await this.errorDictionaryGenerator.create({
            validationName: "rateLimitExceeded",
          });
          throw new RateLimitError(error.message);
        }

        throw new RateLimitError(
          "Demasiados intentos. Por favor espera unos minutos antes de intentar nuevamente."
        );
      }

      // Error de validación de contraseña (de Supabase)
      if (
        errorMessage.includes("password") &&
        (errorMessage.includes("weak") ||
          errorMessage.includes("validation") ||
          errorMessage.includes("does not meet"))
      ) {
        if (this.errorDictionaryGenerator) {
          const error = await this.errorDictionaryGenerator.create({
            validationName: "passwordTooWeak",
          });
          throw new InvalidCredentialsError(error.message);
        }

        throw new InvalidCredentialsError(
          "La contraseña no cumple con los requisitos de seguridad. Por favor elige una contraseña más segura."
        );
      }

      // Error genérico
      throw new InvalidCredentialsError(
        result.error.message || "No se pudo actualizar la contraseña. Por favor intenta nuevamente."
      );
    }

    console.log("[AuthNewPassword] New password set successfully");
  }
}

