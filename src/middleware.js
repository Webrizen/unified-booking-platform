import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
const allowedOrigins = ['https://unified-booking-platform.vercel.app', 'http://localhost:3000', 'https://unify-book.vercel.app']
 
const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
   // Check the origin from the request
  const origin = request.headers.get('origin') ?? ''
  const isAllowedOrigin = allowedOrigins.includes(origin)
if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  
  const token = request.cookies.get('token')?.value;

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
