'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { useToast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/utils';

const orderStatuses = ['PENDING','CONFIRMED','PREPARING','READY','DELIVERED','CANCELLED'].map(s => ({ value: s, label: s.charAt(0) + s.slice(1).toLowerCase() }));
const paymentStatuses = ['PENDING','VERIFIED','REJECTED'].map(s => ({ value: s, label: s.charAt(0) + s.slice(1).toLowerCase() }));

export function OrderDetailClient({ order }: { order: any }) {
  const { showToast } = useToast();
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${order.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderStatus, paymentStatus }) });
    const data = await res.json();
    if (data.success) showToast('Order updated.', 'success');
    else showToast('Failed to update order.', 'error');
    setSaving(false);
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl text-deep-navy">Order {order.orderNumber}</h1>
          <p className="font-body text-gray-400 text-sm">{new Date(order.createdAt).toLocaleString('en-PK')}</p>
        </div>
        <div className="flex gap-2"><StatusBadge status={order.orderStatus} /><StatusBadge status={order.paymentStatus} type="payment" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h2 className="font-heading text-lg text-deep-navy mb-3">Customer</h2>
          <p className="font-body text-sm text-dark-gray">{order.customer?.fullName}</p>
          <p className="font-body text-sm text-gray-500">{order.customer?.phoneNumber}</p>
          {order.customer?.email && <p className="font-body text-sm text-gray-500">{order.customer.email}</p>}
          <p className="font-body text-sm text-gray-500 mt-2">{order.deliveryAddress}, {order.city}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col gap-4">
          <h2 className="font-heading text-lg text-deep-navy mb-1">Update Status</h2>
          <Select label="Order Status" options={orderStatuses} value={orderStatus} onChange={e => setOrderStatus(e.target.value)} />
          <Select label="Payment Status" options={paymentStatuses} value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} />
          <Button onClick={save} loading={saving}>Save Changes</Button>
          {order.paymentScreenshotUrl && (
            <a href={order.paymentScreenshotUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-luxury-gold hover:underline font-body">View Payment Screenshot ↗</a>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <h2 className="font-heading text-lg text-deep-navy mb-4">Items</h2>
        {order.items.map((item: any) => (
          <div key={item.id} className="flex gap-4 py-4 border-b border-gray-50 last:border-0">
            <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden shrink-0">
              {item.product?.images?.[0] && <Image src={item.product.images[0].imageUrl} alt={item.product.name} width={64} height={64} className="object-cover w-full h-full" />}
            </div>
            <div className="flex-1">
              <p className="font-body font-medium text-dark-gray text-sm">{item.product?.name}</p>
              <p className="text-xs text-gray-400">Qty: {item.quantity} · {formatPrice(Number(item.unitPrice))} each</p>
              {item.customization && (
                <div className="mt-2 text-xs text-gray-500 space-y-1">
                  <p><span className="font-medium text-dark-gray">Base:</span> {item.customization.chocolateBase}</p>
                  {item.customization.personalizedName && <p><span className="font-medium text-dark-gray">Name:</span> {item.customization.personalizedName}</p>}
                  {item.customization.customerVision && <p><span className="font-medium text-dark-gray">Vision:</span> {item.customization.customerVision}</p>}
                  {item.customization.inspirationImageUrl && (
                    <div className="mt-2">
                      <p className="font-medium text-dark-gray mb-1">Inspiration Image:</p>
                      <a href={item.customization.inspirationImageUrl} target="_blank" rel="noopener noreferrer">
                        <img
                          src={item.customization.inspirationImageUrl}
                          alt="Customer inspiration"
                          className="w-32 h-32 object-cover rounded-xl border border-gray-200 hover:opacity-90 transition-opacity"
                        />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
            <p className="font-body font-semibold text-deep-navy text-sm shrink-0">{formatPrice(Number(item.unitPrice) * item.quantity)}</p>
          </div>
        ))}
        <div className="flex justify-between pt-4 font-body font-semibold text-deep-navy">
          <span>Total</span><span>{formatPrice(Number(order.totalAmount))}</span>
        </div>
      </div>
    </div>
  );
}
