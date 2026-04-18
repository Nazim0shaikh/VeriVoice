import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting map.
// Note: In production with multiple instances/edge deployments,
// use Redis (e.g., Upstash) instead of an in-memory map.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // Max requests per window per IP

export function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Ignore internal or Vercel specific checks
    if (ip === '127.0.0.1' && process.env.NODE_ENV === 'development') {
        return NextResponse.next();
    }

    const now = Date.now();
    const windowStart = now - WINDOW_MS;

    const rateLimitData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    // Reset window
    if (rateLimitData.lastReset < windowStart) {
      rateLimitData.count = 0;
      rateLimitData.lastReset = now;
    }

    rateLimitData.count++;
    rateLimitMap.set(ip, rateLimitData);

    if (rateLimitData.count > MAX_REQUESTS) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((rateLimitData.lastReset + WINDOW_MS - now) / 1000).toString(),
          },
        }
      );
    }
  }

  // Add security headers across the app
  const response = NextResponse.next();
  
  // Strict Transport Security
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  // XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  // MIME type sniffing prevention
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
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
};