"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  getResetPasswordFieldErrors,
  type ResetPasswordActionState,
} from "@/features/users/lib/reset-password-action-state"
import { resetUserPasswordSchema } from "@/features/users/schemas/reset-user-password-schema"
import { hashPassword } from "@/lib/auth/password"
import { destroyAdminSession } from "@/lib/auth/session"
import { prisma } from "@/lib/db/prisma"

async function resetUserPassword(
  id: string,
  previousState: ResetPasswordActionState,
  formData: FormData
): Promise<ResetPasswordActionState> {
  const currentUser = await requirePermission("users.manage")

  const parsed = resetUserPasswordSchema.safeParse({
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali password baru.",
      fieldErrors: getResetPasswordFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
    },
  })

  if (!targetUser) {
    return {
      status: "error",
      message: "Pengguna tidak ditemukan.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  let passwordHash: string

  try {
    passwordHash = await hashPassword(parsed.data.password)
  } catch (error) {
    console.error("HASH RESET USER PASSWORD FAILED", error)

    return {
      status: "error",
      message: "Password baru gagal diproses. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  try {
    await prisma.user.update({
      where: {
        id: targetUser.id,
      },
      data: {
        passwordHash,

        /*
         * Semua session existing menyimpan sessionVersion lama.
         * Increment membuat seluruh session lama tidak valid lagi.
         */
        sessionVersion: {
          increment: 1,
        },
      },
    })
  } catch (error) {
    console.error("RESET USER PASSWORD FAILED", error)

    return {
      status: "error",
      message: "Password pengguna gagal direset. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/pengguna")
  revalidatePath(`/admin/pengguna/${id}/edit`)

  /*
   * Jika Super Admin mereset password akun yang sedang dipakai,
   * hapus cookie session saat ini juga.
   */
  if (currentUser.id === targetUser.id) {
    await destroyAdminSession()
  }

  return {
    status: "success",
    message:
      currentUser.id === targetUser.id
        ? "Password akun anda berhasil diubah. Silakan login kembali."
        : `Password ${targetUser.name} berhasil direset dan seluruh sesi lamanya telah dicabut.`,
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { resetUserPassword }
