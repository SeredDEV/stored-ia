'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import BackgroundBlobs from '../ui/BackgroundBlobs';

const NewPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Strength Logic
    const getStrength = (pass: string) => {
        if (!pass) return { score: 0, label: '-', color: 'bg-gray-200 dark:bg-gray-700' };

        const len = pass.length;
        const hasSymbol = /[^A-Za-z0-9]/.test(pass);

        // Nivel 1: Débil (Menos de 5 caracteres)
        if (len < 5) {
            return { score: 1, label: 'Débil', color: 'bg-red-500' };
        }

        // Nivel 2: Regular (5 o más caracteres, pero SIN símbolo)
        // Nota: Si el usuario escribe símbolos antes de llegar a 5, saltará a Fuerte al llegar a 5.
        // Esto es comportamiento esperado, pero aseguramos que el estado intermedio existe para puras letras/números.
        if (!hasSymbol) {
            return { score: 2, label: 'Regular', color: 'bg-yellow-400' };
        }

        // Nivel 3: Fuerte (5 o más caracteres Y con símbolo)
        return { score: 3, label: 'Fuerte', color: 'bg-primary' };
    };

    const strength = getStrength(password);
    const hasMinLength = password.length >= 5;
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

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
                    <form className="flex flex-col gap-5">
                        <label className="flex flex-col gap-2">
                            <span className="text-[#090808] dark:text-white text-sm font-semibold leading-normal">Nueva Contraseña</span>
                            <div className="relative group">
                                <input
                                    className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#0d181c] dark:text-white placeholder:text-[#9bbcc6] dark:placeholder:text-slate-600 bg-[#f8fbfc] dark:bg-[#101e22] border border-[#cfe2e8] dark:border-[#2a3c42] focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 px-4 pr-12 text-base font-normal leading-normal transition-colors"
                                    placeholder="Ingrese nueva contraseña"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                    className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#0d181c] dark:text-white placeholder:text-[#9bbcc6] dark:placeholder:text-slate-600 bg-[#f8fbfc] dark:bg-[#101e22] border border-[#cfe2e8] dark:border-[#2a3c42] focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 px-4 pr-12 text-base font-normal leading-normal transition-colors"
                                    placeholder="Confirme nueva contraseña"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                    5+ caracteres
                                </div>
                                <div className={`flex items-center gap-1.5 text-xs transition-colors duration-300 ${hasSymbol ? 'text-[#0d181c] dark:text-slate-300 font-medium' : 'text-gray-400'}`}>
                                    <span className={`material-symbols-outlined text-[16px] ${hasSymbol ? 'text-green-600' : 'text-[#9bbcc6]'}`}>
                                        {hasSymbol ? 'check_small' : 'radio_button_unchecked'}
                                    </span>
                                    Símbolo
                                </div>
                            </div>
                        </div>

                        <button className="mt-2 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary hover:bg-[#0d95ba] text-white text-base font-bold leading-normal tracking-[0.015em] shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed" type="button" disabled={!hasMinLength}>
                            <span className="truncate">Actualizar Contraseña</span>
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
