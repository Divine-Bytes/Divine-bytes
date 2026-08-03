import type { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = { title: 'Dashboard — Divine Bytes Admin' };

async function getStats() {
  const [totalOrders, pendingOrders, pendingPayments, revenueResult, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { orderStatus: 'PENDING' } }),
    prisma.order.count({ where: { paymentStatus: 'PENDING', paymentMethod: { not: 'CASH_ON_DELIVERY' } } }),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { customer: true } }),
  ]);
  return { totalOrders, pendingOrders, pendingPayments, totalRevenue: Number(revenueResult._sum.totalAmount ?? 0), recentOrders };
}

export default async function AdminDashboardPage() {
  const { totalOrders, pendingOrders, pendingPayments, totalRevenue, recentOrders } = await getStats();

  const stats = [
    { label: 'Total Orders', value: totalOrders, color: 'bg-blue-50 text-blue-700' },
    { label: 'Total Revenue', value: formatPrice(totalRevenue), color: 'bg-green-50 text-green-700' },
    { label: 'Pending Orders', value: pendingOrders, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Pending Payments', value: pendingPayments, color: 'bg-orange-50 text-orange-700' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <h1 className="font-heading text-2xl text-deep-navy mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <div key={s.label} className={`rounded-2xl p-5 ${s.color}`}>
            <p className="font-body text-xs opacity-70 mb-1">{s.label}</p>
            <p className="font-heading text-2xl">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg text-deep-navy">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-luxury-gold font-body hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead><tr className="border-b border-gray-100 text-gray-400 text-left">
              <th className="pb-3 pr-4">Order #</th><th className="pb-3 pr-4">Customer</th>
              <th className="pb-3 pr-4">Total</th><th className="pb-3 pr-4">Payment</th><th className="pb-3">Status</th>
            </tr></thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 pr-4"><Link href={`/admin/orders/${o.id}`} className="text-luxury-gold hover:underline">{o.orderNumber}</Link></td>
                  <td className="py-3 pr-4">{o.customer?.fullName ?? '—'}</td>
                  <td className="py-3 pr-4">{formatPrice(Number(o.totalAmount))}</td>
                  <td className="py-3 pr-4">{o.paymentMethod.replace(/_/g, ' ')}</td>
                  <td className="py-3"><StatusBadge status={o.orderStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!recentOrders.length && <p className="text-center text-gray-400 py-8 font-body">No orders yet.</p>}
        </div>
      </div>
    </div>
  );
}
