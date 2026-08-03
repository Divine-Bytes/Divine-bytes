export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { withErrorHandling, apiSuccess } from '@/lib/api-handler';
import prisma from '@/lib/prisma';

export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const skip = (page - 1) * limit;
  const where: Record<string, unknown> = { active: true };

  if (search.trim()) {
    where.OR = [
      { name: { contains: search.trim(), mode: 'insensitive' } },
      { description: { contains: search.trim(), mode: 'insensitive' } },
    ];
  }

  if (categoryId.trim()) {
    where.categoryId = categoryId.trim();
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
      },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return apiSuccess({
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + products.length < total,
    },
  });
});
