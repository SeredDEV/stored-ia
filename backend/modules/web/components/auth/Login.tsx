
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BackgroundBlobs from '../ui/BackgroundBlobs';
import { login as loginApi } from '../../lib/api/authService';

interface LoginProps {
  onLogin: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<Array<{ path: string[]; message: string }> | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginApi(email, password);

      // Aquí podrías guardar el token en localStorage/cookies si quieres
      // localStorage.setItem('access_token', data.access_token);

      onLogin(email);
    } catch (err: any) {
      // Manejo de errores del backend
      setError(err.message || 'Error de red');
      
      // Si hay detalles de validación, los mostramos
      if (err.details && Array.isArray(err.details)) {
        setErrorDetails(err.details);
      } else {
        setErrorDetails(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-echo-beige relative overflow-hidden">
      {/* Background blobs for depth */}
      <BackgroundBlobs />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-white/50 overflow-hidden relative z-10">
        {/* Decorative Top Bar */}
        <div className="h-2 w-full bg-echo-blue"></div>

        <div className="p-8 md:p-10">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-echo-blue/10 rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-echo-blue text-4xl">admin_panel_settings</span>
            </div>
            <h1 className="text-echo-black text-3xl font-black tracking-tight">Portal Administrativo</h1>
            <p className="text-echo-gray mt-2 text-center">
              ¡Bienvenido de nuevo! Por favor, ingrese sus datos para iniciar sesión.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-echo-black text-sm font-semibold mb-2" htmlFor="email">
                Correo Electrónico
              </label>
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@empresa.com"
                  className="w-full h-14 pl-4 pr-12 rounded-xl border border-gray-200 bg-echo-beige/30 text-echo-black placeholder:text-echo-gray/50 focus:ring-2 focus:ring-echo-blue/20 focus:border-echo-blue outline-none transition-all group-hover:border-echo-blue/50"
                  required
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-echo-gray">
                  mail
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-echo-black text-sm font-semibold" htmlFor="password">
                  Contraseña
                </label>
              </div>
              <div className="relative group flex items-stretch">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 pl-4 pr-12 rounded-xl border border-gray-200 bg-echo-beige/30 text-echo-black placeholder:text-echo-gray/50 focus:ring-2 focus:ring-echo-blue/20 focus:border-echo-blue outline-none transition-all group-hover:border-echo-blue/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-echo-gray hover:text-echo-blue transition-colors"
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-echo-blue focus:ring-echo-blue transition-all"
                />
                <span className="text-sm text-echo-gray group-hover:text-echo-black transition-colors">Recordarme</span>
              </label>
              <Link href="/reset-password" className="text-sm font-bold text-echo-blue hover:text-echo-light-blue transition-colors">
                ¿Olvidó su contraseña?
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
                <p className="text-sm text-red-600 font-medium text-center">
                  {error}
                </p>
                {errorDetails && errorDetails.length > 0 && (
                  <ul className="text-xs text-red-500 space-y-1 list-disc list-inside">
                    {errorDetails.map((detail, idx) => (
                      <li key={idx}>
                        {detail.path.join('.')}: {detail.message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-echo-blue hover:bg-echo-light-blue disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-echo-blue/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>


      </div>
    </div>
  );
};

export default Login;
