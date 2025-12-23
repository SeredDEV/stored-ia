'use client';
import Login from '../../components/auth/Login';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = (email: string) => {
        // In a real app, validate credentials here.
        // For now, simpler for demo:
        console.log('Logging in as', email);
        router.push('/dashboard');
    };

    return <Login onLogin={handleLogin} />;
}
