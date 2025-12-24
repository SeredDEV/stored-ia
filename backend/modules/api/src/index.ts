import express from "express";
import cors from "cors";
import { AuthServiceBuilder } from "./services/auth/login";
import { env } from "./config/env";
import { authErrorHandler } from "./middleware/errorHandler";
import { RouteLoader } from "./lib/routeLoader";

const app = express();
const PORT = env.apiPort || 3001;

// Servicios (inyección de dependencias básica)
const authService = AuthServiceBuilder.build();

// Middleware
app.use(cors());
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

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "api" });
});

// Carga automática de rutas desde archivos *.route.ts
// La librería RouteLoader busca automáticamente todos los archivos *.route.ts
// y los registra en el servidor antes de iniciar
RouteLoader.loadRoutes(app, undefined, {
  authService,
})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Store API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error loading routes:", err);
    process.exit(1);
  });

export default app;
