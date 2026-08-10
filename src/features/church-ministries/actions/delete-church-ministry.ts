"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { DeleteChurchMinistryActionState } from "@/features/church-ministries/lib/delete-action-state"
import { prisma } from "@/lib/db/prisma"

async function deleteChurchMinistry(id: string): Promise<DeleteChurchMinistryActionState> {
  await requirePermission("church.manage")

  const ministry = await prisma.churchMinistry.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
  })

  if (!ministry) {
    return {
      status: "error",
      message: "Pelayanan tidak ditemukan.",
    }
  }

  if (ministry.isActive) {
    return {
      status: "error",
      message: "Pelayanan masih aktif. Nonaktifkan terlebih dahulu sebelum menghapus.",
    }
  }

  try {
    await prisma.churchMinistry.delete({
      where: {
        id: ministry.id,
      },
    })
  } catch (error) {
    console.error("DELETE CHURCH MINISTRY FAILED", error)

    return {
      status: "error",
      message: "Pelayanan gagal dihapus. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/pelayanan")

  return {
    status: "success",
    message: `${ministry.name} berhasil dihapus.`,
  }
}

export { deleteChurchMinistry }
