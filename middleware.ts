import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeUserRole(token: string | undefined): 'admin' | 'moderator' | 'user' | null {
  // Replace with actual decoding logic
  if (!token) return null;

  // Mock decoding for example purposes
  if (token === 'adminToken') return 'admin';
  if (token === 'moderatorToken') return 'moderator';
  return 'user';
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;
  const userRole = decodeUserRole(token);

  const url = req.nextUrl.pathname;

  if (url.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  if (url.startsWith('/moderator') && userRole !== 'moderator') {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/moderator/:path*'],
};
