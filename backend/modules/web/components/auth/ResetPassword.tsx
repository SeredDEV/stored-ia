'use client';
import React from 'react';
import Link from 'next/link';
import BackgroundBlobs from '../ui/BackgroundBlobs';

const ResetPassword = () => {
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
                    <form className="flex flex-col gap-5 mt-2">
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
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none flex items-center">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </span>
                            </div>
                        </div>
                        {/* Submit Button */}
                        <button
                            className="mt-2 w-full flex items-center justify-center rounded-lg h-12 px-5 bg-primary hover:bg-primary/90 active:bg-primary/95 text-white text-base font-bold tracking-wide transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-[#1a2c32]"
                            type="button"
                        >
                            Enviar Enlace de Recuperación
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
