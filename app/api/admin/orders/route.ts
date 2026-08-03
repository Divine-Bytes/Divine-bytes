export const dynamic = 'force-dynamic';

// TODO: Add withAdminAuth(handler) protection - Task 4.4
import { NextRequest } from 'next/server';
import { withErrorHandling, apiSuccess } from '@/lib/api-handler';
import prisma from '@/lib/prisma';

export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const orderStatus = searchParams.get('orderStatus');
  const paymentStatus = searchParams.get('paymentStatus');

  const where: Record<string, unknown> = {};
  if (orderStatus) where.orderStatus = orderStatus;
  if (paymentStatus) where.paymentStatus = paymentStatus;

  const orders = await prisma.order.findMany({
    where,
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
  });
  return apiSuccess(orders);
});
