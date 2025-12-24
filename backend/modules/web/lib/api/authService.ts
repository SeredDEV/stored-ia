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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Incluir cookies si las hay
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    const error: LoginError = {
      message: data.error || data.message || 'Error al iniciar sesión',
      details: data.details,
      status: res.status,
    };
    throw error;
  }

  return data as LoginResponse;
}
