'use client';

import { useState, useEffect } from 'react';
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
}

export function AddToCartModal({ product, imageUrl, open, onClose }: AddToCartModalProps) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const router = useRouter();

  // Reset qty each time modal opens
  useEffect(() => { if (open) setQty(1); }, [open]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet — slides up from bottom on mobile, fades in centered on sm+ */}
          <motion.div
            role="dialog"
            aria-modal
            aria-label={`Add ${product.name} to cart`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-6"
          >
            {/* Drag handle — mobile only */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden" aria-hidden />

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
            >✕</button>

            {/* Product info */}
            <div className="flex items-center gap-4 mb-5">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                {imageUrl.startsWith('/uploads/') || imageUrl.startsWith('/public/') ? (
                  <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Image src={imageUrl} alt={product.name} fill className="object-cover" sizes="64px" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-base text-deep-navy line-clamp-1">{product.name}</h3>
                <p className="font-body text-sm text-luxury-gold font-semibold mt-0.5">{formatPrice(product.price)}</p>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 mb-5">
              <span className="font-body text-sm text-gray-600">Quantity</span>
              <QuantitySelector value={qty} onChange={setQty} />
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between mb-5">
              <span className="font-body text-sm text-gray-500">Subtotal</span>
              <span className="font-body font-semibold text-deep-navy">{formatPrice(product.price * qty)}</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleAction('cart')}
                className="w-full h-12 rounded-full bg-deep-navy text-white font-body font-medium text-sm hover:bg-opacity-90 transition-all"
              >
                View Cart
              </button>
              <button
                onClick={() => handleAction('shop')}
                className="w-full h-12 rounded-full border-2 border-deep-navy text-deep-navy font-body font-medium text-sm hover:bg-deep-navy hover:text-white transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
