import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "@/lib/auth/auth";
import { NextResponse, type NextRequest } from "next/request";

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

  try {
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!session && isProtectedRoute) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathName);
      return NextResponse.redirect(loginUrl);
    }

    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If auth fetch fails, assume no session
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
