import "server-only"

import { z } from "zod"

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  SESSION_PASSWORD: z.string().min(32),
  ADMIN_LOGIN_TOKEN: z
    .string()
    .min(24)
    .regex(/^[A-Za-z0-9_-]+$/),
})

const parsed = serverEnvSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  SESSION_PASSWORD: process.env.SESSION_PASSWORD,
  ADMIN_LOGIN_TOKEN: process.env.ADMIN_LOGIN_TOKEN,
})

if (!parsed.success) {
  console.error("Invalid server environment variables:", parsed.error.flatten().fieldErrors)
  throw new Error("Invalid server environment variables")
}

const env = parsed.data

export { env }
