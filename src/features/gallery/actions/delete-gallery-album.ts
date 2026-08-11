"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function deleteGalleryAlbum(id: string) {
  await requirePermission("content.create")

  const album = await prisma.galleryAlbum.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      isActive: true,
      _count: {
        select: {
          images: true,
        },
      },
    },
  })

  if (!album) {
    return {
      success: false,
      message: "Album galeri tidak ditemukan.",
    }
  }

  if (album.isActive) {
    return {
      success: false,
      message: "Nonaktifkan album galeri terlebih dahulu sebelum menghapus.",
    }
  }

  if (album._count.images > 0) {
    return {
      success: false,
      message: "Album galeri tidak dapat dihapus karena masih memiliki foto.",
    }
  }

  try {
    await prisma.galleryAlbum.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    console.error("DELETE GALLERY ALBUM FAILED", error)

    return {
      success: false,
      message: "Album galeri gagal dihapus. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/galeri")

  return {
    success: true,
    message: `${album.title} berhasil dihapus.`,
  }
}

export { deleteGalleryAlbum }
