import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Principales
        primary: "#0FA6D1", // Azul principal Echo
        "background-light": "#F7F5F2", // Beige claro
        "background-dark": "#101e22",
        "surface-light": "#FFFFFF", // Blanco
        "surface-dark": "#1A2633",

        // Custom Echo Colors (Mapped from User Request)
        "echo-blue": "#0FA6D1", // Azul principal Echo
        "echo-blue-variant": "#5EA4CF", // Azul claro variante
        "echo-gray": "#959595", // Gris
        "echo-beige": "#F7F5F2", // Beige claro
        "echo-white": "#FFFFFF", // Blanco

        // Secundarios
        "echo-cyan": "#4DE2E5", // Cyan brillante
        "echo-pastel-blue": "#94D6EA", // Azul claro pastel
        "echo-black": "#090808", // Negro
        "echo-red": "#FF5757", // Rojo

        // Helper aliases for compatibility
        "text-main": "#090808",
        "text-secondary": "#959595", // Updated to use the new gray
        "echo-light-blue": "#94D6EA", // Mapped to new pastel blue
        "echo-pastel": "#94D6EA", // Legacy mapping
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
