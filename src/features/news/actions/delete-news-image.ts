"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { canEditNews } from "@/features/news/lib/news-permissions"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

type DeleteNewsImageResult = {
  success: boolean
  message: string
}

async function deleteNewsImage(id: string): Promise<DeleteNewsImageResult> {
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
      message: "Anda tidak memiliki izin untuk menghapus foto berita ini.",
    }
  }

  try {
    await prisma.newsImage.delete({
      where: {
        id: image.id,
      },
    })
  } catch (error) {
    console.error("DELETE NEWS IMAGE FAILED", error)

    return {
      success: false,
      message: "Foto berita gagal dihapus. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/berita")
  revalidatePath(`/admin/berita/${image.newsId}/edit`)

  updateTag(PUBLIC_CACHE_TAGS.news)

  revalidatePath(`/berita/${image.news.slug}`)

  return {
    success: true,
    message: image.caption
      ? `${image.caption} berhasil dihapus.`
      : "Foto dokumentasi berhasil dihapus.",
  }
}

export { deleteNewsImage }
