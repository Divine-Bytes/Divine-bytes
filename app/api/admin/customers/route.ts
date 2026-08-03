export const dynamic = 'force-dynamic';

// TODO: Add withAdminAuth(handler) protection - Task 4.4
import { NextRequest } from 'next/server';
import { withErrorHandling, apiSuccess } from '@/lib/api-handler';
import prisma from '@/lib/prisma';

export const GET = withErrorHandling(async (_req: NextRequest) => {
  const customers = await prisma.customer.findMany({
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return apiSuccess(customers);
});
