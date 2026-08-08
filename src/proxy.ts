import { type NextRequest, NextResponse } from "next/server"

import { ADMIN_SESSION_COOKIE_NAME } from "@/lib/auth/session-constants"

function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isLoginPage = pathname === "/admin/login"
  const hasSessionCookie = request.cookies.has(ADMIN_SESSION_COOKIE_NAME)

  if (!isLoginPage && !hasSessionCookie) {
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("next", pathname)

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

export { proxy }
