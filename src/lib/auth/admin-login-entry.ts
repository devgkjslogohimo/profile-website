import "server-only"

import { timingSafeEqual } from "node:crypto"

import { env } from "@/lib/env/server"

const ADMIN_LOGIN_ROUTE_PREFIX = "/pengelola"

function getAdminLoginPath() {
  return `${ADMIN_LOGIN_ROUTE_PREFIX}/${env.ADMIN_LOGIN_TOKEN}`
}

function isValidAdminLoginToken(token: string) {
  const expected = Buffer.from(env.ADMIN_LOGIN_TOKEN)
  const candidate = Buffer.from(token)

  if (expected.length !== candidate.length) {
    return false
  }

  return timingSafeEqual(expected, candidate)
}

export { ADMIN_LOGIN_ROUTE_PREFIX, getAdminLoginPath, isValidAdminLoginToken }
