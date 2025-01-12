import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get('tk')?.value

  const publicPaths = ['/login', '/signup']

  // Current path
  const path = request.nextUrl.pathname

  // If no token and trying to access protected route
  if (!token  && !publicPaths.includes(path)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If token exists and trying to access login/signup
  if (token && publicPaths.includes(path)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Continue with the request
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/login', 
    '/signup', 
    '/chat'
  ]
}