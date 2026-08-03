'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavbarProps {
  cartCount?: number;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
  { href: '/order-status', label: 'Track Order' },
];

export function Navbar({ cartCount = 0 }: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 bg-deep-navy shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Divine Bytes home">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-luxury-gold/60 shrink-0">
              <Image src="/logo.jpeg" alt="Divine Bytes" fill className="object-cover object-center scale-110" sizes="40px" />
            </div>
            <span className="font-heading text-base sm:text-lg text-luxury-gold">Divine Bytes</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-full font-body text-base font-medium transition-colors duration-150',
                  pathname === link.href
                    ? 'text-white font-semibold bg-white/15'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart + hamburger */}
          <div className="flex items-center gap-2">
            <Link href="/cart" aria-label={`Cart, ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
              className="relative flex items-center justify-center w-11 h-11 rounded-full hover:bg-white/10 transition-colors text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-luxury-gold text-white text-[10px] font-bold flex items-center justify-center px-1">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-full hover:bg-white/10 transition-colors text-white"
              aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round"/>
                <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round"/>
                <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal aria-label="Navigation menu">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} aria-hidden />
          <nav className="absolute left-0 top-0 bottom-0 w-72 bg-deep-navy flex flex-col p-6 gap-2 animate-slide-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-luxury-gold/60 shrink-0">
                  <Image src="/logo.jpeg" alt="Divine Bytes" fill className="object-cover object-center scale-110" sizes="36px" />
                </div>
                <span className="font-heading text-lg text-luxury-gold">Divine Bytes</span>
              </div>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close menu"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white">✕</button>
            </div>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setDrawerOpen(false)}
                className={cn(
                  'px-4 py-3 rounded-xl font-body text-base transition-colors min-h-[44px] flex items-center',
                  pathname === link.href ? 'bg-white/15 text-white font-semibold' : 'text-white/75 hover:bg-white/10 hover:text-white'
                )}
                aria-current={pathname === link.href ? 'page' : undefined}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
