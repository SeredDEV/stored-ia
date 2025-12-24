export interface LoginResponse {
  data: {
    user: {
      id: string;
      email: string;
      role?: string;
    };
  };
}

export interface LoginError {
  message: string;
  details?: Array<{ path: string[]; message: string }>;
  status?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Incluir cookies si las hay
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    const error: LoginError = {
      message: data.error || data.message || "Error al iniciar sesión",
      details: data.details,
      status: res.status,
    };
    throw error;
  }

  return data as LoginResponse;
}
export interface RequestResetResponse {
  message: string;
}

export interface ConfirmResetResponse {
  message: string;
}

/**
 * Solicita un reset de contraseña.
 * Envía un email con un enlace para restablecer la contraseña.
 */
export async function requestPasswordReset(
  email: string
): Promise<RequestResetResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });

  // Verificar el Content-Type antes de intentar parsear JSON
  const contentType = res.headers.get("content-type");
  let data;

  try {
    // Si la respuesta es JSON, parsearla
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      // Si no es JSON (probablemente HTML o texto), leer como texto
      const text = await res.text();

      // Detectar si es un error de rate limiting (429) o error del servidor
      if (res.status === 429 || res.status === 503) {
        const error: LoginError = {
          message:
            "Demasiados intentos. Por favor, espere 2 minutos antes de intentar nuevamente.",
          status: res.status,
        };
        throw error;
      }

      // Si la respuesta contiene HTML, es probablemente una página de error
      if (text.includes("<!DOCTYPE") || text.includes("<html")) {
        const error: LoginError = {
          message:
            "Demasiados intentos. Por favor, espere 2 minutos antes de intentar nuevamente.",
          status: res.status,
        };
        throw error;
      }

      // Si no podemos parsear la respuesta, lanzar error genérico
      const error: LoginError = {
        message:
          "Error al procesar la respuesta del servidor. Por favor, intente más tarde.",
        status: res.status,
      };
      throw error;
    }
  } catch (err: any) {
    // Si ya es un LoginError, relanzarlo
    if (err.status !== undefined && err.message) {
      throw err;
    }

    // Si es un error de parsing JSON, probablemente sea rate limiting
    if (err.message && err.message.includes("JSON")) {
      const error: LoginError = {
        message:
          "Demasiados intentos. Por favor, espere 2 minutos antes de intentar nuevamente.",
        status: res.status || 429,
      };
      throw error;
    }

    // Error genérico
    const error: LoginError = {
      message:
        "Error al solicitar reset de contraseña. Por favor, intente más tarde.",
      status: res.status || 500,
    };
    throw error;
  }

  if (!res.ok) {
    const error: LoginError = {
      message:
        data.error || data.message || "Error al solicitar reset de contraseña",
      details: data.details,
      status: res.status,
    };
    throw error;
  }

  return data as RequestResetResponse;
}

/**
 * Confirma el reset de contraseña con el token y la nueva contraseña.
 */
export async function confirmPasswordReset(
  token: string,
  password: string
): Promise<ConfirmResetResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/reset-password/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ token, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    const error: LoginError = {
      message:
        data.error || data.message || "Error al confirmar reset de contraseña",
      details: data.details,
      status: res.status,
    };
    throw error;
  }

  return data as ConfirmResetResponse;
}
