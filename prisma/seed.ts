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

const churchLocations = [
  {
    name: "GKJ Slogohimo",
    slug: "gkj-slogohimo",
    type: "CHURCH" as const,
    sortOrder: 1,
  },
  {
    name: "Pepanthan Jatisrono",
    slug: "pepanthan-jatisrono",
    type: "PEPANTHAN" as const,
    sortOrder: 2,
  },
  {
    name: "Pepanthan Joho",
    slug: "pepanthan-joho",
    type: "PEPANTHAN" as const,
    sortOrder: 3,
  },
  {
    name: "Pepanthan Jatiroto",
    slug: "pepanthan-jatiroto",
    type: "PEPANTHAN" as const,
    sortOrder: 4,
  },
]

const worshipServiceRoles = [
  {
    name: "Pengkhotbah",
    sortOrder: 1,
  },
  {
    name: "Liturgos",
    sortOrder: 2,
  },
  {
    name: "Organis",
    sortOrder: 3,
  },
  {
    name: "Pemandu Pujian",
    sortOrder: 4,
  },
  {
    name: "Persembahan",
    sortOrder: 5,
  },
  {
    name: "Multimedia",
    sortOrder: 6,
  },
]

async function seedSuperAdmin() {
  const email = env.SUPER_ADMIN_EMAIL.toLowerCase()

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.log("SUPER ADMIN: SKIPPED— user already exists")
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

async function seedChurchLocations() {
  for (const location of churchLocations) {
    const result = await prisma.churchLocation.upsert({
      where: { slug: location.slug },
      update: {
        name: location.name,
        type: location.type,
        sortOrder: location.sortOrder,
        isActive: true,
      },
      create: {
        ...location,
        isActive: true,
      },
      select: {
        name: true,
        slug: true,
        type: true,
        sortOrder: true,
        isActive: true,
      },
    })

    console.log(
      `CHURCH LOCATION: ${result.sortOrder} | ${result.name} | ${result.type} | ${result.slug} | active=${result.isActive}`
    )
  }
}

async function seedWorshipServiceRoles() {
  for (const role of worshipServiceRoles) {
    const result = await prisma.worshipServiceRole.upsert({
      where: {
        name: role.name,
      },
      update: {
        sortOrder: role.sortOrder,
        isActive: true,
      },
      create: {
        name: role.name,
        sortOrder: role.sortOrder,
        isActive: true,
      },
      select: {
        name: true,
        sortOrder: true,
        isActive: true,
      },
    })

    console.log(
      `WORSHIP SERVICE ROLE: ${result.sortOrder} | ${result.name} | active=${result.isActive}`
    )
  }
}

async function main() {
  await seedSuperAdmin()
  await seedChurchLocations()
  await seedWorshipServiceRoles()
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
