import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { authConfig } from './lib/auth';
import { getSession } from 'next-auth/react';

export async function middleware(req:any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("token ==> ", token);
  const url = req.nextUrl.pathname;
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const userType = token.type; // Assuming token contains 'type'

  if (userType == 'guest') {
    return NextResponse.redirect(new URL('/signup', req.url));
  }

  // Authorization logic
  if (url.startsWith('/admin/dashboard') && userType !== 'admin') {
    return NextResponse.redirect(new URL('/moderator/dashboard', req.url));
  }

  if (url.startsWith('/moderator/dashboard') && userType !== 'moderator') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  // If authorized, continue
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/moderator/dashboard/:path*'],
};
