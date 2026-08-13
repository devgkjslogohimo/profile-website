"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function deleteLocationImage(id: string) {
  await requirePermission("church.manage")

  const image = await prisma.churchLocationImage.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      churchLocationId: true,
      caption: true,
      isActive: true,
    },
  })

  if (!image) {
    return {
      success: false,
      message: "Foto lokasi tidak ditemukan.",
    }
  }

  if (image.isActive) {
    return {
      success: false,
      message: "Nonaktifkan foto terlebih dahulu sebelum menghapus.",
    }
  }

  await prisma.churchLocationImage.delete({
    where: {
      id: image.id,
    },
  })

  revalidatePath(`/admin/lokasi/${image.churchLocationId}/edit`)

  return {
    success: true,
    message: image.caption ? `${image.caption} berhasil dihapus.` : "Foto lokasi berhasil dihapus.",
  }
}

export { deleteLocationImage }
