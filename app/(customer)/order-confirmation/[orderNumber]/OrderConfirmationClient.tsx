'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/cart/CartContext';
import { formatPrice } from '@/lib/utils';

interface Order {
  orderNumber: string;
  totalAmount: unknown;
  paymentMethod: string;
  deliveryAddress: string;
  city: string;
  customer: { fullName: string; phoneNumber: string } | null;
  items: Array<{ id: string; quantity: number; unitPrice: unknown; product: { name: string } | null }>;
}

export function OrderConfirmationClient({ order }: { order: Order }) {
  const { clearCart } = useCart();
  useEffect(() => { clearCart(); }, []);

  const whatsappMsg = encodeURIComponent(`Hi Divine Bytes! I just placed order #${order.orderNumber}. Can you confirm?`);
  const whatsappUrl = `https://wa.me/923157713874?text=${whatsappMsg}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 md:py-16 text-center">
      <div className="mb-6 text-5xl">🎉</div>
      <h1 className="font-heading text-3xl md:text-4xl text-deep-navy mb-3">Order Placed!</h1>
      <p className="font-body text-gray-500 mb-2">Thank you, {order.customer?.fullName}. Your order has been received.</p>
      <p className="font-heading text-xl text-luxury-gold mb-8">Order #{order.orderNumber}</p>

      <div className="rounded-2xl border border-gray-100 p-6 text-left mb-8">
        <h2 className="font-heading text-lg text-deep-navy mb-4">Order Summary</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm font-body text-dark-gray mb-2">
            <span>{item.product?.name ?? 'Product'} × {item.quantity}</span>
            <span>{formatPrice(Number(item.unitPrice) * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-body font-semibold text-deep-navy">
          <span>Total</span><span>{formatPrice(Number(order.totalAmount))}</span>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm font-body text-gray-500 space-y-1">
          <p><strong className="text-dark-gray">Delivery:</strong> {order.deliveryAddress}, {order.city}</p>
          <p><strong className="text-dark-gray">Payment:</strong> {order.paymentMethod.replace(/_/g, ' ')}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <Button size="lg" className="w-full sm:w-auto">📱 Track via WhatsApp</Button>
        </a>
        <Link href="/shop" className="inline-flex items-center justify-center h-14 px-8 text-lg rounded-full border-2 border-deep-navy text-deep-navy font-body font-medium hover:bg-deep-navy hover:text-white transition-all duration-200">Continue Shopping</Link>
      </div>
    </div>
  );
}
