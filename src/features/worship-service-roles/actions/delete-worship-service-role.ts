"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { DeleteWorshipServiceRoleActionState } from "@/features/worship-service-roles/lib/delete-action-state"
import { prisma } from "@/lib/db/prisma"

function isForeignKeyConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2003"
}

async function deleteWorshipServiceRole(id: string): Promise<DeleteWorshipServiceRoleActionState> {
  await requirePermission("church.manage")

  const role = await prisma.worshipServiceRole.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
  })

  if (!role) {
    return {
      status: "error",
      message: "Peran petugas tidak ditemukan.",
    }
  }

  if (role.isActive) {
    return {
      status: "error",
      message: "Peran petugas masih aktif. Nonaktifkan peran terlebih dahulu sebelum menghapus.",
    }
  }

  try {
    await prisma.worshipServiceRole.delete({
      where: {
        id: role.id,
      },
    })
  } catch (error) {
    if (isForeignKeyConstraintError(error)) {
      return {
        status: "error",
        message:
          "Peran petugas tidak dapat dihapus karena sudah digunakan pada jadwal ibadah. Gunakan status Nonaktif jika peran tidak ingin digunakan lagi.",
      }
    }

    console.error("DELETE WORSHIP SERVICE ROLE FAILED", error)

    return {
      status: "error",
      message: "Peran petugas gagal dihapus. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/peran-petugas-ibadah")

  return {
    status: "success",
    message: `${role.name} berhasil dihapus.`,
  }
}

export { deleteWorshipServiceRole }
