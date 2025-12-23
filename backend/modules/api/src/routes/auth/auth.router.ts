import express from "express";
import type { AuthService } from "../../services/auth";
import { validateLoginRequest } from "./auth.schema";

/**
 * Factoría de router de auth.
 * Recibe la instancia de AuthService (inyección de dependencias).
 */
export function createAuthRoutes(authService: AuthService) {
  const router = express.Router();

  // POST /api/auth/login
  // body: { email, password }
  //
  // Flujo:
  // 1. validateLoginRequest (middleware) valida parámetros → responde 400 si hay error
  // 2. authService.loginWithEmailPassword valida contra DB → devuelve { status, body }
  // 3. Si todo OK → servicio devuelve status: 200, y la ruta lo pasa
  router.post("/login", validateLoginRequest, async (req, res) => {
    // En este punto el body ya fue validado por el middleware (si llegó aquí, es válido)
    const { email, password } = req.body as { email: string; password: string };

    // El servicio valida contra la DB y devuelve el resultado HTTP completo
    // (incluye status: 200 si OK, o 401/429/etc si hay error de DB)
    const result = await authService.loginWithEmailPassword(email, password);

    // Respondemos con el status y body que viene del servicio
    // Si todo está OK, result.status será 200
    return res.status(result.status).json(result.body);
  });

  return router;
}
