'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { CustomizationPanel } from '@/components/product/CustomizationPanel';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/cart/CartContext';
import { useToast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/utils';
import type { Product, CustomizationData } from '@/types';

interface ProductDetailsClientProps {
  product: Product & { price: number };
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [qty, setQty] = useState(1);
  const [customization, setCustomization] = useState<CustomizationData | null>(null);
  const [customError, setCustomError] = useState('');
  const { addItem } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const isSignatureBar = product.slug === 'signature-chocolate-bar';

  function handleAddToCart() {
    if (isSignatureBar && !customization) {
      setCustomError('Please select a Chocolate Base before adding to cart.');
      document.getElementById('customization')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setCustomError('');
    addItem({
      productId: product.id, name: product.name, price: product.price, quantity: qty,
      imageUrl: product.images?.[0]?.imageUrl ?? '', slug: product.slug,
      customization: customization ?? undefined,
    });
    showToast('Added to cart', 'success');
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-16">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm font-body text-gray-500 hover:text-deep-navy transition-colors mb-6 min-h-[44px]"
        aria-label="Go back"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <ProductImageGallery images={product.images ?? []} productName={product.name} />
        <div className="flex flex-col gap-5">
          <div>
            {product.category && <p className="text-xs text-luxury-gold font-body uppercase tracking-wider mb-1">{product.category.name}</p>}
            <h1 className="font-heading text-3xl text-deep-navy mb-2">{product.name}</h1>
            <p className="font-heading text-2xl text-deep-navy">{formatPrice(product.price)}</p>
          </div>
          <p className="font-body text-gray-500 text-sm leading-relaxed">{product.description}</p>

          {isSignatureBar && (
            <div id="customization">
              <CustomizationPanel onChange={setCustomization} />
              {customError && <p role="alert" className="text-sm text-red-500 mt-2">{customError}</p>}
            </div>
          )}

          <div className="flex items-center gap-4 flex-wrap">
            <QuantitySelector value={qty} onChange={setQty} />
            <Button onClick={handleAddToCart} size="lg" className="flex-1 min-w-[160px]">
              {isSignatureBar ? 'Add Customized Bar to Cart' : 'Add to Cart'}
            </Button>
          </div>

          {/* Mobile sticky bar */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-warm-white/95 backdrop-blur-sm border-t border-gray-100 md:hidden z-30">
            <Button onClick={handleAddToCart} size="lg" className="w-full">
              {isSignatureBar ? 'Add Customized Bar to Cart' : `Add to Cart · ${formatPrice(product.price * qty)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
