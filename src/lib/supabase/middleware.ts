import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const url = request.nextUrl.clone();

  // All legacy routes are redirected to the unified Swapon's World hub at "/"
  const legacyRoutes = [
    "/login",
    "/forgot-password",
    "/dashboard",
    "/my-dashboard",
    "/projects",
    "/tasks",
    "/team",
    "/approvals",
    "/calendar",
    "/settings",
    "/reports",
    "/video-editing",
    "/photography",
    "/profile",
    "/checkin",
    "/checkins",
  ];

  if (legacyRoutes.some((route) => url.pathname.startsWith(route))) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}
