export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// TODO: Add withAdminAuth(handler) protection - Task 4.4
import { NextRequest } from 'next/server';
import { withErrorHandling, apiSuccess, apiError } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import { productSchema } from '@/lib/validations/product';

export const GET = withErrorHandling(
  async (_req: NextRequest, { params }: { params?: Record<string, string> }) => {
    const id = params?.id ?? '';
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, images: { orderBy: { displayOrder: 'asc' } } },
    });
    if (!product) return apiError('Product not found', 404);
    return apiSuccess(product);
  }
);

export const PUT = withErrorHandling(
  async (req: NextRequest, { params }: { params?: Record<string, string> }) => {
    const id = params?.id ?? '';
    const body = await req.json();

    // Extract image URLs before validation
    const newImageUrls: string[] = body.newImageUrls ?? [];
    delete body.newImageUrls;

    const result = productSchema.partial().safeParse(body);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path.join('.');
        if (field) fieldErrors[field] = issue.message;
      }
      return apiError('Validation failed.', 400, fieldErrors);
    }

    // Update product fields
    const product = await prisma.product.update({ where: { id }, data: result.data });

    // Create new ProductImage records if images were uploaded
    if (newImageUrls.length > 0) {
      const existingCount = await prisma.productImage.count({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: newImageUrls.map((imageUrl, i) => ({
          productId: id,
          imageUrl,
          displayOrder: existingCount + i,
          altText: product.name,
        })),
      });
    }

    const updated = await prisma.product.findUnique({
      where: { id },
      include: { category: true, images: { orderBy: { displayOrder: 'asc' } } },
    });

    return apiSuccess(updated);
  }
);

export const DELETE = withErrorHandling(
  async (_req: NextRequest, { params }: { params?: Record<string, string> }) => {
    const id = params?.id ?? '';
    await prisma.product.update({ where: { id }, data: { active: false } });
    return apiSuccess({ message: 'Product removed from catalogue.' });
  }
);
