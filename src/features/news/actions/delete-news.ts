"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { NewsDeleteActionResult } from "@/features/news/lib/news-delete-action-state"
import { canEditNews } from "@/features/news/lib/news-permissions"
import { prisma } from "@/lib/db/prisma"

async function deleteNews(id: string): Promise<NewsDeleteActionResult> {
  const currentUser = await requirePermission("content.edit.own")

  const news = await prisma.news.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      authorId: true,

      _count: {
        select: {
          images: true,
        },
      },
    },
  })

  if (!news) {
    return {
      status: "error",
      message: "Berita tidak ditemukan.",
    }
  }

  if (
    !canEditNews({
      role: currentUser.role,
      userId: currentUser.id,
      authorId: news.authorId,
    })
  ) {
    return {
      status: "error",
      message: "Anda tidak memiliki izin untuk menghapus berita ini.",
    }
  }

  /*
   * Berita Published harus di-Unpublish terlebih dahulu.
   */
  if (news.status === "PUBLISHED") {
    return {
      status: "error",
      message:
        "Berita yang sudah dipublikasikan tidak dapat langsung dihapus. Batalkan publikasi terlebih dahulu.",
    }
  }

  try {
    /*
     * NewsImage otomatis terhapus karena relation:
     *
     * news News @relation(
     *   fields: [newsId],
     *   references: [id],
     *   onDelete: Cascade
     * )
     *
     * Hanya record database yang dihapus.
     * File asli Google Drive tidak disentuh.
     */
    await prisma.news.delete({
      where: {
        id: news.id,
      },
    })
  } catch (error) {
    console.error("DELETE NEWS FAILED", error)

    return {
      status: "error",
      message: "Berita gagal dihapus. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/berita")
  revalidatePath("/berita")
  revalidatePath(`/berita/${news.slug}`)

  return {
    status: "success",
    message:
      news._count.images > 0
        ? `${news.title} dan ${news._count.images} foto dokumentasi berhasil dihapus dari sistem.`
        : `${news.title} berhasil dihapus dari sistem.`,
  }
}

export { deleteNews }
