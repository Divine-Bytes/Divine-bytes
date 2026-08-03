'use client';

import Image from 'next/image';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { useCart } from '@/lib/cart/CartContext';
import { formatPrice } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateItem, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-50">
        <Image src={item.imageUrl || '/placeholder-chocolate.jpg'} alt={item.name} fill className="object-cover" sizes="80px" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-body font-medium text-dark-gray text-sm truncate">{item.name}</h4>
        {item.customization && (
        <p className="text-xs text-gray-400 mt-0.5">
            {item.customization.chocolateBase}
            {item.customization.personalizedName && ` · "${item.customization.personalizedName}"`}
          </p>
        )}
        <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
          <QuantitySelector value={item.quantity} onChange={(q) => updateItem(item.productId, q)} />
          <div className="flex items-center gap-3">
            <span className="font-body font-semibold text-deep-navy text-sm">{formatPrice(item.price * item.quantity)}</span>
            <button onClick={() => removeItem(item.productId)} aria-label={`Remove ${item.name}`}
              className="text-gray-300 hover:text-red-400 transition-colors text-xs font-body min-h-[44px] min-w-[44px] flex items-center justify-center">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
