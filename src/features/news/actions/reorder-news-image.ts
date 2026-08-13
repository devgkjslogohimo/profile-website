"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { canEditNews } from "@/features/news/lib/news-permissions"
import { prisma } from "@/lib/db/prisma"

type ReorderDirection = "up" | "down"

async function reorderNewsImage(id: string, direction: ReorderDirection) {
  const currentUser = await requirePermission("content.edit.own")

  const image = await prisma.newsImage.findUnique({
    where: {
      id,
    },

    include: {
      news: {
        select: {
          id: true,
          slug: true,
          authorId: true,
        },
      },
    },
  })

  if (!image) {
    return {
      success: false,
      message: "Foto berita tidak ditemukan.",
    }
  }

  if (
    !canEditNews({
      role: currentUser.role,
      userId: currentUser.id,
      authorId: image.news.authorId,
    })
  ) {
    return {
      success: false,
      message: "Anda tidak memiliki izin untuk mengubah urutan foto berita ini.",
    }
  }

  const neighbor =
    direction === "up"
      ? await prisma.newsImage.findFirst({
          where: {
            newsId: image.newsId,

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
      : await prisma.newsImage.findFirst({
          where: {
            newsId: image.newsId,

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
      prisma.newsImage.update({
        where: {
          id: image.id,
        },

        data: {
          sortOrder: neighbor.sortOrder,
        },
      }),

      prisma.newsImage.update({
        where: {
          id: neighbor.id,
        },

        data: {
          sortOrder: image.sortOrder,
        },
      }),
    ])
  } catch (error) {
    console.error("REORDER NEWS IMAGE FAILED", error)

    return {
      success: false,
      message: "Urutan foto gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath(`/admin/berita/${image.newsId}/edit`)

  revalidatePath(`/berita/${image.news.slug}`)

  return {
    success: true,
    message: "Urutan foto berhasil diperbarui.",
  }
}

export { reorderNewsImage }
