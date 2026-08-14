"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

async function toggleGalleryImage(id: string) {
  await requirePermission("content.create")

  const image = await prisma.galleryImage.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      albumId: true,
      caption: true,
      isActive: true,
    },
  })

  if (!image) {
    return {
      success: false,
      message: "Foto galeri tidak ditemukan.",
    }
  }

  try {
    await prisma.galleryImage.update({
      where: {
        id,
      },
      data: {
        isActive: !image.isActive,
      },
    })
  } catch (error) {
    console.error("TOGGLE GALLERY IMAGE FAILED", error)

    return {
      success: false,
      message: "Status foto galeri gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/galeri")
  revalidatePath(`/admin/galeri/${image.albumId}`)
  revalidatePath(`/admin/galeri/${image.albumId}/foto/${id}/edit`)

  updateTag(PUBLIC_CACHE_TAGS.gallery)

  revalidatePath("/")
  revalidatePath("/galeri", "layout")

  const imageName = image.caption || "Foto"

  return {
    success: true,
    message: image.isActive
      ? `${imageName} berhasil dinonaktifkan.`
      : `${imageName} berhasil diaktifkan.`,
  }
}

export { toggleGalleryImage }
