import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../config/env";
import {
  InvalidCredentialsError,
  RateLimitError,
} from "../../../lib/authError";
import type { IAuthResetPasswordService } from "../authModel";
import type {
  ErrorDictionaryGenerator,
  RValidationsNamesAuthResetPassword,
} from "./authResetPassword.dictionary";

/**
 * Servicio de reset de contraseña.
 * Maneja la lógica de solicitud y confirmación de reset de contraseña.
 */
export class AuthResetPasswordService implements IAuthResetPasswordService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesAuthResetPassword>
  ) {}

  /**
   * Solicita un reset de contraseña.
   * Envía un email con un token para restablecer la contraseña.
   */
  async requestPasswordReset(email: string): Promise<void> {
    const redirectUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/new-password`;

    console.log("[AuthResetPassword] Requesting password reset for:", email);
    console.log("[AuthResetPassword] Redirect URL:", redirectUrl);

    const result = await this.supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (result.error) {
      const errorMessage = result.error.message.toLowerCase();

      // Logueamos el error completo para debugging
      console.error("[AuthResetPassword] Password reset request error:", {
        message: result.error.message,
        status: result.error.status,
        error: result.error,
      });

      // Si es un error de URL no permitida, damos un mensaje más específico
      if (
        errorMessage.includes("redirect") ||
        errorMessage.includes("url") ||
        errorMessage.includes("not allowed")
      ) {
        if (this.errorDictionaryGenerator) {
          const error = await this.errorDictionaryGenerator.create({
            validationName: "redirectUrlNotAllowed",
            parameters: [redirectUrl],
          });
          throw new InvalidCredentialsError(error.message);
        }

        throw new InvalidCredentialsError(
          `La URL de redirección no está permitida. Por favor configura "${redirectUrl}" en las URLs permitidas de Supabase.`
        );
      }

      // Si es un error de Resend (solo permite enviar a tu propio email en modo prueba)
      // El error viene como: "gomail: could not send email 1: 450 You can only send testing emails..."
      if (
        errorMessage.includes("can only send testing emails") ||
        errorMessage.includes("verify a domain") ||
        errorMessage.includes("resend.com/domains") ||
        errorMessage.includes("gomail: could not send email") ||
        (errorMessage.includes("450") && errorMessage.includes("resend"))
      ) {
        if (this.errorDictionaryGenerator) {
          const error = await this.errorDictionaryGenerator.create({
            validationName: "resendDomainNotVerified",
          });
          throw new InvalidCredentialsError(error.message);
        }

        throw new InvalidCredentialsError(
          "Para enviar emails a otros destinatarios, necesitas verificar un dominio en Resend. Por ahora, solo puedes enviar a tu email de cuenta de Resend (sistemasmi13@gmail.com)."
        );
      }

      // Si es un error de rate limit (429) - Supabase limita las solicitudes muy seguidas
      if (
        result.error.status === 429 ||
        errorMessage.includes("rate limit") ||
        errorMessage.includes("for security purposes") ||
        errorMessage.includes("you can only request this after")
      ) {
        if (this.errorDictionaryGenerator) {
          const error = await this.errorDictionaryGenerator.create({
            validationName: "rateLimitExceeded",
          });
          throw new RateLimitError(error.message);
        }

        throw new RateLimitError(
          "Ya se ha enviado un enlace de recuperación. Por favor espera 2 minutos antes de solicitar otro enlace."
        );
      }

      // Si es un error de email no autorizado (SMTP)
      if (
        errorMessage.includes("not authorized") ||
        errorMessage.includes("email address")
      ) {
        if (this.errorDictionaryGenerator) {
          const error = await this.errorDictionaryGenerator.create({
            validationName: "smtpNotConfigured",
          });
          throw new InvalidCredentialsError(error.message);
        }

        throw new InvalidCredentialsError(
          "El email no está autorizado para recibir correos. Por favor configura un SMTP personalizado en Supabase."
        );
      }

      // Por seguridad, no revelamos si el email existe o no
      // Pero lanzamos el error genérico
      throw new InvalidCredentialsError(
        "No se pudo procesar la solicitud. Por favor intenta nuevamente."
      );
    }

    // Éxito: el email se envió (si el usuario existe)
    console.log("[AuthResetPassword] Password reset email sent successfully");
    // Por seguridad, siempre respondemos igual
  }

  /**
   * Confirma el reset de contraseña.
   * Valida el token y actualiza la contraseña del usuario.
   *
   * Nota: El token es el access_token que Supabase envía en el hash de la URL
   * cuando el usuario hace clic en el enlace del email de recuperación.
   */
  async confirmPasswordReset(
    token: string,
    newPassword: string
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

    // Validar longitud mínima de contraseña (el validator ya lo hace, pero por seguridad aquí también)
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

    console.log("[AuthResetPassword] Confirming password reset with token");

    // Crear un cliente temporal con el token de recuperación
    // Esto establece la sesión de recuperación
    const { createClient } = await import("@supabase/supabase-js");
    const { url, anonKey } = await import("../../../config/env.js").then((m) =>
      m.ensureSupabaseConfig()
    );

    const tempClient = createClient(url, anonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // Intentar actualizar la contraseña usando el token de recuperación
    const result = await tempClient.auth.updateUser({
      password: newPassword,
    });

    if (result.error) {
      const errorMessage = result.error.message.toLowerCase();

      console.error("[AuthResetPassword] Password reset confirmation error:", {
        message: result.error.message,
        status: result.error.status,
        error: result.error,
      });

      // Token expirado
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

      // Token inválido
      if (
        errorMessage.includes("invalid") ||
        errorMessage.includes("token") ||
        errorMessage.includes("jwt") ||
        errorMessage.includes("malformed") ||
        errorMessage.includes("invalid signature")
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
        result.error.message ||
          "No se pudo actualizar la contraseña. Por favor intenta nuevamente."
      );
    }

    console.log("[AuthResetPassword] Password reset confirmed successfully");
  }
}
