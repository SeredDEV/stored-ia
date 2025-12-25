'use client';
import React, { Suspense } from 'react';
import Dashboard from '../../components/dashboard/Dashboard';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();

    const handleLogout = () => {
        router.push('/login');
    };

    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Cargando...</div>}>
            <Dashboard onLogout={handleLogout} />
        </Suspense>
    );
}
