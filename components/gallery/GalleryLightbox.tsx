'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import type { GalleryImage } from '@/types';

interface GalleryLightboxProps {
  images: GalleryImage[];
  initialIndex: number;
  onClose: () => void;
}

export function GalleryLightbox({ images, initialIndex, onClose }: GalleryLightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex((p) => Math.min(p + 1, images.length - 1));
      if (e.key === 'ArrowLeft') setIndex((p) => Math.max(p - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [images.length, onClose]);

  const img = images[index];

  return createPortal(
    <div role="dialog" aria-modal aria-label="Image viewer" className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      {/* Close */}
      <button onClick={onClose} aria-label="Close image viewer"
        className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg transition-colors">
        ✕
      </button>

      {/* Prev */}
      {index > 0 && (
        <button onClick={() => setIndex((p) => p - 1)} aria-label="Previous image"
          className="absolute left-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
          ‹
        </button>
      )}

      {/* Image */}
      <div className="relative max-w-4xl w-full max-h-[85vh]">
        <Image src={img.imageUrl} alt={img.caption || `Image ${index + 1}`} width={1200} height={900}
          className="max-h-[80vh] w-full object-contain rounded-xl" priority />
        {img.caption && <p className="text-center text-white/70 text-sm mt-3 font-body">{img.caption}</p>}
      </div>

      {/* Next */}
      {index < images.length - 1 && (
        <button onClick={() => setIndex((p) => p + 1)} aria-label="Next image"
          className="absolute right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
          ›
        </button>
      )}

      {/* Counter */}
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs font-body">
        {index + 1} / {images.length}
      </p>
    </div>,
    document.body
  );
}
