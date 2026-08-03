import type { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { AdminProductsClient } from './AdminProductsClient';

export const metadata: Metadata = { title: 'Products — Divine Bytes Admin' };

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl text-deep-navy">Products</h1>
        <Link href="/admin/products/new"
          className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-deep-navy text-white font-body text-sm hover:bg-opacity-90 transition-colors">
          + New Product
        </Link>
      </div>
      <AdminProductsClient products={JSON.parse(JSON.stringify(products))} />
    </div>
  );
}
