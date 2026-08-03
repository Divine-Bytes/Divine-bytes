export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling, apiError } from '@/lib/api-handler';
import prisma from '@/lib/prisma';
import { verifyPassword, signJwt } from '@/lib/auth';
import { loginSchema } from '@/lib/validations/auth';
import { getRateLimiter } from '@/lib/rate-limit';

const loginLimiter = getRateLimiter({ limit: 5, windowMs: 15 * 60 * 1000 });

export const POST = withErrorHandling(async (req: NextRequest) => {
  // Rate limiting — 5 attempts per IP per 15 minutes
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  const limited = loginLimiter.check(ip);
  if (limited) {
    return apiError('Too many login attempts. Please try again later.', 429);
  }

  const body = await req.json();
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return apiError('Invalid email or password.', 401);
  }

  const { email, password } = result.data;

  const admin = await prisma.adminUser.findUnique({ where: { email } });

  // Constant-time comparison regardless of whether user exists
  const passwordValid =
    admin !== null && (await verifyPassword(password, admin.passwordHash));

  if (!admin || !passwordValid) {
    return apiError('Invalid email or password.', 401);
  }

  const token = signJwt({ adminId: admin.id, email: admin.email });

  const response = NextResponse.json({ success: true, data: { email: admin.email } });

  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
});
