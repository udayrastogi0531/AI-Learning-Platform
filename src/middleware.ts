import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = ['/dashboard', '/profile', '/progress'];
const authRoutes = ['/login', '/register', '/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the route is auth-related
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Get Firebase auth token from cookies
  const firebaseToken = request.cookies.get('firebase-auth-token')?.value || 
                       request.cookies.get('__session')?.value ||
                       request.cookies.get('auth-token')?.value;
  
  // Also check for Firebase Auth ID token in various cookie formats
  const hasAuthCookie = firebaseToken || 
    request.cookies.has('firebase-auth-token') ||
    request.cookies.has('__session');
  
  // For now, disable middleware redirect to allow client-side routing to handle auth
  // This prevents the redirect loop issue with Firebase Auth
  
  // Only redirect if explicitly no auth indicators are present and it's a protected route
  // if (isProtectedRoute && !hasAuthCookie) {
  //   const loginUrl = new URL('/login', request.url);
  //   loginUrl.searchParams.set('redirect', pathname);
  //   return NextResponse.redirect(loginUrl);
  // }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|.*\\.).*)',
  ],
};
