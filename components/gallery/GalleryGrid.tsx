'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GalleryLightbox } from './GalleryLightbox';
import { EmptyState } from '@/components/ui/EmptyState';
import type { GalleryImage } from '@/types';

interface GalleryGridProps {
  images: GalleryImage[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images.length) {
    return <EmptyState heading="New creations are coming soon." subtext="Check back for our latest photography." />;
  }

  return (
    <>
      {/* Mobile: 2-column grid */}
      <div className="md:hidden grid grid-cols-2 gap-2.5">
        {images.map((img, i) => (
          <button key={img.id} onClick={() => setLightboxIndex(i)} aria-label={img.caption || `Gallery image ${i + 1}`}
            className="relative aspect-square rounded-xl overflow-hidden focus-visible:ring-2 focus-visible:ring-luxury-gold">
            <Image src={img.imageUrl} alt={img.caption || `Gallery image ${i + 1}`} fill className="object-cover" sizes="50vw" />
          </button>
        ))}
      </div>

      {/* Desktop: masonry-style columns */}
      <div className="hidden md:columns-2 lg:columns-3 md:[column-gap:1rem]">
        {images.map((img, i) => (
          <button key={img.id} onClick={() => setLightboxIndex(i)} aria-label={img.caption || `Gallery image ${i + 1}`}
            className="relative w-full rounded-2xl overflow-hidden break-inside-avoid mb-4 focus-visible:ring-2 focus-visible:ring-luxury-gold group">
            <Image src={img.imageUrl} alt={img.caption || `Gallery image ${i + 1}`} width={600} height={400}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300" />
            {img.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-body">{img.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <GalleryLightbox images={images} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </>
  );
}
