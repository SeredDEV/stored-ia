import express from "express";
import cors from "cors";
import { AuthServiceBuilder } from "./services/auth/login";
import { AuthResetPasswordServiceBuilder } from "./services/auth/reset-password";
import { AuthNewPasswordServiceBuilder } from "./services/auth/new-password";
import { env } from "./config/env";
import { authErrorHandler } from "./middleware/errorHandler";
import { RouteLoader } from "./lib/routeLoader";

const app = express();
const PORT = env.apiPort || 3001;

// Servicios (inyección de dependencias básica)
const authService = AuthServiceBuilder.build();
const resetPasswordService = AuthResetPasswordServiceBuilder.build();
const newPasswordService = AuthNewPasswordServiceBuilder.build();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Permitir cookies y credenciales
}));
app.use(express.json());

// Middleware de logging sencillo para todas las rutas, estilo Next.js
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} in ${duration}ms`
    );
  });

  next();
});

// Middleware de manejo de errores de autenticación
app.use(authErrorHandler);

// Middleware de manejo de errores general (debe ir al final)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Si ya se envió una respuesta, pasar al siguiente
  if (res.headersSent) {
    return next(err);
  }

  // Siempre devolver JSON, nunca HTML
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Error interno del servidor";

  res.status(statusCode).json({
    error: message,
    details: err.details,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "api" });
});

// Carga automática de rutas desde archivos *.route.ts
// La librería RouteLoader busca automáticamente todos los archivos *.route.ts
// y los registra en el servidor antes de iniciar
RouteLoader.loadRoutes(app, undefined, {
  authService,
  resetPasswordService,
  newPasswordService,
})
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Store API running on port ${PORT}`);
      console.log(`📡 Listening on http://0.0.0.0:${PORT}`);
      console.log(`🌐 Accessible from http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error loading routes:", err);
    process.exit(1);
  });

export default app;
