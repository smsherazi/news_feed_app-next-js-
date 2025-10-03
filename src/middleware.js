import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // ✅ cookies access karne ke liye

export async function middleware(request) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // ✅ yeh pages direct open nahi hone chahiye
  const protectedPages = ["/error/429", "/error/500"];

  if (protectedPages.includes(pathname)) {
    const referer = request.headers.get("referer");

    if (!referer) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ✅ cookie check
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // agar banda logged in hai to login/signup access block karo
  if (["/login", "/signup"].includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // agar koi aise page pe gaya jaha login required hai aur token nahi hai
  const needAuthPages = ["/savednews"]; // 👈 apne pages yahan add karo
  if (needAuthPages.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
