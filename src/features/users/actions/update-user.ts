"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  getUserUpdateFieldErrors,
  type UserUpdateActionState,
} from "@/features/users/lib/user-action-state"
import { userUpdateFormSchema } from "@/features/users/schemas/user-schema"
import { prisma } from "@/lib/db/prisma"

async function updateUser(
  id: string,
  previousState: UserUpdateActionState,
  formData: FormData
): Promise<UserUpdateActionState> {
  const currentUser = await requirePermission("users.manage")

  const existingUser = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  })

  if (!existingUser) {
    return {
      status: "error",
      message: "Pengguna tidak ditemukan.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  const parsed = userUpdateFormSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    role: String(formData.get("role") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data pengguna.",
      fieldErrors: getUserUpdateFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const email = parsed.data.email.toLowerCase()

  const duplicateUser = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
      NOT: {
        id,
      },
    },
    select: {
      id: true,
    },
  })

  if (duplicateUser) {
    return {
      status: "error",
      message: "Periksa kembali data pengguna.",
      fieldErrors: {
        email: ["Email tersebut sudah digunakan oleh pengguna lain."],
      },
      submissionId: previousState.submissionId,
    }
  }

  const roleChanged = existingUser.role !== parsed.data.role

  if (currentUser.id === existingUser.id && roleChanged) {
    return {
      status: "error",
      message: "Peran akun yang sedang digunakan tidak dapat diubah.",
      fieldErrors: {
        role: ["Anda tidak dapat mengubah peran akun sendiri."],
      },
      submissionId: previousState.submissionId,
    }
  }

  const removesActiveSuperAdmin =
    existingUser.isActive &&
    existingUser.role === "SUPER_ADMIN" &&
    parsed.data.role !== "SUPER_ADMIN"

  if (removesActiveSuperAdmin) {
    const otherActiveSuperAdminCount = await prisma.user.count({
      where: {
        id: {
          not: existingUser.id,
        },
        role: "SUPER_ADMIN",
        isActive: true,
      },
    })

    if (otherActiveSuperAdminCount === 0) {
      return {
        status: "error",
        message: "Peran pengguna tidak dapat diubah.",
        fieldErrors: {
          role: ["Sistem harus memiliki minimal satu Super Admin aktif."],
        },
        submissionId: previousState.submissionId,
      }
    }
  }

  try {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        name: parsed.data.name,
        email,
        role: parsed.data.role,
      },
    })
  } catch (error) {
    console.error("UPDATE USER FAILED", error)

    return {
      status: "error",
      message: "Perubahan pengguna gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/pengguna")
  revalidatePath(`/admin/pengguna/${id}/edit`)

  return {
    status: "success",
    message: `Perubahan ${parsed.data.name} berhasil disimpan.`,
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { updateUser }
