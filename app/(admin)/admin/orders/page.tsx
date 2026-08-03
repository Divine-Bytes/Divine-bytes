import type { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = { title: 'Orders — Divine Bytes Admin' };

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }, include: { customer: true } });

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <h1 className="font-heading text-2xl text-deep-navy mb-8">Orders</h1>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead><tr className="border-b border-gray-100 text-gray-400 text-left bg-gray-50">
              <th className="p-4">Order #</th><th className="p-4">Customer</th><th className="p-4">Phone</th>
              <th className="p-4">Total</th><th className="p-4">Payment</th><th className="p-4">Status</th><th className="p-4">Date</th>
            </tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4"><Link href={`/admin/orders/${o.id}`} className="text-luxury-gold hover:underline font-medium">{o.orderNumber}</Link></td>
                  <td className="p-4">{o.customer?.fullName ?? '—'}</td>
                  <td className="p-4">{o.customer?.phoneNumber ?? '—'}</td>
                  <td className="p-4">{formatPrice(Number(o.totalAmount))}</td>
                  <td className="p-4">{o.paymentMethod.replace(/_/g, ' ')}</td>
                  <td className="p-4"><StatusBadge status={o.orderStatus} /></td>
                  <td className="p-4 text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-PK')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!orders.length && <p className="text-center text-gray-400 py-12 font-body">No orders yet.</p>}
        </div>
      </div>
    </div>
  );
}
