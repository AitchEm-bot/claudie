import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('clawdie-auth')?.value === 'authenticated'
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')

  // Allow API routes through
  if (isApiRoute) {
    return NextResponse.next()
  }

  // If authenticated and trying to access login, redirect to home
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If not authenticated and not on login page, redirect to login
  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
