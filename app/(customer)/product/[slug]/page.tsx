import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ProductDetailsClient } from './ProductDetailsClient';

// Revalidate every 10 seconds so new images appear quickly
export const revalidate = 10;
export const dynamic = 'force-dynamic';

interface Props { params: { slug: string }; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findFirst({ where: { slug: params.slug, active: true } });
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: { title: product.name, description: product.description.slice(0, 160) },
  };
}

async function getProduct(slug: string) {
  return prisma.product.findFirst({ where: { slug, active: true }, include: { category: true, images: { orderBy: { displayOrder: 'asc' } } } });
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Product',
    name: product.name, description: product.description,
    image: product.images[0]?.imageUrl,
    offers: { '@type': 'Offer', price: Number(product.price), priceCurrency: 'PKR', availability: 'https://schema.org/InStock' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetailsClient product={{ ...product, price: Number(product.price) }} />
    </>
  );
}
