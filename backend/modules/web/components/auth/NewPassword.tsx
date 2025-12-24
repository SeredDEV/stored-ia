'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BackgroundBlobs from '../ui/BackgroundBlobs';
import { confirmPasswordReset } from '../../lib/api/authService';

const NewPassword: React.FC = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errorDetails, setErrorDetails] = useState<Array<{ path: string[]; message: string }> | null>(null);
    const [success, setSuccess] = useState(false);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    // Extraer tokens del hash cuando el componente se monta
    useEffect(() => {
        // Supabase envía tokens en el hash como: 
        // #access_token=...&refresh_token=...&expires_at=...&type=recovery
        const hash = window.location.hash;
        let extractedAccessToken: string | null = null;
        let extractedRefreshToken: string | null = null;

        if (hash) {
            const hashParams = new URLSearchParams(hash.substring(1)); // Remover el #
            extractedAccessToken = hashParams.get('access_token');
            extractedRefreshToken = hashParams.get('refresh_token');
        }

        // Si no está en el hash, intentar obtener de los query params (fallback)
        if (!extractedAccessToken) {
            const urlParams = new URLSearchParams(window.location.search);
            extractedAccessToken = urlParams.get('token') || urlParams.get('access_token');
            extractedRefreshToken = urlParams.get('refresh_token');
        }

        if (extractedAccessToken) {
            setToken(extractedAccessToken);
            // El refresh_token es opcional pero preferible
            if (extractedRefreshToken) {
                setRefreshToken(extractedRefreshToken);
            }
        } else {
            setError('Token no válido o faltante. Por favor, solicite un nuevo enlace de recuperación.');
        }
    }, []);

    // Strength Logic
    const getStrength = (pass: string) => {
        if (!pass) return { score: 0, label: '-', color: 'bg-gray-200 dark:bg-gray-700' };

        const len = pass.length;
        const hasSymbol = /[^A-Za-z0-9]/.test(pass);

        // Nivel 1: Débil (Menos de 6 caracteres - mínimo requerido por la API)
        if (len < 6) {
            return { score: 1, label: 'Débil', color: 'bg-red-500' };
        }

        // Nivel 2: Regular (6 o más caracteres, pero SIN símbolo)
        if (!hasSymbol) {
            return { score: 2, label: 'Regular', color: 'bg-yellow-400' };
        }

        // Nivel 3: Fuerte (6 o más caracteres Y con símbolo)
        return { score: 3, label: 'Fuerte', color: 'bg-primary' };
    };

    const strength = getStrength(password);
    const hasMinLength = password.length >= 6; // Coincide con la validación de la API
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
    const isFormValid = hasMinLength && passwordsMatch;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setErrorDetails(null);
        setPasswordMismatch(false);

        // Validaciones
        if (!token) {
            setError('Token no válido. Por favor, solicite un nuevo enlace de recuperación.');
            return;
        }

        if (!hasMinLength) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            setPasswordMismatch(true);
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);

        try {
            await confirmPasswordReset(token, password, refreshToken);
            setSuccess(true);
            
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Error al actualizar la contraseña. Por favor, intente nuevamente.');
            if (err.details && Array.isArray(err.details)) {
                setErrorDetails(err.details);
            } else {
                setErrorDetails(null);
            }
        } finally {
            setLoading(false);
        }
    };

    // Vista de éxito
    if (success) {
        return (
            <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <BackgroundBlobs />
                <div className="relative z-10 w-full max-w-[440px] bg-white dark:bg-[#18282d] rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-[#e7f1f3] dark:border-[#2a3c42] overflow-hidden">
                    <div className="px-8 pt-10 pb-8 flex flex-col">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="size-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-5">
                                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[32px]">check_circle</span>
                            </div>
                            <h3 className="text-[#090808] dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em] mb-2">¡Contraseña Actualizada!</h3>
                            <p className="text-[#4b8a9b] dark:text-slate-400 text-sm font-normal leading-relaxed max-w-xs mx-auto">
                                Su contraseña ha sido restablecida exitosamente. Será redirigido al inicio de sesión...
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <Link className="group flex items-center gap-2 text-sm font-semibold text-[#4f7282] hover:text-[#090808] dark:text-slate-400 dark:hover:text-white transition-colors" href="/login">
                                <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1" style={{ fontSize: '18px' }}>arrow_back</span>
                                Ir al inicio de sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <BackgroundBlobs />
            <div className="relative z-10 w-full max-w-[440px] bg-white dark:bg-[#18282d] rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-[#e7f1f3] dark:border-[#2a3c42] overflow-hidden">
                <div className="px-8 pt-10 pb-8 flex flex-col">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mb-5 text-primary">
                            <span className="material-symbols-outlined text-[32px]">lock_reset</span>
                        </div>
                        <h3 className="text-[#090808] dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em] mb-2">Establecer Nueva Contraseña</h3>
                        <p className="text-[#4b8a9b] dark:text-slate-400 text-sm font-normal leading-relaxed max-w-xs mx-auto">
                            Su nueva contraseña debe ser diferente a las contraseñas utilizadas anteriormente.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

                        <label className="flex flex-col gap-2">
                            <span className="text-[#090808] dark:text-white text-sm font-semibold leading-normal">Nueva Contraseña</span>
                            <div className="relative group">
                                <input
                                    className={`form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#0d181c] dark:text-white placeholder:text-[#9bbcc6] dark:placeholder:text-slate-600 bg-[#f8fbfc] dark:bg-[#101e22] border h-12 px-4 pr-12 text-base font-normal leading-normal transition-colors ${
                                        passwordMismatch 
                                            ? 'border-red-500 dark:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500' 
                                            : 'border-[#cfe2e8] dark:border-[#2a3c42] focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                    }`}
                                    placeholder="Ingrese nueva contraseña"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setPasswordMismatch(false);
                                        setError(null);
                                    }}
                                    disabled={loading || !token}
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <button
                                        className="text-[#4b8a9b] hover:text-primary transition-colors focus:outline-none p-1 flex items-center justify-center"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-[#090808] dark:text-white text-sm font-semibold leading-normal">Confirmar Contraseña</span>
                            <div className="relative group">
                                <input
                                    className={`form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#0d181c] dark:text-white placeholder:text-[#9bbcc6] dark:placeholder:text-slate-600 bg-[#f8fbfc] dark:bg-[#101e22] border h-12 px-4 pr-12 text-base font-normal leading-normal transition-colors ${
                                        passwordMismatch 
                                            ? 'border-red-500 dark:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500' 
                                            : passwordsMatch && confirmPassword.length > 0
                                            ? 'border-green-500 dark:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:border-green-500'
                                            : 'border-[#cfe2e8] dark:border-[#2a3c42] focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                    }`}
                                    placeholder="Confirme nueva contraseña"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setPasswordMismatch(false);
                                        setError(null);
                                    }}
                                    disabled={loading || !token}
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <button
                                        className="text-[#4b8a9b] hover:text-primary transition-colors focus:outline-none p-1 flex items-center justify-center"
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                            {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </label>

                        {/* Password Match Indicator */}
                        {confirmPassword.length > 0 && (
                            <div className={`flex items-center gap-2 text-sm ${passwordsMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                <span className="material-symbols-outlined text-[20px]">
                                    {passwordsMatch ? 'check_circle' : 'error'}
                                </span>
                                <span className="font-medium">
                                    {passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
                                </span>
                            </div>
                        )}

                        {/* Functional Strength Meter */}
                        <div className="bg-primary/5 dark:bg-primary/10 p-3 rounded-lg border border-dashed border-primary/20 dark:border-primary/30 flex flex-col gap-2 mt-1">
                            <div className="flex justify-between items-center">
                                <p className="text-xs font-semibold text-[#4f7282] dark:text-slate-300 uppercase tracking-wider">Fortaleza</p>
                                <p className={`text-xs font-bold transition-colors duration-300 ${strength.score > 0 ? 'text-primary' : 'text-gray-400'}`}>
                                    {strength.label === '-' ? '' : strength.label}
                                </p>
                            </div>
                            <div className="flex gap-1 h-1.5 w-full">
                                {[1, 2, 3].map((level) => (
                                    <div
                                        key={level}
                                        className={`flex-1 rounded-full transition-all duration-300 ${strength.score >= level ? strength.color : 'bg-[#cfe2e8] dark:bg-[#2a3c42]'}`}
                                    ></div>
                                ))}
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                                <div className={`flex items-center gap-1.5 text-xs transition-colors duration-300 ${hasMinLength ? 'text-[#0d181c] dark:text-slate-300 font-medium' : 'text-gray-400'}`}>
                                    <span className={`material-symbols-outlined text-[16px] ${hasMinLength ? 'text-green-600' : 'text-[#9bbcc6]'}`}>
                                        {hasMinLength ? 'check_small' : 'radio_button_unchecked'}
                                    </span>
                                    6+ caracteres
                                </div>
                                <div className={`flex items-center gap-1.5 text-xs transition-colors duration-300 ${hasSymbol ? 'text-[#0d181c] dark:text-slate-300 font-medium' : 'text-gray-400'}`}>
                                    <span className={`material-symbols-outlined text-[16px] ${hasSymbol ? 'text-green-600' : 'text-[#9bbcc6]'}`}>
                                        {hasSymbol ? 'check_small' : 'radio_button_unchecked'}
                                    </span>
                                    Símbolo
                                </div>
                            </div>
                        </div>

                        <button 
                            className="mt-2 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary hover:bg-[#0d95ba] text-white text-base font-bold leading-normal tracking-[0.015em] shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                            type="submit" 
                            disabled={!isFormValid || loading || !token}
                        >
                            <span className="truncate">
                                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                            </span>
                        </button>
                    </form>
                    <div className="mt-8 flex justify-center">
                        <Link className="group flex items-center gap-2 text-sm font-semibold text-[#4f7282] hover:text-[#090808] dark:text-slate-400 dark:hover:text-white transition-colors" href="/login">
                            <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1" style={{ fontSize: '18px' }}>arrow_back</span>
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
            <div className="mt-6 text-[#9bbcc6] dark:text-slate-600 text-xs text-center relative z-10">
                © 2024 Admin Panel Security
            </div>
        </div>
    );
};

export default NewPassword;
