'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

interface OrderStatus {
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{ id: string; quantity: number; unitPrice: number; product: { name: string } | null }>;
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pending — We have received your order',
  CONFIRMED: 'Confirmed — Your order is confirmed',
  PREPARING: 'Preparing — Being crafted with love',
  READY: 'Ready — Packed and ready for dispatch',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const statusColors: Record<string, string> = {
  PENDING: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  CONFIRMED: 'text-blue-700 bg-blue-50 border-blue-200',
  PREPARING: 'text-purple-700 bg-purple-50 border-purple-200',
  READY: 'text-green-700 bg-green-50 border-green-200',
  DELIVERED: 'text-gray-600 bg-gray-50 border-gray-200',
  CANCELLED: 'text-red-700 bg-red-50 border-red-200',
};

export default function OrderStatusPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await fetch(`/api/order-status?orderNumber=${encodeURIComponent(orderNumber.trim())}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        setError('Order not found. Please check your order number and try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 md:py-16">
      <h1 className="font-heading text-3xl text-deep-navy mb-2">Track Your Order</h1>
      <p className="font-body text-gray-500 mb-8">Enter your order number to check the status of your order.</p>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
        <Input
          placeholder="e.g. DB-20260803-1234"
          value={orderNumber}
          onChange={e => setOrderNumber(e.target.value)}
          className="flex-1"
          aria-label="Order number"
        />
        <Button type="submit" loading={loading} className="sm:shrink-0 w-full sm:w-auto">Track</Button>
      </form>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 font-body mb-6">
          {error}
        </div>
      )}

      {order && (
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
          <div className="p-5 border-b border-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-body text-xs text-gray-400 uppercase tracking-wider">Order Number</p>
                <p className="font-heading text-xl text-deep-navy">{order.orderNumber}</p>
              </div>
              <p className="font-body text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Status badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-body font-medium ${statusColors[order.orderStatus] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
              <span className="w-2 h-2 rounded-full bg-current opacity-60" />
              {statusLabels[order.orderStatus] ?? order.orderStatus}
            </div>

            {/* Payment status */}
            {order.paymentStatus !== 'PENDING' && (
              <p className="mt-2 text-xs font-body text-gray-500">
                Payment: <span className={order.paymentStatus === 'VERIFIED' ? 'text-green-600 font-medium' : 'text-red-500'}>{order.paymentStatus}</span>
              </p>
            )}
          </div>

          {/* Order items */}
          <div className="p-5">
            <p className="font-body text-sm font-medium text-dark-gray mb-3">Items</p>
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm font-body text-dark-gray mb-2">
                <span>{item.product?.name ?? 'Product'} × {item.quantity}</span>
                <span>{formatPrice(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-body font-semibold text-deep-navy">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="px-5 pb-5">
            <a
              href={`https://wa.me/923157713874?text=${encodeURIComponent(`Hi! I'm checking on order #${order.orderNumber}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-green-500 text-white font-body text-sm font-medium hover:bg-green-600 transition-colors"
            >
              📱 Contact us on WhatsApp
            </a>
          </div>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-gray-400 font-body">
        Need help? <a href="/contact" className="text-luxury-gold hover:underline">Contact us</a>
      </p>
    </div>
  );
}
