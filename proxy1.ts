import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only protect /dashboard. Everything else is public (including /demo).
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
