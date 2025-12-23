import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
// Attempting to locate .env in the root of the workspace (4 levels up)
const envPath = path.resolve(__dirname, "../../../../.env");
dotenv.config({ path: envPath });

// Usar las variables definidas en tu archivo .env:
// SUPABASE_URL               -> URL del proyecto de Supabase
// SUPABASE_API_KEY           -> (opcional) tu publishable/anon key para el frontend
// SUPABASE_SERVICE_ROLE_KEY  -> DEBE contener la service_role (SOLO backend)
//
// Nota importante:
// Para poder usar supabase.auth.admin.createUser es obligatorio usar la "service_role",
// no una clave publishable (sb_publishable_...). Esa service_role debe ir en
// SUPABASE_SERVICE_ROLE_KEY y NUNCA exponerse en el frontend.
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error(
    "Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL must be defined in .env"
  );
  console.log("Loaded env from:", envPath);
  process.exit(1);
}

if (!supabaseServiceRoleKey) {
  console.error(
    "Error: SUPABASE_SERVICE_ROLE_KEY (con la service_role) must be defined in .env"
  );
  console.log("Loaded env from:", envPath);
  process.exit(1);
}

console.log("--- Debug Info ---");
console.log("Supabase URL:", supabaseUrl);
// Show only first 10 chars of the key for security
console.log(
  "Service Role Key (start):",
  supabaseServiceRoleKey
    ? supabaseServiceRoleKey.substring(0, 10) + "..."
    : "undefined"
);
console.log(
  "Service Role Key length:",
  supabaseServiceRoleKey ? supabaseServiceRoleKey.length : 0
);
console.log("------------------");

if (supabaseServiceRoleKey && !supabaseServiceRoleKey.startsWith("eyJ")) {
  console.warn(
    '\n⚠️  WARNING: The SUPABASE_SERVICE_ROLE_KEY does not look like a valid JWT (should start with "eyJ").'
  );
  if (supabaseServiceRoleKey.startsWith("sb_")) {
    console.warn(
      "It looks like you are using a Supabase API key (publishable or similar) instead of the Service Role Secret."
    );
  }
  console.warn(
    'Please check your .env file and ensure you are using the "service_role" secret from your Supabase Dashboard > Project Settings > API.\n'
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdminUser() {
  const args = process.argv.slice(2);

  // Usage: npm run create-admin email password

  if (args.length < 2) {
    console.error("Usage: npm run create-admin <email> <password>");
    process.exit(1);
  }

  const email = args[0];
  const password = args[1];

  console.log(`Creating admin user: ${email}...`);

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: "admin",
      },
      app_metadata: {
        role: "admin",
      },
    });

    if (error) {
      console.error("❌ Error creating user:", error.message);
      process.exit(1);
    }

    if (data.user) {
      console.log("✅ Admin user created successfully!");
      console.log(`User ID: ${data.user.id}`);
      console.log(`Email: ${data.user.email}`);
    } else {
      console.error("❌ Failed to create user (no data returned).");
    }
  } catch (err: any) {
    console.error("❌ Unexpected error:", err.message || err);
    process.exit(1);
  }
}

createAdminUser();
