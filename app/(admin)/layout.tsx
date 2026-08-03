import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ToastProvider } from '@/components/ui/Toast';

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token')?.value;

  // Full JWT verification in server component — safe to use jsonwebtoken here
  if (!token || !verifyJwt(token)) {
    redirect('/admin/login');
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
