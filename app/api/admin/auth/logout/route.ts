export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/api-handler';

export const POST = withErrorHandling(async () => {
  const response = NextResponse.json({ success: true, data: { message: 'Logged out.' } });

  // Clear the admin JWT cookie
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  return response;
});
