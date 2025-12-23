'use client';
import Dashboard from '../../components/dashboard/Dashboard';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();

    const handleLogout = () => {
        router.push('/login');
    };

    return <Dashboard onLogout={handleLogout} />;
}
