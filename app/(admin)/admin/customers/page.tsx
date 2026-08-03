import type { Metadata } from 'next';
import prisma from '@/lib/prisma';

export const metadata: Metadata = { title: 'Customers — Divine Bytes Admin' };

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <h1 className="font-heading text-2xl text-deep-navy mb-8">Customers</h1>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead><tr className="border-b border-gray-100 text-gray-400 text-left bg-gray-50">
              <th className="p-4">Name</th><th className="p-4">Phone</th>
              <th className="p-4">Email</th><th className="p-4">City</th><th className="p-4">Orders</th>
            </tr></thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-medium text-dark-gray">{c.fullName}</td>
                  <td className="p-4">{c.phoneNumber}</td>
                  <td className="p-4 text-gray-400">{c.email ?? '—'}</td>
                  <td className="p-4">{c.city}</td>
                  <td className="p-4"><span className="font-semibold text-deep-navy">{c._count.orders}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!customers.length && <p className="text-center text-gray-400 py-12 font-body">No customers yet.</p>}
        </div>
      </div>
    </div>
  );
}
