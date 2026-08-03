export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { withErrorHandling, apiSuccess, apiError } from '@/lib/api-handler';
import prisma from '@/lib/prisma';

export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get('orderNumber');

  if (!orderNumber) return apiError('Order number is required.', 400);

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      orderNumber: true,
      orderStatus: true,
      paymentStatus: true,
      totalAmount: true,
      createdAt: true,
      items: {
        select: {
          id: true,
          quantity: true,
          unitPrice: true,
          product: { select: { name: true } },
        },
      },
    },
  });

  if (!order) return apiError('Order not found.', 404);

  return apiSuccess(order);
});
