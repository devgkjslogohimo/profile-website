"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { NewsPublicationActionResult } from "@/features/news/lib/news-publication-action-state"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

async function unpublishNews(id: string): Promise<NewsPublicationActionResult> {
  await requirePermission("content.publish")

  const news = await prisma.news.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      slug: true,
      status: true,
    },
  })

  if (!news) {
    return {
      status: "error",
      message: "Berita tidak ditemukan.",
    }
  }

  if (news.status === "DRAFT") {
    return {
      status: "success",
      message: "Berita sudah berstatus Draft.",
    }
  }

  try {
    await prisma.news.update({
      where: {
        id,
      },

      data: {
        status: "DRAFT",
        publishedAt: null,
      },
    })
  } catch (error) {
    console.error("UNPUBLISH NEWS FAILED", error)

    return {
      status: "error",
      message: "Publikasi berita gagal dibatalkan. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/berita")
  revalidatePath(`/admin/berita/${id}/edit`)

  updateTag(PUBLIC_CACHE_TAGS.news)

  revalidatePath("/")
  revalidatePath("/berita")
  revalidatePath(`/berita/${news.slug}`)

  return {
    status: "success",
    message: "Berita dikembalikan menjadi Draft.",
  }
}

export { unpublishNews }
