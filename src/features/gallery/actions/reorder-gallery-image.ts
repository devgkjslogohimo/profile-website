"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

type ReorderDirection = "up" | "down"

async function reorderGalleryImage(id: string, direction: ReorderDirection) {
  await requirePermission("content.create")

  const image = await prisma.galleryImage.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      albumId: true,
      sortOrder: true,
    },
  })

  if (!image) {
    return {
      success: false,
      message: "Foto galeri tidak ditemukan.",
    }
  }

  const neighbor =
    direction === "up"
      ? await prisma.galleryImage.findFirst({
          where: {
            albumId: image.albumId,
            sortOrder: {
              lt: image.sortOrder,
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
      : await prisma.galleryImage.findFirst({
          where: {
            albumId: image.albumId,
            sortOrder: {
              gt: image.sortOrder,
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
          ? "Foto sudah berada di urutan paling atas."
          : "Foto sudah berada di urutan paling bawah.",
    }
  }

  try {
    await prisma.$transaction([
      prisma.galleryImage.update({
        where: {
          id: image.id,
        },
        data: {
          sortOrder: neighbor.sortOrder,
        },
      }),

      prisma.galleryImage.update({
        where: {
          id: neighbor.id,
        },
        data: {
          sortOrder: image.sortOrder,
        },
      }),
    ])
  } catch (error) {
    console.error("REORDER GALLERY IMAGE FAILED", error)

    return {
      success: false,
      message: "Urutan foto galeri gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/galeri")
  revalidatePath(`/admin/galeri/${image.albumId}`)

  return {
    success: true,
    message: "Urutan foto galeri berhasil diperbarui.",
  }
}

export { reorderGalleryImage }
