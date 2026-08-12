"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  getUserCreateFieldErrors,
  type UserCreateActionState,
} from "@/features/users/lib/user-action-state"
import { userCreateFormSchema } from "@/features/users/schemas/user-schema"
import { hashPassword } from "@/lib/auth/password"
import { prisma } from "@/lib/db/prisma"

async function createUser(
  previousState: UserCreateActionState,
  formData: FormData
): Promise<UserCreateActionState> {
  await requirePermission("users.manage")

  const parsed = userCreateFormSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    role: String(formData.get("role") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data pengguna.",
      fieldErrors: getUserCreateFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const email = parsed.data.email.toLowerCase()

  const existingUser = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
    },
  })

  if (existingUser) {
    return {
      status: "error",
      message: "Periksa kembali data pengguna.",
      fieldErrors: {
        email: ["Email tersebut sudah digunakan oleh pengguna lain."],
      },
      submissionId: previousState.submissionId,
    }
  }

  let passwordHash: string

  try {
    passwordHash = await hashPassword(parsed.data.password)
  } catch (error) {
    console.error("HASH USER PASSWORD FAILED", error)

    return {
      status: "error",
      message: "Password pengguna gagal diproses. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  try {
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        passwordHash,
        role: parsed.data.role,
        isActive: true,
      },
    })
  } catch (error) {
    console.error("CREATE USER FAILED", error)

    return {
      status: "error",
      message: "Pengguna gagal ditambahkan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/pengguna")

  return {
    status: "success",
    message: `${parsed.data.name} berhasil ditambahkan.`,
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createUser }
