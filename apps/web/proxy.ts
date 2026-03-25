import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('session_token')
  const { pathname } = request.nextUrl

  const protectedRoutes = ['/app']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  const isAuthPage = pathname.startsWith('/auth')

  if (isProtectedRoute && !token) {
    const url = new URL('/auth', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/app', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app', '/app/:path*', '/auth'],
}
