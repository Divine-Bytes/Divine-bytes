import type { Metadata } from 'next';
import { ShopClient } from './ShopClient';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse our full collection of luxury handcrafted chocolates.',
};

// Revalidate every 60 seconds — reduces DB calls dramatically
export const revalidate = 60;

export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-16">
      <div className="mb-5 md:mb-8">
        <h1 className="font-heading text-2xl md:text-4xl text-deep-navy mb-1">Our Collection</h1>
        <p className="font-body text-gray-500 text-sm">Discover every handcrafted creation from Divine Bytes.</p>
      </div>
      <ShopClient />
    </div>
  );
}
