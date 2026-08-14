"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

type ReorderDirection = "up" | "down"

async function reorderGalleryAlbum(id: string, direction: ReorderDirection) {
  await requirePermission("content.create")

  const album = await prisma.galleryAlbum.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      sortOrder: true,
    },
  })

  if (!album) {
    return {
      success: false,
      message: "Album galeri tidak ditemukan.",
    }
  }

  const neighbor =
    direction === "up"
      ? await prisma.galleryAlbum.findFirst({
          where: {
            sortOrder: {
              lt: album.sortOrder,
            },
          },
          orderBy: {
            sortOrder: "desc",
          },
          select: {
            id: true,
            sortOrder: true,
          },
        })
      : await prisma.galleryAlbum.findFirst({
          where: {
            sortOrder: {
              gt: album.sortOrder,
            },
          },
          orderBy: {
            sortOrder: "asc",
          },
          select: {
            id: true,
            sortOrder: true,
          },
        })

  if (!neighbor) {
    return {
      success: false,
      message:
        direction === "up"
          ? "Album sudah berada di urutan paling atas."
          : "Album sudah berada di urutan paling bawah.",
    }
  }

  try {
    await prisma.$transaction([
      prisma.galleryAlbum.update({
        where: {
          id: album.id,
        },
        data: {
          sortOrder: neighbor.sortOrder,
        },
      }),

      prisma.galleryAlbum.update({
        where: {
          id: neighbor.id,
        },
        data: {
          sortOrder: album.sortOrder,
        },
      }),
    ])
  } catch (error) {
    console.error("REORDER GALLERY ALBUM FAILED", error)

    return {
      success: false,
      message: "Urutan album galeri gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/galeri")

  updateTag(PUBLIC_CACHE_TAGS.gallery)

  revalidatePath("/")
  revalidatePath("/galeri", "layout")

  return {
    success: true,
    message: "Urutan album galeri berhasil diperbarui.",
  }
}

export { reorderGalleryAlbum }
