import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Divine Bytes — Luxury Handcrafted Chocolates',
    template: '%s | Divine Bytes',
  },
  description:
    'Discover Divine Bytes — premium handcrafted chocolates made with the finest ingredients. Shop our collection of luxury chocolate gifts.',
  keywords: ['handcrafted chocolates', 'luxury chocolates', 'chocolate gifts', 'Divine Bytes'],
  openGraph: {
    type: 'website',
    siteName: 'Divine Bytes',
    title: 'Divine Bytes — Luxury Handcrafted Chocolates',
    description:
      'Discover Divine Bytes — premium handcrafted chocolates made with the finest ingredients.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-body antialiased bg-warm-white text-dark-gray">{children}</body>
    </html>
  );
}
