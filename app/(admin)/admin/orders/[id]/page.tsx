import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { formatPrice } from '@/lib/utils';
import { OrderDetailClient } from './OrderDetailClient';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { customer: true, items: { include: { product: { include: { images: { take: 1 } } }, customization: true } } },
  });
  if (!order) notFound();
  return <OrderDetailClient order={JSON.parse(JSON.stringify(order))} />;
}
