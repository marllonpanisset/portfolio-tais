import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabasePublishableKey) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = data?.claims != null;

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    const { data: isSiteOwner, error } = await supabase.rpc("is_site_owner");
    if (error || isSiteOwner !== true) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isLoginRoute && isAuthenticated) {
    const { data: isSiteOwner, error } = await supabase.rpc("is_site_owner");
    return NextResponse.redirect(
      new URL(error || isSiteOwner !== true ? "/" : "/admin", request.url),
    );
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
