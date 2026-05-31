import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/boards", "/settings"];
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathName.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathName.startsWith(route));

  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // FAST PATH: Instead of making a 13-second HTTP request back to ourselves,
  // we simply check if the session cookie exists. 
  // Real security verification happens in the page/action components.
  const allCookies = request.cookies.getAll();
  const hasSession = allCookies.some((cookie) => 
    cookie.name.includes("session_token")
  );

  if (!hasSession && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathName);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Narrow matcher to only run on actual pages to prevent unnecessary middleware executions
  // Ignores all static files, api routes, next internals, trpc, etc.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
