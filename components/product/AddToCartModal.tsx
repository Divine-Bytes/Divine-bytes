'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { useCart } from '@/lib/cart/CartContext';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface AddToCartModalProps {
  product: Product & { price: number };
  imageUrl: string;
  open: boolean;
  onClose: () => void;
  initialQty?: number;
}

export function AddToCartModal({ product, imageUrl, open, onClose, initialQty = 1 }: AddToCartModalProps) {
  const [qty, setQty] = useState(initialQty);
  const { addItem } = useCart();
  const router = useRouter();

  function handleAction(destination: 'cart' | 'shop') {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      imageUrl,
      slug: product.slug,
    });
    onClose();
    router.push(destination === 'cart' ? '/cart' : '/shop');
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Bottom sheet on mobile, centered modal on desktop */}
          <motion.div
            role="dialog"
            aria-modal
            aria-label={`Add ${product.name} to cart`}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 shadow-2xl
                       md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
                       md:rounded-2xl md:max-w-sm md:w-full"
          >
            {/* Drag handle (mobile) */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 md:hidden" aria-hidden />

            {/* Product info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                {imageUrl.startsWith('/uploads/') ? (
                  <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Image src={imageUrl} alt={product.name} fill className="object-cover" sizes="64px" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-base text-deep-navy line-clamp-1">{product.name}</h3>
                <p className="font-body text-sm text-luxury-gold font-semibold">{formatPrice(product.price)}</p>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between mb-6">
              <span className="font-body text-sm text-gray-500">Quantity</span>
              <QuantitySelector value={qty} onChange={setQty} />
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between mb-6 py-3 border-t border-b border-gray-100">
              <span className="font-body text-sm text-gray-500">Subtotal</span>
              <span className="font-body font-semibold text-deep-navy">{formatPrice(product.price * qty)}</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleAction('cart')}
                className="w-full h-12 rounded-full bg-deep-navy text-white font-body font-medium text-sm hover:bg-opacity-90 transition-all duration-200"
              >
                View Cart
              </button>
              <button
                onClick={() => handleAction('shop')}
                className="w-full h-12 rounded-full border-2 border-deep-navy text-deep-navy font-body font-medium text-sm hover:bg-deep-navy hover:text-white transition-all duration-200"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
