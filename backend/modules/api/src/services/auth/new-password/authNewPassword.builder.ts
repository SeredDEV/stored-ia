import { createClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../config/env";
import type { IAuthNewPasswordService } from "../authModel";
import { AuthNewPasswordService } from "./authNewPassword.service";
import type {
  ErrorDictionaryGenerator,
  RValidationsNamesAuthNewPassword,
} from "./authNewPassword.dictionary";

export interface AuthNewPasswordServiceBuilderArgs {
  errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesAuthNewPassword>;
}

/**
 * Builder para crear el servicio de nueva contraseña.
 * Similar al patrón del ejemplo: MAuthLoginBuilder.build().
 */
export class AuthNewPasswordServiceBuilder {
  /**
   * Crea el servicio de nueva contraseña usando Supabase.
   * Puede recibir opcionalmente un generador de errores del diccionario.
   */
  public static build(
    args?: AuthNewPasswordServiceBuilderArgs
  ): IAuthNewPasswordService {
    const { url, anonKey } = ensureSupabaseConfig();
    const client = createClient(url, anonKey);

    return new AuthNewPasswordService(client, args?.errorDictionaryGenerator);
  }
}

