export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { withErrorHandling, apiSuccess, apiError } from '@/lib/api-handler';
import prisma from '@/lib/prisma';

export const DELETE = withErrorHandling(
  async (_req: NextRequest, { params }: { params?: Record<string, string> }) => {
    const id = params?.id ?? '';
    try {
      await prisma.productImage.delete({ where: { id } });
      return apiSuccess({ message: 'Image removed.' });
    } catch {
      return apiError('Image not found.', 404);
    }
  }
);
