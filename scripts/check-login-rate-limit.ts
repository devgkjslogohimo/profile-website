import "dotenv/config"

import { PrismaNeon } from "@prisma/adapter-neon"

import { PrismaClient } from "../src/generated/prisma/client"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL belum tersedia")
}

const adapter = new PrismaNeon({
  connectionString: databaseUrl,
})

const prisma = new PrismaClient({ adapter })

const key = "automated-login-rate-limit-test"

try {
  await prisma.loginRateLimit.deleteMany({
    where: { key },
  })

  await prisma.loginRateLimit.create({
    data: {
      key,
      attempts: 5,
      blockedUntil: new Date(Date.now() + 60_000),
    },
  })

  const record = await prisma.loginRateLimit.findUnique({
    where: { key },
  })

  const valid =
    record?.attempts === 5 && Boolean(record.blockedUntil && record.blockedUntil > new Date())

  console.log("RATE LIMIT TABLE:", record ? "OK" : "FAIL")
  console.log("FAILED ATTEMPTS:", record?.attempts === 5 ? "OK" : "FAIL")
  console.log("BLOCK STATE:", valid ? "OK" : "FAIL")

  if (!valid) {
    process.exitCode = 1
  }
} finally {
  await prisma.loginRateLimit.deleteMany({
    where: { key },
  })

  await prisma.$disconnect()
}
