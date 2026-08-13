"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function toggleLocationImage(id: string) {
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

  await prisma.churchLocationImage.update({
    where: {
      id: image.id,
    },
    data: {
      isActive: !image.isActive,
    },
  })

  revalidatePath(`/admin/lokasi/${image.churchLocationId}/edit`)

  return {
    success: true,
    message: image.isActive
      ? `${image.caption || "Foto"} berhasil dinonaktifkan.`
      : `${image.caption || "Foto"} berhasil diaktifkan.`,
  }
}

export { toggleLocationImage }
