// TODO: Add withAdminAuth(handler) protection - Task 4.4
import { NextRequest } from 'next/server';
import { withErrorHandling, apiSuccess } from '@/lib/api-handler';
import prisma from '@/lib/prisma';

export const GET = withErrorHandling(async (_req: NextRequest) => {
  const [
    totalOrders,
    pendingOrders,
    pendingPayments,
    revenueResult,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { orderStatus: 'PENDING' } }),
    prisma.order.count({ where: { paymentStatus: 'PENDING', paymentMethod: { not: 'CASH_ON_DELIVERY' } } }),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { customer: true },
    }),
  ]);

  return apiSuccess({
    stats: {
      totalOrders,
      totalRevenue: Number(revenueResult._sum.totalAmount ?? 0),
      pendingOrders,
      pendingPayments,
    },
    recentOrders,
  });
});
