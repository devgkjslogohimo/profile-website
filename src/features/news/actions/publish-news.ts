"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { NewsPublicationActionResult } from "@/features/news/lib/news-publication-action-state"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"
import { isRichTextContent, isRichTextEmpty } from "@/lib/rich-text"

async function publishNews(id: string): Promise<NewsPublicationActionResult> {
  await requirePermission("content.publish")

  const news = await prisma.news.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      coverImageUrl: true,
      coverImageFileId: true,
      status: true,
    },
  })

  if (!news) {
    return {
      status: "error",
      message: "Berita tidak ditemukan.",
    }
  }

  if (news.status === "PUBLISHED") {
    return {
      status: "success",
      message: "Berita sudah berstatus Published.",
    }
  }

  if (!news.title.trim()) {
    return {
      status: "error",
      message: "Berita belum dapat dipublikasikan karena judul belum tersedia.",
    }
  }

  if (!news.excerpt.trim()) {
    return {
      status: "error",
      message: "Berita belum dapat dipublikasikan karena ringkasan belum tersedia.",
    }
  }

  if (!isRichTextContent(news.content) || isRichTextEmpty(news.content)) {
    return {
      status: "error",
      message: "Berita belum dapat dipublikasikan karena isi berita belum valid.",
    }
  }

  if (!news.coverImageUrl || !news.coverImageFileId) {
    return {
      status: "error",
      message: "Berita belum dapat dipublikasikan. Tambahkan cover terlebih dahulu.",
    }
  }

  try {
    await prisma.news.update({
      where: {
        id,
      },

      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    })
  } catch (error) {
    console.error("PUBLISH NEWS FAILED", error)

    return {
      status: "error",
      message: "Berita gagal dipublikasikan. Silakan coba kembali.",
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
    message: "Berita berhasil dipublikasikan.",
  }
}

export { publishNews }
