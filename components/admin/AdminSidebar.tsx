'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '🍫' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/customers', label: 'Customers', icon: '👥' },
  { href: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <aside className="w-64 min-h-screen bg-deep-navy flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-white/10">
        <span className="font-heading text-xl text-luxury-gold">Divine Bytes</span>
        <p className="text-white/40 text-xs font-body mt-0.5">Admin Dashboard</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1" aria-label="Admin navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-colors min-h-[44px]',
              pathname.startsWith(item.href)
                ? 'bg-white/10 text-white font-medium'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            )}
            aria-current={pathname.startsWith(item.href) ? 'page' : undefined}>
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-body text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors min-h-[44px]">
          <span aria-hidden>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
