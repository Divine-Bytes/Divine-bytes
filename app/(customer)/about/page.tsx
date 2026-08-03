import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Divine Bytes — our story, mission, and passion for handcrafted luxury chocolates.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 md:py-16">
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-12">
        <Image
          src="/image_white.png"
          alt="Divine Bytes handcrafted chocolates"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-deep-navy/40 rounded-3xl" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8">
          <span className="font-body text-luxury-gold/90 text-xs uppercase tracking-widest">Est. in Lahore</span>
          <span className="font-heading text-4xl md:text-5xl text-white text-center drop-shadow-lg">Crafted with Love</span>
          <span className="font-body text-white/70 text-sm">Premium handcrafted chocolates</span>
        </div>
      </div>

      <div className="prose prose-stone max-w-none font-body text-dark-gray space-y-8">
        <section>
          <h1 className="font-heading text-3xl md:text-4xl text-deep-navy mb-4">Our Story</h1>
          <p className="text-gray-600 leading-relaxed">Divine Bytes was born from a deep love of chocolate and a desire to create something truly special. Every piece we craft is a labour of love — made by hand, finished with care, and designed to bring joy.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-deep-navy mb-3">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">We believe gifting should feel extraordinary. Whether it is a birthday, anniversary, wedding, or just because — Divine Bytes creates moments worth remembering. We use only the finest ingredients to ensure every bite is a true luxury experience.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-deep-navy mb-3">The Craft</h2>
          <p className="text-gray-600 leading-relaxed">Each chocolate is handcrafted in small batches. We temper our chocolate by hand, layer flavours carefully, and finish every piece with precision. No shortcuts, no compromises — only the best for our customers.</p>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-deep-navy mb-3">Beautiful Packaging</h2>
          <p className="text-gray-600 leading-relaxed">A Divine Bytes gift is complete from the first impression. Our packaging is designed to feel as special as the chocolate inside — elegant, thoughtful, and made to be remembered.</p>
        </section>

        <div className="flex justify-center pt-6">
        <Link href="/shop" className="inline-flex items-center justify-center h-14 px-8 text-lg rounded-full bg-deep-navy text-white font-body font-medium hover:bg-opacity-90 transition-all duration-200">Explore Our Collection</Link>
        </div>
      </div>
    </div>
  );
}
