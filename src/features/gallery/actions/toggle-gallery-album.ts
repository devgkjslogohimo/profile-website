"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

async function toggleGalleryAlbum(id: string) {
  await requirePermission("content.create")

  const album = await prisma.galleryAlbum.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      isActive: true,
    },
  })

  if (!album) {
    return {
      success: false,
      message: "Album galeri tidak ditemukan.",
    }
  }

  try {
    await prisma.galleryAlbum.update({
      where: {
        id,
      },
      data: {
        isActive: !album.isActive,
      },
    })
  } catch (error) {
    console.error("TOGGLE GALLERY ALBUM FAILED", error)

    return {
      success: false,
      message: "Status album galeri gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/galeri")
  revalidatePath(`/admin/galeri/${id}`)
  revalidatePath(`/admin/galeri/${id}/edit`)

  updateTag(PUBLIC_CACHE_TAGS.gallery)

  revalidatePath("/")
  revalidatePath("/galeri", "layout")

  return {
    success: true,
    message: album.isActive
      ? `${album.title} berhasil dinonaktifkan.`
      : `${album.title} berhasil diaktifkan.`,
  }
}

export { toggleGalleryAlbum }
