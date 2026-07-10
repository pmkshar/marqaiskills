import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Public routes - no auth needed
  const publicPaths = ['/auth/login', '/auth/signup', '/api/auth', '/_next', '/favicon.ico'];
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  
  // Allow static assets
  if (pathname.includes('.') && !pathname.endsWith('/')) {
    return NextResponse.next();
  }
  
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || 'marq-ai-skills-platform-secret-key-2025' });
    
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    const role = token.role;
    
    // Admin-only routes (admin + manager can access)
    if (pathname.startsWith('/admin') && !['admin', 'manager'].includes(role)) {
      return NextResponse.redirect(new URL('/?error=unauthorized', request.url));
    }
    
    // Manager+ routes  
    if (pathname.startsWith('/manage') && !['admin', 'manager'].includes(role)) {
      return NextResponse.redirect(new URL('/?error=unauthorized', request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    // If JWT verification fails, redirect to login
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets).*)',
  ],
};
