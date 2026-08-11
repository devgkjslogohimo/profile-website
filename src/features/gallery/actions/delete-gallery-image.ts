"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function deleteGalleryImage(id: string) {
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

  if (image.isActive) {
    return {
      success: false,
      message: "Nonaktifkan foto galeri terlebih dahulu sebelum menghapus.",
    }
  }

  try {
    await prisma.galleryImage.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    console.error("DELETE GALLERY IMAGE FAILED", error)

    return {
      success: false,
      message: "Foto galeri gagal dihapus. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/galeri")
  revalidatePath(`/admin/galeri/${image.albumId}`)

  return {
    success: true,
    message: image.caption ? `${image.caption} berhasil dihapus.` : "Foto galeri berhasil dihapus.",
  }
}

export { deleteGalleryImage }
