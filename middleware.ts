import { NextRequest, NextResponse } from 'next/server';

/**
 * Lightweight middleware — just redirects to login if no cookie present.
 * Full JWT verification happens in the server component layout (lib/auth/index.ts).
 * We avoid jsonwebtoken here because it's incompatible with Edge runtime.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login page and everything non-admin
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    !pathname.startsWith('/admin')
  ) {
    return NextResponse.next();
  }

  // Just check cookie presence — full verification in layout
  const token = req.cookies.get('admin_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
