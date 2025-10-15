import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                      req.nextUrl.pathname.startsWith('/signup') ||
                      req.nextUrl.pathname.startsWith('/forgot-password');
    
    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      const userRoles = (token?.roles as string[]) || [];
      const redirectUrl = userRoles.includes('admin') ? '/coolers' : '/users/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    // Allow access to public pages
    if (req.nextUrl.pathname.startsWith('/landing') || 
        req.nextUrl.pathname.startsWith('/search') ||
        req.nextUrl.pathname === '/') {
      return NextResponse.next();
    }

    // Redirect unauthenticated users to login for protected routes
    if (!isAuth && (req.nextUrl.pathname.startsWith('/admins') || 
                    req.nextUrl.pathname.startsWith('/users') ||
                    req.nextUrl.pathname.startsWith('/coolers') ||
                    req.nextUrl.pathname.startsWith('/overview'))) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Role-based access control
    if (isAuth) {
      const userRoles = (token?.roles as string[]) || [];
      
      // Admin routes
      if (req.nextUrl.pathname.startsWith('/admins') && !userRoles.includes('admin')) {
        return NextResponse.redirect(new URL('/users/dashboard', req.url));
      }
      
      // User routes - allow both admin and user roles
      if (req.nextUrl.pathname.startsWith('/users') && userRoles.includes('admin')) {
        // Allow admins to access user routes, but they can also go to admin routes
        return NextResponse.next();
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // Let the middleware function handle authorization
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
