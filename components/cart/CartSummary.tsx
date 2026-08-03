'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/cart/CartContext';
import { formatPrice } from '@/lib/utils';

export function CartSummary() {
  const { items, total } = useCart();

  return (
    <div className="rounded-2xl border border-gray-100 p-5 bg-white flex flex-col gap-4">
      <h3 className="font-heading text-lg text-deep-navy">Order Summary</h3>

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm font-body text-dark-gray">
            <span className="truncate max-w-[200px]">{item.name} × {item.quantity}</span>
            <span className="shrink-0 ml-2">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-3 flex justify-between font-body font-semibold text-deep-navy">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      <Link href="/checkout" className="inline-flex items-center justify-center h-14 px-8 text-lg rounded-full bg-deep-navy text-white font-body font-medium transition-all duration-200 hover:bg-opacity-90 w-full">
        Proceed to Checkout
      </Link>

      <Link href="/shop" className="inline-flex items-center justify-center h-11 px-6 rounded-full border-2 border-deep-navy text-deep-navy font-body font-medium hover:bg-deep-navy hover:text-white transition-all duration-200">
          Continue Shopping
        </Link>
    </div>
  );
}
