import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { OrderConfirmationClient } from './OrderConfirmationClient';

interface Props { params: { orderNumber: string }; }

export const metadata: Metadata = { title: 'Order Confirmed' };
export const dynamic = 'force-dynamic';

async function getOrder(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { customer: true, items: { include: { product: true } } },
  });
}

export default async function OrderConfirmationPage({ params }: Props) {
  const order = await getOrder(params.orderNumber);
  if (!order) notFound();
  return <OrderConfirmationClient order={order} />;
}
