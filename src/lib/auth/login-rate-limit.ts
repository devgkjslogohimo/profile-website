import "server-only"

import { createHash } from "node:crypto"

import { headers } from "next/headers"

import { prisma } from "@/lib/db/prisma"

const MAX_FAILURES = 5
const WINDOW_MS = 15 * 60 * 1000
const BLOCK_MS = 15 * 60 * 1000

function hashIdentifier(value: string): string {
  return createHash("sha256").update(value).digest("hex")
}

async function createLoginRateLimitKey(email: string): Promise<string> {
  const requestHeaders = await headers()

  const forwardedFor = requestHeaders.get("x-forwarded-for")
  const forwardedIp = forwardedFor?.split(",")[0]?.trim()
  const realIp = requestHeaders.get("x-real-ip")?.trim()

  const ip = forwardedIp || realIp || "unknown"

  return hashIdentifier(`${ip}|${email.toLowerCase()}`)
}

async function isLoginRateLimited(key: string): Promise<boolean> {
  const record = await prisma.loginRateLimit.findUnique({
    where: { key },
  })

  if (!record) {
    return false
  }

  const now = new Date()

  if (record.blockedUntil && record.blockedUntil > now) {
    return true
  }

  const windowExpired = record.windowStartedAt.getTime() + WINDOW_MS <= now.getTime()

  if (windowExpired) {
    await prisma.loginRateLimit.deleteMany({
      where: { key },
    })

    return false
  }

  return false
}

async function recordLoginFailure(key: string): Promise<void> {
  const now = new Date()

  const existing = await prisma.loginRateLimit.findUnique({
    where: { key },
  })

  if (!existing || existing.windowStartedAt.getTime() + WINDOW_MS <= now.getTime()) {
    await prisma.loginRateLimit.upsert({
      where: { key },
      create: {
        key,
        attempts: 1,
        windowStartedAt: now,
      },
      update: {
        attempts: 1,
        windowStartedAt: now,
        blockedUntil: null,
      },
    })

    return
  }

  const attempts = existing.attempts + 1

  await prisma.loginRateLimit.update({
    where: { key },
    data: {
      attempts,
      blockedUntil: attempts >= MAX_FAILURES ? new Date(now.getTime() + BLOCK_MS) : null,
    },
  })
}

async function clearLoginFailures(key: string): Promise<void> {
  await prisma.loginRateLimit.deleteMany({
    where: { key },
  })
}

export { clearLoginFailures, createLoginRateLimitKey, isLoginRateLimited, recordLoginFailure }
