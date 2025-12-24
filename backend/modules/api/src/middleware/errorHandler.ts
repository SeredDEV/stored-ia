import type { Request, Response, NextFunction } from "express";
import { AuthError } from "../lib/authError";

/**
 * Middleware para manejar errores de autenticación.
 * Captura las excepciones AuthError y responde con el código de estado correcto.
 */
export function authErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AuthError) {
    res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
    return;
  }

  // Si no es un error de autenticación, pasar al siguiente middleware
  next(err);
}
