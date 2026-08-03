'use client';

import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCart } from '@/lib/cart/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { items } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 md:py-16">
      <h1 className="font-heading text-3xl text-deep-navy mb-8">Your Cart</h1>
      {items.length === 0 ? (
        <EmptyState
          heading="Your cart is waiting for something delicious."
          subtext="Browse our collection and add your favourites."
          action={
            <Link href="/shop" className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-deep-navy text-white font-body font-medium hover:bg-opacity-90 transition-all duration-200">
              Shop Now
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {items.map(item => <CartItem key={item.productId} item={item} />)}
          </div>
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
