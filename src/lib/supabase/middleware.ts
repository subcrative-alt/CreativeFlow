import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const isAuthPage = url.pathname.startsWith("/login") || url.pathname.startsWith("/forgot-password");

  // If not logged in and accessing protected routes
  if (!user && (url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/my-dashboard") || url.pathname.startsWith("/projects") || url.pathname.startsWith("/tasks") || url.pathname.startsWith("/team"))) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If logged in and on auth pages
  if (user && isAuthPage) {
    // Check role in profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "creative_head") {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    } else {
      url.pathname = "/my-dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
