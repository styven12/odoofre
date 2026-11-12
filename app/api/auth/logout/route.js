import { NextResponse } from 'next/server';

export async function GET(req) {
  const response = NextResponse.redirect(new URL('/login', req.url));
  response.cookies.set('session', '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 });
  return response;
}
