"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { SitePagePublicationActionResult } from "@/features/site-pages/lib/site-page-publication-action-state"
import { prisma } from "@/lib/db/prisma"

async function unpublishSitePage(id: string): Promise<SitePagePublicationActionResult> {
  await requirePermission("content.publish")

  const sitePage = await prisma.sitePage.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      slug: true,
      status: true,
    },
  })

  if (!sitePage) {
    return {
      status: "error",
      message: "Halaman tidak ditemukan.",
    }
  }

  if (sitePage.status === "DRAFT") {
    return {
      status: "success",
      message: "Halaman sudah berstatus Draft.",
    }
  }

  try {
    await prisma.sitePage.update({
      where: {
        id,
      },

      data: {
        status: "DRAFT",
        publishedAt: null,
      },
    })
  } catch (error) {
    console.error("UNPUBLISH SITE PAGE FAILED", error)

    return {
      status: "error",
      message: "Publikasi halaman gagal dibatalkan. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/halaman")

  revalidatePath(`/admin/halaman/${id}/edit`)

  revalidatePath(`/${sitePage.slug}`)

  return {
    status: "success",
    message: "Halaman dikembalikan menjadi Draft.",
  }
}

export { unpublishSitePage }
