import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Configuración para variables de entorno
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // Especificar el root del workspace para evitar advertencias de múltiples lockfiles
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default nextConfig;

