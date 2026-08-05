import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import prisma from '@/lib/prisma';

// Cache homepage for 60 seconds
export const revalidate = 60;

async function getData() {
  try {
    const [products, gallery, settings] = await Promise.all([
      prisma.product.findMany({ where: { active: true }, include: { images: { orderBy: { displayOrder: 'asc' } } }, orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }] }),
      prisma.galleryImage.findMany({ orderBy: { displayOrder: 'asc' }, take: 6 }),
      prisma.websiteSetting.findFirst(),
    ]);
    return { products, gallery, settings };
  } catch { return { products: [], gallery: [], settings: null }; }
}

export default async function HomePage() {
  const { products, gallery, settings } = await getData();
  const featured = products.filter(p => p.featured);
  const signatureBar = products.find(p => p.slug === 'signature-chocolate-bar');

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[70dvh] md:min-h-[85dvh] flex items-center overflow-hidden">
        {/* Hero background image */}
        <div className="absolute inset-0">
          <Image
            src="/image.png"
            alt="Divine Bytes luxury handcrafted chocolates"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-deep-navy/55" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20 text-center w-full">
          <p className="font-body text-luxury-gold text-xs md:text-sm uppercase tracking-widest mb-3">Premium Handcrafted Chocolates</p>
          <h1 className="font-heading text-3xl md:text-6xl text-white mb-4 md:mb-6 max-w-2xl mx-auto leading-tight">
            Every Bite, A Moment of Pure Indulgence
          </h1>
          <p className="font-body text-white/70 text-sm md:text-lg mb-7 md:mb-10 max-w-lg mx-auto">
            Handcrafted with the finest ingredients. Beautifully gifted. Unforgettably divine.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="inline-flex items-center justify-center h-11 md:h-14 px-6 md:px-8 text-base md:text-lg rounded-full bg-luxury-gold text-deep-navy font-body font-semibold hover:bg-luxury-gold/90 transition-all duration-200 shadow-lg">Shop Collection</Link>
            <Link href="/about" className="inline-flex items-center justify-center h-11 md:h-14 px-6 md:px-8 text-base md:text-lg rounded-full border-2 border-white text-white font-body font-medium hover:bg-white hover:text-deep-navy transition-all duration-200">Explore Our Story</Link>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      {featured.length > 0 && (
        <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto w-full">
          <SectionHeader title="Featured Collection" subtitle="Our most loved handcrafted creations." centered className="mb-10" />
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {featured.slice(0, 4).map(p => <ProductCard key={p.id} product={{ ...p, price: Number(p.price) }} />)}
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/shop" className="inline-flex items-center justify-center h-11 px-6 rounded-full border-2 border-deep-navy text-deep-navy font-body font-medium hover:bg-deep-navy hover:text-white transition-all duration-200">View All Products</Link>
          </div>
        </section>
      )}

      {/* Why Divine Bytes */}
      <section className="py-10 md:py-16 bg-deep-navy/5 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionHeader title="Why Divine Bytes" centered className="mb-6 md:mb-10" />
          <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-6">
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                    <path d="M8 12s1.5 2 4 2 4-2 4-2"/>
                    <path d="M9 9h.01M15 9h.01"/>
                    <path d="M12 6v1M12 17v1M6 12h1M17 12h1"/>
                  </svg>
                ),
                title: 'Premium Ingredients',
                desc: 'Only the finest chocolate and fresh ingredients.'
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                ),
                title: 'Handcrafted with Care',
                desc: 'Made by hand in small batches with precision and love.'
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="20 12 20 22 4 22 4 12"/>
                    <rect x="2" y="7" width="20" height="5"/>
                    <line x1="12" y1="22" x2="12" y2="7"/>
                    <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
                    <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
                  </svg>
                ),
                title: 'Beautifully Giftable',
                desc: 'Elegant packaging for every occasion.'
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center p-3 md:p-6 rounded-2xl bg-white shadow-sm">
                <div className="mb-2 md:mb-4 text-luxury-gold">{icon}</div>
                <h3 className="font-heading text-xs md:text-lg text-deep-navy mb-1 md:mb-2 leading-tight">{title}</h3>
                <p className="font-body text-gray-500 text-xs hidden md:block">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Bar Highlight */}
      {signatureBar && (
        <section className="py-10 md:py-24 px-4 max-w-5xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 rounded-3xl bg-chocolate-brown/5 p-5 md:p-12">
            <div className="flex-1">
              <p className="text-luxury-gold text-xs uppercase tracking-widest font-body mb-2">Signature Collection</p>
              <h2 className="font-heading text-2xl md:text-3xl text-deep-navy mb-3">The Signature Chocolate Bar</h2>
              <p className="font-body text-gray-500 text-sm mb-4 md:mb-6">Personalize every detail — choose your chocolate base, add a name, and describe your vision. Crafted exclusively for you.</p>
              <Link href="/product/signature-chocolate-bar" className="inline-flex items-center justify-center h-11 md:h-14 px-6 md:px-8 text-sm md:text-lg rounded-full bg-deep-navy text-white font-body font-medium hover:bg-opacity-90 transition-all duration-200">Customize Yours</Link>
            </div>
            <div className="w-full md:w-72 h-48 md:h-64 rounded-2xl overflow-hidden shrink-0">
              <img src="/img box.png" alt="Divine Bytes Signature Chocolate Bars" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      {gallery.length > 0 && (
        <section className="py-16 px-4 bg-warm-white">
          <div className="max-w-7xl mx-auto">
            <SectionHeader title="A Glimpse of Our Craft" centered className="mb-10" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gallery.slice(0, 6).map((img, i) => (
                <div key={img.id} className={`relative rounded-2xl overflow-hidden bg-gray-100 ${i === 0 ? 'col-span-2 md:col-span-1 aspect-square' : 'aspect-square'}`}>
                  <Image src={img.imageUrl} alt={img.caption || `Gallery ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 33vw" />
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/gallery" className="inline-flex items-center justify-center h-11 px-6 rounded-full border-2 border-deep-navy text-deep-navy font-body font-medium hover:bg-deep-navy hover:text-white transition-all duration-200">View Full Gallery</Link>
            </div>
          </div>
        </section>
      )}

      {/* Instagram */}
      <section className="py-16 px-4 text-center bg-deep-navy">
        <p className="font-heading text-2xl text-white mb-2">Follow Us on Instagram</p>
        <p className="font-body text-white/60 mb-6">Stay inspired with our latest creations and behind-the-scenes moments.</p>
        <a href="https://www.instagram.com/divine_bytes.pk?igsh=MXJ3N2x3MHZiMms3eg==" target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-deep-navy">📸 Follow Divine Bytes</Button>
        </a>
      </section>
    </div>
  );
}
