"use server"

import { redirect } from "next/navigation"

import {
  clearLoginFailures,
  createLoginRateLimitKey,
  isLoginRateLimited,
  recordLoginFailure,
} from "@/lib/auth/login-rate-limit"
import { hashPassword, verifyPassword } from "@/lib/auth/password"
import { createAdminSession } from "@/lib/auth/session"
import { prisma } from "@/lib/db/prisma"

import { loginSchema } from "../schemas/login-schema"

type LoginActionState = {
  error?: string
  fieldErrors?: {
    email?: string[]
    password?: string[]
  }
}

async function loginAction(
  _previousState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const email = parsed.data.email.toLowerCase()
  const password = parsed.data.password

  const rateLimitKey = await createLoginRateLimitKey(email)

  if (await isLoginRateLimited(rateLimitKey)) {
    return {
      error: "Terlalu banyak percobaan login. Coba kembali beberapa menit lagi.",
    }
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      passwordHash: true,
      isActive: true,
      sessionVersion: true,
    },
  })

  if (!user) {
    // Tetap jalankan scrypt agar jalur email yang tidak ditemukan
    // tidak jauh lebih murah dibanding verifikasi password normal.
    await hashPassword(password)
    await recordLoginFailure(rateLimitKey)

    return {
      error: "Email atau password tidak valid.",
    }
  }

  const passwordValid = await verifyPassword(password, user.passwordHash)

  if (!passwordValid || !user.isActive) {
    await recordLoginFailure(rateLimitKey)

    return {
      error: "Email atau password tidak valid.",
    }
  }

  await clearLoginFailures(rateLimitKey)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
    },
  })

  await createAdminSession({
    userId: user.id,
    sessionVersion: user.sessionVersion,
  })

  redirect("/admin")
}

export { loginAction }
export type { LoginActionState }
