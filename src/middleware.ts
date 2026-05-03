import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Public routes
  if (pathname === '/' || pathname.startsWith('/login')) {
    return NextResponse.next()
  }

  // Protected routes will handle auth via getServerSession in route components
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
