'use client';

import { useState, useRef, TouchEvent } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/types';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

/** Renders local /uploads/ paths as plain <img> and external URLs via Next.js Image */
function SmartImage({ src, alt, fill, className, sizes, priority }: {
  src: string; alt: string; fill?: boolean; className?: string; sizes?: string; priority?: boolean;
}) {
  const isLocal = src.startsWith('/') && !src.startsWith('//');
  if (isLocal) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn('w-full h-full', className)}
        loading={priority ? 'eager' : 'lazy'}
        style={{ objectFit: 'cover' }}
      />
    );
  }
  return (
    <Image src={src} alt={alt} fill={fill} className={className} sizes={sizes} priority={priority} />
  );
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef(0);

  const imgs = images.length
    ? images
    : [{ id: 'ph', imageUrl: '/placeholder-chocolate.jpg', altText: productName, productId: '', displayOrder: 0 }];

  function onTouchStart(e: TouchEvent) { touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e: TouchEvent) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      setActive(prev => diff > 0 ? Math.min(prev + 1, imgs.length - 1) : Math.max(prev - 1, 0));
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <SmartImage
          src={imgs[active].imageUrl}
          alt={imgs[active].altText || productName}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Product images">
          {imgs.map((img, i) => (
            <button
              key={img.id}
              role="tab"
              aria-selected={i === active}
              aria-label={`Image ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                'relative w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-colors',
                i === active ? 'border-luxury-gold' : 'border-transparent hover:border-gray-200'
              )}
            >
              <SmartImage src={img.imageUrl} alt={img.altText || productName} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
