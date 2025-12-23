import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#137fec',
        'background-light': '#f6f7f8',
        'background-dark': '#101922',
        'surface-light': '#ffffff',
        'surface-dark': '#1A2633',
        // Start: Custom Echo Colors
        'echo-blue': '#0FA6D1',
        'echo-light-blue': '#40C4EB',
        'echo-cyan': '#4DE2E5',
        'echo-pastel': '#A8E6CF', // Ajustado a un tono pastel armónico
        'echo-beige': '#f8fafc', // Usando un gris muy claro/beige moderno
        'echo-black': '#1e293b',
        'echo-gray': '#64748b',
        'echo-red': '#ef4444',
        // End: Custom Echo Colors
      },
      fontFamily: {
        display: ['var(--font-manrope)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};

export default config;


