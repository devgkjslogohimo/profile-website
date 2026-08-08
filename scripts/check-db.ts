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

try {
  const [userCount, superAdminCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        role: "SUPER_ADMIN",
        isActive: true,
      },
    }),
  ])

  console.log("DATABASE CONNECTION: OK")
  console.log(`USER COUNT: ${userCount}`)
  console.log(`ACTIVE SUPER ADMIN COUNT: ${superAdminCount}`)
} finally {
  await prisma.$disconnect()
}
