import { NextRequest } from 'next/server';
import { withErrorHandling, apiSuccess } from '@/lib/api-handler';
import prisma from '@/lib/prisma';

export const GET = withErrorHandling(async (_req: NextRequest) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return apiSuccess(categories);
});
