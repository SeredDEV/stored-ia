import { z, ZodIssue } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "El email es requerido",
      invalid_type_error: "El email debe ser un texto",
    })
    .email("El formato del email no es válido")
    .min(1, "El email no puede estar vacío"),
  password: z
    .string({
      required_error: "La contraseña es requerida",
      invalid_type_error: "La contraseña debe ser un texto",
    })
    .min(1, "La contraseña no puede estar vacía"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export interface ValidationErrorResult {
  ok: false;
  status: number;
  error: string;
  details: ZodIssue[];
}

export interface ValidationSuccessResult {
  ok: true;
  data: LoginInput;
}

export type LoginValidationResult =
  | ValidationSuccessResult
  | ValidationErrorResult;

/**
 * Valida el body de login y devuelve un resultado normalizado.
 * Puedes usarla de forma funcional o a través del middleware de abajo.
 */
export function validateLoginBody(body: unknown): LoginValidationResult {
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    const firstError = result.error.errors[0];
    return {
      ok: false,
      status: 400,
      error: firstError.message,
      details: result.error.errors,
    };
  }

  return {
    ok: true,
    data: result.data,
  };
}

/**
 * Middleware Express para validar el body de login.
 * Si es válido, deja los datos tipados en `req.body` y llama a `next()`.
 * Si es inválido, responde directamente con el código de error correspondiente.
 */
export function validateLoginRequest(
  req: import("express").Request,
  res: import("express").Response,
  next: import("express").NextFunction
) {
  const validation = validateLoginBody(req.body);

  if (!validation.ok) {
    return res.status(validation.status).json({
      error: validation.error,
      details: validation.details,
    });
  }

  // Sobrescribimos el body con la versión ya validada y tipada
  req.body = validation.data;
  return next();
}
