'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BackgroundBlobs from '../ui/BackgroundBlobs';
import { requestPasswordReset } from '../../lib/api/authService';

const COOLDOWN_TIME = 120000; // 2 minutos en milisegundos
const LAST_RESET_KEY = 'lastPasswordResetTime';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errorDetails, setErrorDetails] = useState<Array<{ path: string[]; message: string }> | null>(null);
    const [success, setSuccess] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number>(0);

    // Verificar si hay un cooldown activo al cargar el componente
    useEffect(() => {
        const checkCooldown = () => {
            const lastReset = localStorage.getItem(LAST_RESET_KEY);
            if (lastReset) {
                const timePassed = Date.now() - parseInt(lastReset);
                const remaining = Math.max(0, COOLDOWN_TIME - timePassed);
                
                if (remaining > 0) {
                    setTimeRemaining(remaining);
                } else {
                    localStorage.removeItem(LAST_RESET_KEY);
                    setTimeRemaining(0);
                }
            }
        };

        checkCooldown();
        const interval = setInterval(checkCooldown, 1000); // Actualizar cada segundo

        return () => clearInterval(interval);
    }, []);

    // Actualizar el contador cada segundo
    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setTimeout(() => {
                setTimeRemaining((prev) => {
                    const newValue = Math.max(0, prev - 1000);
                    if (newValue === 0) {
                        localStorage.removeItem(LAST_RESET_KEY);
                    }
                    return newValue;
                });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [timeRemaining]);

    const formatTime = (ms: number) => {
        const seconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Verificar cooldown antes de enviar
        if (timeRemaining > 0) {
            setError(`Debe esperar ${formatTime(timeRemaining)} antes de enviar otro correo.`);
            return;
        }

        setError(null);
        setErrorDetails(null);
        setLoading(true);

        try {
            await requestPasswordReset(email);
            
            // Guardar la hora del último envío exitoso
            localStorage.setItem(LAST_RESET_KEY, Date.now().toString());
            setTimeRemaining(COOLDOWN_TIME);
            setSuccess(true);
            setEmail('');
        } catch (err: any) {
            // Detectar si es un error de rate limiting
            if (err.message && err.message.includes('Demasiados intentos')) {
                // Guardar el tiempo actual para activar el cooldown
                localStorage.setItem(LAST_RESET_KEY, Date.now().toString());
                setTimeRemaining(COOLDOWN_TIME);
                setError(err.message || 'Demasiados intentos. Por favor, espere 2 minutos antes de intentar nuevamente.');
            } else {
                setError(err.message || 'Error al solicitar reset de contraseña');
                if (err.details && Array.isArray(err.details)) {
                    setErrorDetails(err.details);
                } else {
                    setErrorDetails(null);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const isCooldownActive = timeRemaining > 0;

    if (success) {
        return (
            <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white antialiased min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden">
                <BackgroundBlobs />
                <div className="w-full max-w-[480px] bg-white dark:bg-[#1a2c32] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="h-2 bg-primary w-full"></div>
                    <div className="p-8 sm:p-10 flex flex-col gap-6">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-3xl">check_circle</span>
                            </div>
                            <h1 className="text-text-main dark:text-white text-3xl font-bold tracking-tight">Correo Enviado</h1>
                            <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed max-w-sm">
                                Si el email existe en nuestro sistema, se ha enviado un enlace para restablecer su contraseña. Por favor, revise su bandeja de entrada.
                            </p>
                        </div>
                        <div className="flex justify-center pt-2">
                            <Link
                                className="group flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                                href="/login"
                            >
                                <span className="material-symbols-outlined text-[16px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                                Volver al Inicio de Sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white antialiased min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden">
            {/* Background blobs for depth */}
            <BackgroundBlobs />
            {/* Main Container Card */}
            <div className="w-full max-w-[480px] bg-white dark:bg-[#1a2c32] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                {/* Decoration / Brand Header */}
                <div className="h-2 bg-primary w-full"></div>
                <div className="p-8 sm:p-10 flex flex-col gap-6">
                    {/* Header Section (Logo + Title + Description) */}
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
                        </div>
                        <h1 className="text-text-main dark:text-white text-3xl font-bold tracking-tight">Restablecer Contraseña</h1>
                        <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed max-w-sm">
                            ¿Olvidó su contraseña? No hay problema. Ingrese la dirección de correo electrónico asociada con su cuenta de administrador y le enviaremos un enlace para restablecer su contraseña.
                        </p>
                    </div>
                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
                        {/* Email Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-text-main dark:text-gray-200 text-sm font-semibold" htmlFor="email">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <input
                                    className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#101e22] text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary h-12 px-4 text-base placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-all"
                                    id="email"
                                    name="email"
                                    placeholder="admin@empresa.com"
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none flex items-center">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </span>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 space-y-2">
                                <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center">
                                    {error}
                                </p>
                                {errorDetails && errorDetails.length > 0 && (
                                    <ul className="text-xs text-red-500 dark:text-red-400 space-y-1 list-disc list-inside">
                                        {errorDetails.map((detail, idx) => (
                                            <li key={idx}>
                                                {detail.path.join('.')}: {detail.message}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {/* Cooldown Message */}
                        {isCooldownActive && !error && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium text-center">
                                    Por favor espere {formatTime(timeRemaining)} antes de enviar otro correo.
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            className="mt-2 w-full flex items-center justify-center rounded-lg h-12 px-5 bg-primary hover:bg-primary/90 active:bg-primary/95 text-white text-base font-bold tracking-wide transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-[#1a2c32] disabled:opacity-60 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading || isCooldownActive}
                        >
                            {loading 
                                ? 'Enviando...' 
                                : isCooldownActive 
                                    ? `Espere ${formatTime(timeRemaining)}` 
                                    : 'Enviar Enlace de Recuperación'}
                        </button>
                    </form>
                    {/* Footer Meta Link */}
                    <div className="flex justify-center pt-2">
                        <Link
                            className="group flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                            href="/login"
                        >
                            <span className="material-symbols-outlined text-[16px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                            Volver al Inicio de Sesión
                        </Link>
                    </div>
                </div>
            </div>
            {/* Footer Branding */}
            <div className="mt-8 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-600">
                    © 2023 Sistema de Panel Administrativo. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
