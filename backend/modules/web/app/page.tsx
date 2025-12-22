import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Dashboard } from '@/components/dashboard/Dashboard';

export default function HomePage() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}

