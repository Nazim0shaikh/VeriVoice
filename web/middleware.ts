import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const WINDOW_MS = 60 * 1000 * 60; // 1 hour
const MAX_REQUESTS = 5;

export function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next();

    // 1. Rate Limiting for submissions
    if (request.nextUrl.pathname.includes('/api/complaints/submit')) {
      const ip = request.ip || request.headers.get('x-forwarded-for') || 'default-ip';
      
      const now = Date.now();
      const windowStart = now - WINDOW_MS;
      
      let rateLimitData = rateLimitMap.get(ip);
      
      if (!rateLimitData || rateLimitData.lastReset < windowStart) {
        rateLimitData = { count: 0, lastReset: now };
      }
      
      rateLimitData.count++;
      rateLimitMap.set(ip, rateLimitData);

      if (rateLimitData.count > MAX_REQUESTS) {
        const retryAfter = Math.max(1, Math.ceil((rateLimitData.lastReset + WINDOW_MS - now) / 1000));
        return new NextResponse(
          JSON.stringify({ error: 'Please wait before submitting another complaint.' }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(retryAfter),
            },
          }
        );
      }
    }

    // 2. Security headers
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Content-Type-Options', 'nosniff');

    return response;
  } catch (error) {
    console.error('Middleware Error:', error);
    return NextResponse.next(); // Fail open, never break the site
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
