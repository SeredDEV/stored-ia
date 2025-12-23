import express from "express";
import cors from "cors";
import { productRoutes } from "./routes/products";
import { orderRoutes } from "./routes/orders";
import { customerRoutes } from "./routes/customers";
import { createAuthRoutes } from "./routes/auth";
import { AuthService } from "./services/auth";
import { env } from "./config/env";

const app = express();
const PORT = env.apiPort || 3001;

// Servicios (inyección de dependencias básica)
const authService = AuthService.fromConfig();

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

// Routes
app.use("/api/auth", createAuthRoutes(authService));
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "api" });
});

app.listen(PORT, () => {
  console.log(`🚀 Store API running on port ${PORT}`);
});

export default app;
