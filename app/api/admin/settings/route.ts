// TODO: Add withAdminAuth(handler) protection - Task 4.4
import { NextRequest } from 'next/server';
import { withErrorHandling, apiSuccess, apiError } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import { settingsSchema } from '@/lib/validations/settings';

export const GET = withErrorHandling(async (_req: NextRequest) => {
  const settings = await prisma.websiteSetting.findFirst();
  return apiSuccess(settings);
});

export const PUT = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const result = settingsSchema.partial().safeParse(body);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path.join('.');
      if (field) fieldErrors[field] = issue.message;
    }
    return apiError('Validation failed.', 400, fieldErrors);
  }

  const existing = await prisma.websiteSetting.findFirst();
  let settings;
  if (existing) {
    settings = await prisma.websiteSetting.update({
      where: { id: existing.id },
      data: result.data,
    });
  } else {
    settings = await prisma.websiteSetting.create({
      data: {
        businessName: result.data.businessName ?? 'Divine Bytes',
        contactNumber: result.data.contactNumber ?? '',
        ...result.data,
      },
    });
  }
  return apiSuccess(settings);
});
