"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
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

  updateTag(PUBLIC_CACHE_TAGS.churchLocations)
  revalidatePath("/lokasi", "layout")

  return {
    success: true,
    message: image.isActive
      ? `${image.caption || "Foto"} berhasil dinonaktifkan.`
      : `${image.caption || "Foto"} berhasil diaktifkan.`,
  }
}

export { toggleLocationImage }
