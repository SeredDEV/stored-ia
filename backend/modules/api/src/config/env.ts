import path from "path";
import dotenv from "dotenv";

// Carga centralizada de variables de entorno para el módulo API
// Subimos 5 niveles desde src/config hasta la raíz del workspace donde está el .env
// config -> src -> api -> modules -> backend -> (raíz workspace)
const envPath = path.resolve(__dirname, "../../../../../.env");
dotenv.config({ path: envPath });

export const env = {
  apiPort: process.env.API_PORT || "3001",
  supabaseUrl:
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey:
    process.env.SUPABASE_API_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
};

export function ensureSupabaseConfig() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error(
      "Supabase no está configurado correctamente (revisa SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL y SUPABASE_API_KEY / NEXT_PUBLIC_SUPABASE_ANON_KEY)"
    );
  }

  return {
    url: env.supabaseUrl,
    anonKey: env.supabaseAnonKey,
  };
}
