export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { withErrorHandling, apiSuccess, apiError } from '@/lib/api-handler';
import { contactSchema } from '@/lib/validations/contact';

export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const result = contactSchema.safeParse(body);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path.join('.');
      if (field) fieldErrors[field] = issue.message;
    }
    return apiError('Please fill in all required fields.', 400, fieldErrors);
  }

  // In production, send to WhatsApp Business API or email
  // For now, just log server-side and return success
  console.log('[Contact Form]', {
    fullName: result.data.fullName,
    phoneNumber: result.data.phoneNumber,
    message: result.data.message.substring(0, 50) + '...',
  });

  return apiSuccess({ message: 'Message sent successfully.' });
});
