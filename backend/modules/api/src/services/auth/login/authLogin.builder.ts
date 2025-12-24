import { createClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../config/env";
import type { IAuthService } from "../authModel";
import { AuthService } from "./authLogin.service";
import type {
  ErrorDictionaryGenerator,
  RValidationsNamesAuthLogin,
} from "./authLogin.dictionary";

export interface AuthServiceBuilderArgs {
  errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesAuthLogin>;
}

/**
 * Builder para crear el servicio de autenticación.
 * Similar al patrón del ejemplo: MAuthLoginBuilder.build().
 */
export class AuthServiceBuilder {
  /**
   * Crea el servicio de autenticación usando Supabase.
   * Puede recibir opcionalmente un generador de errores del diccionario.
   */
  public static build(args?: AuthServiceBuilderArgs): IAuthService {
    const { url, anonKey } = ensureSupabaseConfig();
    const client = createClient(url, anonKey);

    return new AuthService(client, args?.errorDictionaryGenerator);
  }
}
