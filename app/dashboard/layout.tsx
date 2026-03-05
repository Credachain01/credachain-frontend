import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import ToastProvider from '@/components/dashboard/ToastProvider';
import AuthGuard from '@/components/AuthGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
        <DashboardSidebar />
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          <DashboardTopBar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
        <ToastProvider />
      </div>
    </AuthGuard>
  );
}
