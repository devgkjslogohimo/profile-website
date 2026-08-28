import { type NextRequest, NextResponse } from "next/server"

import { ADMIN_SESSION_COOKIE_NAME } from "@/lib/auth/session-constants"

function proxy(request: NextRequest) {
  const hasSessionCookie = request.cookies.has(ADMIN_SESSION_COOKIE_NAME)

  if (!hasSessionCookie) {
    return new NextResponse("Not Found", {
      status: 404,
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

export { proxy }
