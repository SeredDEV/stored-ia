import type { Request, Response, NextFunction } from "express";
import { z, ZodIssue, ZodSchema } from "zod";

export interface ValidationErrorResult {
  ok: false;
  status: number;
  error: string;
  details: ZodIssue[];
}

export interface ValidationSuccessResult<T> {
  ok: true;
  data: T;
}

export type ValidationResult<T> =
  | ValidationErrorResult
  | ValidationSuccessResult<T>;

/**
 * Librería genérica para validar requests usando Zod.
 * Recibe un schema y devuelve un middleware de Express.
 */
export class RouteValidator {
  /**
   * Valida el body usando un schema de Zod.
   */
  private static validateBody<T>(
    body: unknown,
    schema: ZodSchema<T>
  ): ValidationResult<T> {
    const result = schema.safeParse(body);

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
   * Crea un middleware de Express que valida el body usando un schema de Zod.
   * Si es válido, sobrescribe `req.body` con los datos validados y tipados.
   * Si es inválido, responde con el código de error correspondiente.
   */
  public static create<T>(
    schema: ZodSchema<T>
  ): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
      const validation = this.validateBody(req.body, schema);

      if (!validation.ok) {
        res.status(validation.status).json({
          error: validation.error,
          details: validation.details,
        });
        return;
      }

      // Sobrescribimos el body con la versión ya validada y tipada
      req.body = validation.data;
      next();
    };
  }
}
