"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

type ReorderLocationImageDirection = "up" | "down"

async function reorderLocationImage(id: string, direction: ReorderLocationImageDirection) {
  await requirePermission("church.manage")

  const image = await prisma.churchLocationImage.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      churchLocationId: true,
      sortOrder: true,
    },
  })

  if (!image) {
    return {
      success: false,
      message: "Foto lokasi tidak ditemukan.",
    }
  }

  const neighbor =
    direction === "up"
      ? await prisma.churchLocationImage.findFirst({
          where: {
            churchLocationId: image.churchLocationId,
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
      : await prisma.churchLocationImage.findFirst({
          where: {
            churchLocationId: image.churchLocationId,
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

  await prisma.$transaction([
    prisma.churchLocationImage.update({
      where: {
        id: image.id,
      },
      data: {
        sortOrder: neighbor.sortOrder,
      },
    }),

    prisma.churchLocationImage.update({
      where: {
        id: neighbor.id,
      },
      data: {
        sortOrder: image.sortOrder,
      },
    }),
  ])

  revalidatePath(`/admin/lokasi/${image.churchLocationId}/edit`)

  updateTag(PUBLIC_CACHE_TAGS.churchLocations)
  revalidatePath("/lokasi", "layout")

  return {
    success: true,
    message: "Urutan foto lokasi berhasil diperbarui.",
  }
}

export { reorderLocationImage }

export type { ReorderLocationImageDirection }
