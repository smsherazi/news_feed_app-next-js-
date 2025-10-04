import { NextResponse } from "next/server";

export async function middleware(request) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  const referer = request.headers.get("referer");

  // Block direct access to verifyemail
  if (pathname === "/verifyemail" && !referer) {
    url.pathname = "/showToast";
    url.searchParams.set("message", "Please start the forget password process from Login.");
    return NextResponse.redirect(url);
  }

  // Block direct access to newpassword
  if (pathname === "/newpassword" && !referer) {
    url.pathname = "/showToast";
    url.searchParams.set("message", "You must verify your email first to reset your password from forget password.");
    return NextResponse.redirect(url);
  }

  const token = request.cookies.get("token")?.value;
  if (["/login", "/signup"].includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
