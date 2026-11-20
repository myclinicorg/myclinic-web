import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/app/lib/session';

const protectedRoutes = ['/painel'];
const publicRoutes = ['/entrar', '/cadastro', '/'];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
  const isPublicRoute = publicRoutes.includes(path);

  const hasSession = req.cookies.has(SESSION_COOKIE);

  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL('/entrar', req.nextUrl));
  }

  if (isPublicRoute && hasSession) {
    return NextResponse.redirect(new URL('/painel', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
