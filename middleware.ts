import { NextRequest, NextResponse } from 'next/server';

// Nombre de la cookie JWT proporcionado por el backend
const AUTH_COOKIE_NAMES = ['token'];

function decodeJwt<T = any>(token: string): T | null {
  try {
    const payload = token.split('.')[1];
    // base64url -> base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    // padding
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getUserRole(req: NextRequest): string | null {
  const cookies = req.cookies;
  let token: string | undefined;

  for (const name of AUTH_COOKIE_NAMES) {
    const c = cookies.get(name)?.value;
    if (c) { token = c; break; }
  }

  if (!token) {
    return null;
  }
  
  // Quitar prefijo 'Bearer ' si viene incluido
  if (token.startsWith('Bearer ')) {
    token = token.slice('Bearer '.length);
  }
  
  const payload = decodeJwt<{ role?: string; rol?: string }>(token);
  const rawRole = (payload?.role ?? payload?.rol) as string | undefined;
  const role = rawRole ? rawRole.toLowerCase() : null;
  
  return role;
}

const PUBLIC_PATHS = new Set<string>([
  '/',
  '/auth/login',
  '/auth/register',
  '/api',
]);

const ALLOWED_FOR_TALLER_PREFIXES = ['/taller'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Permitir estáticos y APIs
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // En desarrollo, ser más tolerante con las cookies durante compilación
  const isDev = process.env.NODE_ENV === 'development';
  const hasCookies = req.headers.get('cookie')?.includes('token=');
  
  if (isDev && !hasCookies) {
    return NextResponse.next();
  }

  const role = getUserRole(req);

  // Regla 1: Bloquear acceso a /taller/** a cualquiera que no sea Taller
  if (pathname.startsWith('/taller')) {
    if (role !== 'taller') {
      const url = req.nextUrl.clone();
      url.pathname = '/403';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Regla 2: Si es Taller, solo puede navegar en /taller/**, y quizá rutas públicas mínimas
  if (role === 'taller') {
    const isPublic = PUBLIC_PATHS.has(pathname);
    const allowed = isPublic || ALLOWED_FOR_TALLER_PREFIXES.some((p) => pathname.startsWith(p));
    if (!allowed) {
      const url = req.nextUrl.clone();
      url.pathname = '/taller';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|favicon|images|assets).*)',
  ],
};


