"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import type { SitePagePublicationActionResult } from "@/features/site-pages/lib/site-page-publication-action-state"
import { prisma } from "@/lib/db/prisma"
import { isRichTextContent, isRichTextEmpty } from "@/lib/rich-text"

async function publishSitePage(id: string): Promise<SitePagePublicationActionResult> {
  await requirePermission("content.publish")

  const sitePage = await prisma.sitePage.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      slug: true,
      title: true,
      content: true,
      status: true,
    },
  })

  if (!sitePage) {
    return {
      status: "error",
      message: "Halaman tidak ditemukan.",
    }
  }

  if (sitePage.status === "PUBLISHED") {
    return {
      status: "success",
      message: "Halaman sudah berstatus Published.",
    }
  }

  if (!sitePage.title.trim()) {
    return {
      status: "error",
      message: "Halaman belum dapat dipublikasikan karena judul belum tersedia.",
    }
  }

  if (!isRichTextContent(sitePage.content) || isRichTextEmpty(sitePage.content)) {
    return {
      status: "error",
      message: "Halaman belum dapat dipublikasikan karena isi halaman belum valid.",
    }
  }

  try {
    await prisma.sitePage.update({
      where: {
        id,
      },

      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    })
  } catch (error) {
    console.error("PUBLISH SITE PAGE FAILED", error)

    return {
      status: "error",
      message: "Halaman gagal dipublikasikan. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/halaman")

  revalidatePath(`/admin/halaman/${id}/edit`)

  updateTag(PUBLIC_CACHE_TAGS.sitePages)
  updateTag(PUBLIC_CACHE_TAGS.navigation)

  /*
   * Route publik SitePage nantinya
   * menggunakan root slug.
   *
   * Contoh:
   * /sejarah
   * /visi-misi
   */
  revalidatePath(`/${sitePage.slug}`)

  return {
    status: "success",
    message: "Halaman berhasil dipublikasikan.",
  }
}

export { publishSitePage }
