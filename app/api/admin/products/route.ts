// TODO: Add withAdminAuth(handler) protection - Task 4.4
import { NextRequest } from 'next/server';
import { withErrorHandling, apiSuccess, apiError } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import { productSchema } from '@/lib/validations/product';

export const GET = withErrorHandling(async (_req: NextRequest) => {
  const products = await prisma.product.findMany({
    include: { category: true, images: { orderBy: { displayOrder: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });
  return apiSuccess(products);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();

  // Extract image URLs before validation
  const imageUrls: string[] = body.images ?? [];
  delete body.images;

  const result = productSchema.safeParse(body);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path.join('.');
      if (field) fieldErrors[field] = issue.message;
    }
    return apiError('Validation failed.', 400, fieldErrors);
  }

  // Create product with images in one transaction
  const product = await prisma.product.create({
    data: {
      ...result.data,
      images: imageUrls.length > 0 ? {
        create: imageUrls.map((imageUrl, i) => ({
          imageUrl,
          displayOrder: i,
          altText: result.data.name,
        })),
      } : undefined,
    },
    include: { images: true },
  });

  return apiSuccess(product, 201);
});
