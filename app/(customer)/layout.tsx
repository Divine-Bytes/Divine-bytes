import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/lib/cart/CartContext';
import { ToastProvider } from '@/components/ui/Toast';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: { default: 'Divine Bytes — Luxury Handcrafted Chocolates', template: '%s | Divine Bytes' },
  description: 'Premium handcrafted chocolates made with the finest ingredients.',
  openGraph: { type: 'website', siteName: 'Divine Bytes' },
};

async function getSettings() {
  try {
    return await prisma.websiteSetting.findFirst();
  } catch { return null; }
}

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <CartProvider>
      <ToastProvider>
        <Navbar />
        <main id="main-content" className="min-h-screen bg-warm-white">
          {children}
        </main>
        <Footer
          contactNumber={settings?.contactNumber ?? '+92315-7713874'}
          instagramLink={settings?.instagramLink ?? 'https://www.instagram.com/divine_bytes.pk?igsh=MXJ3N2x3MHZiMms3eg=='}
        />
      </ToastProvider>
    </CartProvider>
  );
}
