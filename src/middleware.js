import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // ✅ Define pages you want to block direct access for
  const protectedPages = ["/error/429", "/error/500"];

  if (protectedPages.includes(pathname)) {
    const referer = request.headers.get("referer");

    // ✅ If there's no referer, it means direct access
    if (!referer) {
      return NextResponse.redirect(new URL("/", request.url)); // Redirect to home
    }
  }

  return NextResponse.next(); // Allow others
}
