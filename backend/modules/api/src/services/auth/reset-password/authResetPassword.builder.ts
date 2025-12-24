import { createClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../config/env";
import type { IAuthResetPasswordService } from "../authModel";
import { AuthResetPasswordService } from "./authResetPassword.service";
import type {
  ErrorDictionaryGenerator,
  RValidationsNamesAuthResetPassword,
} from "./authResetPassword.dictionary";

export interface AuthResetPasswordServiceBuilderArgs {
  errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesAuthResetPassword>;
}

/**
 * Builder para crear el servicio de reset de contraseña.
 * Similar al patrón del ejemplo: MAuthLoginBuilder.build().
 */
export class AuthResetPasswordServiceBuilder {
  /**
   * Crea el servicio de reset de contraseña usando Supabase.
   * Puede recibir opcionalmente un generador de errores del diccionario.
   */
  public static build(
    args?: AuthResetPasswordServiceBuilderArgs
  ): IAuthResetPasswordService {
    const { url, anonKey } = ensureSupabaseConfig();
    const client = createClient(url, anonKey);

    return new AuthResetPasswordService(client, args?.errorDictionaryGenerator);
  }
}

