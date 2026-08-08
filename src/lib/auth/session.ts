import "server-only"

import { getIronSession, type SessionOptions } from "iron-session"
import { cookies } from "next/headers"

import { env } from "@/lib/env/server"

import { ADMIN_SESSION_COOKIE_NAME } from "./session-constants"
import type { AdminSessionData } from "./session-types"

const SESSION_TTL_SECONDS = 60 * 60 * 12

const sessionOptions = {
  password: env.SESSION_PASSWORD,
  cookieName: ADMIN_SESSION_COOKIE_NAME,
  ttl: SESSION_TTL_SECONDS,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  },
} satisfies SessionOptions

async function getAdminSession() {
  const cookieStore = await cookies()

  return getIronSession<AdminSessionData>(cookieStore, sessionOptions)
}

async function createAdminSession(input: { userId: string; sessionVersion: number }) {
  const session = await getAdminSession()

  session.userId = input.userId
  session.sessionVersion = input.sessionVersion
  session.isLoggedIn = true

  await session.save()
}

async function destroyAdminSession() {
  const session = await getAdminSession()
  session.destroy()
}

export { createAdminSession, destroyAdminSession, getAdminSession, sessionOptions }
