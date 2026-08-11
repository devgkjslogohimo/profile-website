"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function deleteChurchPastor(id: string) {
  await requirePermission("church.manage")

  const pastor = await prisma.churchPastor.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      fullName: true,
      isActive: true,
    },
  })

  if (!pastor) {
    return {
      success: false,
      message: "Pendeta tidak ditemukan.",
    }
  }

  if (pastor.isActive) {
    return {
      success: false,
      message: "Nonaktifkan data pendeta terlebih dahulu sebelum menghapus.",
    }
  }

  try {
    await prisma.churchPastor.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    console.error("DELETE CHURCH PASTOR FAILED", error)

    return {
      success: false,
      message: "Pendeta gagal dihapus. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/pendeta")

  return {
    success: true,
    message: `${pastor.fullName} berhasil dihapus.`,
  }
}

export { deleteChurchPastor }
