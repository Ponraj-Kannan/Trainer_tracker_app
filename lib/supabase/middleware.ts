// ============================================================
// Supabase Middleware Helper
// Refreshes auth session on every request
// ============================================================

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not write any logic between createServerClient and getUser().
  // A session refresh requires getUser() to be called to update the cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protected routes — redirect unauthenticated users to login
  const protectedPaths = ["/dashboard"];
  const isProtectedPath = protectedPaths.some((p) =>
    pathname.startsWith(p)
  );

  // Auth routes — redirect authenticated users to dashboard
  const authPaths = ["/login"];
  const isAuthPath = authPaths.some((p) => pathname.startsWith(p));

  if (isProtectedPath && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirected", "true");
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}
