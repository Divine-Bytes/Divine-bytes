import { NextRequest } from 'next/server';
import { withErrorHandling, apiSuccess, apiError } from '@/lib/api-handler';
import prisma from '@/lib/prisma';

export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params?: Record<string, string> }) => {
    const slug = params?.slug ?? '';

    const product = await prisma.product.findFirst({
      where: { slug, active: true },
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
      },
    });

    if (!product) {
      return apiError('Product not found', 404);
    }

    return apiSuccess(product);
  }
);
