import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth';

type RouteContext = {
  params?: Record<string, string>;
};

type RouteHandler = (req: NextRequest, context: RouteContext) => Promise<NextResponse>;

/**
 * Wraps an admin API route handler with JWT authentication.
 * Returns HTTP 401 if the cookie is missing, invalid, or expired.
 */
export function withAdminAuth(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context: RouteContext) => {
    const token = req.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required.' },
        { status: 401 }
      );
    }

    const payload = verifyJwt(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Session expired. Please log in again.' },
        { status: 401 }
      );
    }

    // Attach admin info to request headers for downstream use
    const requestWithAdmin = new Request(req, {
      headers: new Headers({
        ...Object.fromEntries(req.headers.entries()),
        'x-admin-id': payload.adminId,
        'x-admin-email': payload.email,
      }),
    });

    return handler(requestWithAdmin as NextRequest, context);
  };
}
