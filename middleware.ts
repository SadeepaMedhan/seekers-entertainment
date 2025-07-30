import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware runs on all requests
export function middleware(request: NextRequest) {
  // Only trigger auto-seeding on specific paths during build/deployment
  if (request.nextUrl.pathname === '/api/seed' && request.method === 'GET') {
    // Allow the seeding API to run
    return NextResponse.next()
  }

  // For all other requests, continue normally
  return NextResponse.next()
}

// Configure which paths trigger middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
