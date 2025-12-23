'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password strength logic
    const [password, setPassword] = useState('');

    const getStrength = (pass: string) => {
        if (!pass) return { score: 0, label: '', color: 'bg-transparent', width: '0%' };

        let score = 0;
        // Prioritize length primarily
        if (pass.length > 4) score += 2; // Base length for Medium
        if (pass.length > 8) score += 2; // Sufficient length for Strong

        // Bonus for complexity (optional but good)
        if (/[0-9]/.test(pass)) score += 0.5;
        if (/[^A-Za-z0-9]/.test(pass)) score += 0.5;

        // Simplificada: 
        // < 5 chars: Débil
        // 5-8 chars: Media
        // > 8 chars: Fuerte
        if (pass.length < 5) return { score: 1, label: 'Débil', color: 'bg-red-500', width: '33%' };
        if (pass.length <= 8) return { score: 2, label: 'Media', color: 'bg-yellow-500', width: '66%' };
        return { score: 3, label: 'Fuerte', color: 'bg-green-500', width: '100%' };
    };

    const strength = getStrength(password);

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-[#090808] dark:text-white font-display overflow-x-hidden">
            {/* Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#234048] px-6 lg:px-10 py-3 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="text-echo-blue">
                        <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                    </div>
                </div>
                <Link href="/login" className="flex items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-slate-200 dark:bg-[#234048] text-slate-900 dark:text-white text-sm font-bold transition-colors hover:bg-slate-300 dark:hover:bg-[#2e525c]">
                    <span className="truncate">Iniciar Sesión</span>
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
                <div className="w-full max-w-[520px] flex flex-col gap-6">
                    {/* Heading Section */}
                    <div className="flex flex-col gap-2 text-center sm:text-left">
                        <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight dark:text-white text-slate-900">
                            Crear Cuenta de Admin
                        </h1>
                        <p className="text-slate-500 dark:text-[#91beca] text-base font-normal">
                            Registre un nuevo administrador para el sistema
                        </p>
                    </div>

                    {/* Registration Card */}
                    <div className="w-full rounded-xl bg-white dark:bg-[#1a2c32] p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-[#234048]">
                        <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                            {/* Full Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium leading-normal dark:text-white text-slate-900">
                                    Nombre Completo
                                </label>
                                <input
                                    className="form-input flex w-full rounded-lg border border-slate-300 dark:border-[#325c67] bg-slate-50 dark:bg-[#192e34] h-12 px-4 text-base placeholder:text-slate-400 dark:placeholder:text-[#91beca] dark:text-white focus:outline-0 focus:ring-2 focus:ring-echo-blue/50 focus:border-echo-blue transition-all"
                                    placeholder="ej. Juan Pérez"
                                    type="text"
                                />
                            </div>

                            {/* Email Address */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium leading-normal dark:text-white text-slate-900">
                                    Correo Electrónico
                                </label>
                                <input
                                    className="form-input flex w-full rounded-lg border border-slate-300 dark:border-[#325c67] bg-slate-50 dark:bg-[#192e34] h-12 px-4 text-base placeholder:text-slate-400 dark:placeholder:text-[#91beca] dark:text-white focus:outline-0 focus:ring-2 focus:ring-echo-blue/50 focus:border-echo-blue transition-all"
                                    placeholder="admin@empresa.com"
                                    type="email"
                                />
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium leading-normal dark:text-white text-slate-900">
                                    Contraseña
                                </label>
                                <div className="relative flex w-full items-center">
                                    <input
                                        className="form-input flex-1 rounded-lg border border-slate-300 dark:border-[#325c67] bg-slate-50 dark:bg-[#192e34] h-12 pl-4 pr-12 text-base placeholder:text-slate-400 dark:placeholder:text-[#91beca] dark:text-white focus:outline-0 focus:ring-2 focus:ring-echo-blue/50 focus:border-echo-blue transition-all"
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        className="absolute right-0 flex h-12 w-12 items-center justify-center text-slate-400 dark:text-[#91beca] hover:text-echo-blue transition-colors"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                                {/* Strength Meter Hint */}
                                {password && (
                                    <div className="flex items-center gap-2 mt-1 animate-in fade-in duration-300">
                                        <div className="h-1 flex-1 rounded-full bg-slate-200 dark:bg-[#234048] overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${strength.color}`}
                                                style={{ width: strength.width }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-slate-500 dark:text-[#91beca] min-w-[3rem] text-right font-medium">
                                            {strength.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium leading-normal dark:text-white text-slate-900">
                                    Confirmar Contraseña
                                </label>
                                <div className="relative flex w-full items-center">
                                    <input
                                        className="form-input flex-1 rounded-lg border border-slate-300 dark:border-[#325c67] bg-slate-50 dark:bg-[#192e34] h-12 pl-4 pr-12 text-base placeholder:text-slate-400 dark:placeholder:text-[#91beca] dark:text-white focus:outline-0 focus:ring-2 focus:ring-echo-blue/50 focus:border-echo-blue transition-all"
                                        placeholder="••••••••"
                                        type={showConfirmPassword ? "text" : "password"}
                                    />
                                    <button
                                        className="absolute right-0 flex h-12 w-12 items-center justify-center text-slate-400 dark:text-[#91beca] hover:text-echo-blue transition-colors"
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <span className="material-symbols-outlined">{showConfirmPassword ? 'visibility' : 'visibility_off'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button className="mt-4 flex w-full items-center justify-center rounded-lg bg-echo-blue h-12 px-4 text-white text-base font-bold shadow-lg shadow-echo-blue/20 hover:bg-echo-blue/90 focus:ring-4 focus:ring-echo-blue/30 transition-all active:scale-[0.98]">
                                Registrarse
                            </button>

                            <div className="text-center mt-2">
                                <p className="text-sm text-slate-500 dark:text-[#91beca]">
                                    ¿Ya es administrador?{' '}
                                    <Link href="/login" className="text-echo-blue font-bold hover:underline">
                                        Iniciar Sesión
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Footer Terms */}
                    <p className="text-center text-xs text-slate-400 dark:text-[#5a7c86]">
                        Al registrarse, acepta nuestros <a href="#" className="hover:text-echo-blue underline">Términos de Servicio</a> y <a href="#" className="hover:text-echo-blue underline">Política de Privacidad</a>.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Register;
