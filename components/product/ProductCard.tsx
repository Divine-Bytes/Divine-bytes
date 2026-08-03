'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/cart/CartContext';
import { useToast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

/** Use plain <img> for local /uploads/ paths to avoid Next.js domain restrictions */
function ProductImg({ src, alt }: { src: string; alt: string }) {
  if (src.startsWith('/uploads/') || src.startsWith('/public/')) {
    return <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />;
  }
  return <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const imageUrl = product.images?.[0]?.imageUrl ?? '/placeholder-chocolate.jpg';
  const altText = product.images?.[0]?.altText || product.name;

  function handleAddToCart() {
    if (product.slug === 'signature-chocolate-bar') {
      window.location.href = `/product/${product.slug}`;
      return;
    }
    addItem({ productId: product.id, name: product.name, price: Number(product.price), quantity: 1, imageUrl, slug: product.slug });
    showToast('Added to cart', 'success');
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.3 }} className="w-full h-full">
          <ProductImg src={imageUrl} alt={altText} />
        </motion.div>
      </Link>
      <div className="p-2.5 sm:p-4 flex flex-col gap-1.5 sm:gap-2">
        <Link href={`/product/${product.slug}`} className="group-hover:text-luxury-gold transition-colors">
          <h3 className="font-heading text-sm sm:text-base text-deep-navy line-clamp-1">{product.name}</h3>
        </Link>
        <p className="font-body text-xs text-gray-400 line-clamp-2 hidden sm:block">{product.description}</p>
        <div className="flex items-center justify-between mt-1 sm:mt-2 gap-1.5">
          <span className="font-body font-semibold text-deep-navy text-sm sm:text-base">{formatPrice(Number(product.price))}</span>
          <Button size="sm" onClick={handleAddToCart} className="shrink-0 text-xs sm:text-sm px-2.5 sm:px-4 h-8 sm:h-9">
            {product.slug === 'signature-chocolate-bar' ? 'Customize' : 'Add'}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
