import Image from 'next/image';
import Link from 'next/link';

interface FooterProps {
  contactNumber?: string;
  instagramLink?: string;
}

export function Footer({ contactNumber = '+92315-7713874', instagramLink = 'https://www.instagram.com/divine_bytes.pk?igsh=MXJ3N2x3MHZiMms3eg==' }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-deep-navy text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-luxury-gold/50 shrink-0">
                <Image src="/logo.jpeg" alt="Divine Bytes" fill className="object-cover object-center scale-110" sizes="48px" />
              </div>
              <span className="font-heading text-2xl text-luxury-gold">Divine Bytes</span>
            </div>
            <p className="font-body text-sm text-white/70 max-w-xs">
              Luxury handcrafted chocolates made with the finest ingredients. Every bite, a moment of pure indulgence.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <p className="font-body font-medium text-sm text-white/50 uppercase tracking-wider mb-4">Explore</p>
            <ul className="flex flex-col gap-3">
              {['Shop', 'Gallery', 'About', 'Contact', 'FAQ'].map((page) => (
                <li key={page}>
                  <Link
                    href={`/${page.toLowerCase()}`}
                    className="font-body text-sm text-white/80 hover:text-luxury-gold transition-colors duration-150"
                  >
                    {page}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <p className="font-body font-medium text-sm text-white/50 uppercase tracking-wider">Get in Touch</p>
            <a href={`https://wa.me/923157713874`} className="font-body text-sm text-white/80 hover:text-luxury-gold transition-colors">
              📱 +92315-7713874
            </a>
            <a href="https://www.instagram.com/divine_bytes.pk?igsh=MXJ3N2x3MHZiMms3eg==" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-white/80 hover:text-luxury-gold transition-colors">
              📸 @divine_bytes.pk
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-white/40">© {year} Divine Bytes. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="font-body text-xs text-white/40 hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="font-body text-xs text-white/40 hover:text-white/70 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
