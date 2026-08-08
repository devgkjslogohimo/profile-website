import "dotenv/config"

import { PrismaNeon } from "@prisma/adapter-neon"
import { z } from "zod"

import { PrismaClient } from "../src/generated/prisma/client"
import { hashPassword } from "../src/lib/auth/password"

const seedEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  SUPER_ADMIN_NAME: z.string().trim().min(2),
  SUPER_ADMIN_EMAIL: z.string().trim().email(),
  SUPER_ADMIN_PASSWORD: z.string().min(12),
})

const env = seedEnvSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  SUPER_ADMIN_NAME: process.env.SUPER_ADMIN_NAME,
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
})

const adapter = new PrismaNeon({
  connectionString: env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const email = env.SUPER_ADMIN_EMAIL.toLowerCase()

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.log("SUPER ADMIN: SKIPPED — user already exists")
    console.log(`EMAIL: ${existingUser.email}`)
    return
  }

  const passwordHash = await hashPassword(env.SUPER_ADMIN_PASSWORD)

  const user = await prisma.user.create({
    data: {
      name: env.SUPER_ADMIN_NAME,
      email,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  })

  console.log("SUPER ADMIN: CREATED")
  console.log(`ID: ${user.id}`)
  console.log(`NAME: ${user.name}`)
  console.log(`EMAIL: ${user.email}`)
  console.log(`ROLE: ${user.role}`)
}

main()
  .catch((error) => {
    console.error("SEED FAILED")
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
