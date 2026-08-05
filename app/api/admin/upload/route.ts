export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// TODO: Add withAdminAuth(handler) protection - Task 4.4
import { NextRequest } from 'next/server';
import { withErrorHandling, apiSuccess, apiError } from '@/lib/api-handler';
import { validateFile } from '@/lib/upload/fileValidator';
import { uploadFile } from '@/lib/upload/storageService';

export const POST = withErrorHandling(async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return apiError('No file provided.', 400);
  }

  // Validate MIME type (magic bytes) and file size
  const validation = await validateFile(file);
  if (!validation.valid) {
    return apiError(validation.error ?? 'Invalid file.', 422);
  }

  // Store file in local disk (dev) or Cloudinary (prod)
  const url = await uploadFile(file);

  return apiSuccess({ url });
});
