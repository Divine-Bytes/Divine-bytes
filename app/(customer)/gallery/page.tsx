import type { Metadata } from 'next';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Browse our gallery of luxury handcrafted chocolates and beautiful packaging.',
};

// Cache gallery for 5 minutes
export const revalidate = 300;

async function getGalleryImages() {
  try { return await prisma.galleryImage.findMany({ orderBy: { displayOrder: 'asc' } }); }
  catch { return []; }
}

export default async function GalleryPage() {
  const images = await getGalleryImages();
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl md:text-4xl text-deep-navy mb-2">Our Gallery</h1>
        <p className="font-body text-gray-500 max-w-xl mx-auto">A glimpse into every handcrafted creation — chocolates, packaging, and moments worth celebrating.</p>
      </div>
      <GalleryGrid images={images} />
    </div>
  );
}
