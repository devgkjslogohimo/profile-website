"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { PawartosPublicationActionResult } from "@/features/pawartos/lib/pawartos-publication-action-state"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

async function unpublishPawartos(id: string): Promise<PawartosPublicationActionResult> {
  await requirePermission("content.publish")

  const pawartos = await prisma.pawartos.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      slug: true,
      status: true,
    },
  })

  if (!pawartos) {
    return {
      status: "error",
      message: "Pawartos tidak ditemukan.",
    }
  }

  if (pawartos.status === "DRAFT") {
    return {
      status: "success",
      message: "Pawartos sudah berstatus Draft.",
    }
  }

  try {
    await prisma.pawartos.update({
      where: {
        id,
      },
      data: {
        status: "DRAFT",
        publishedAt: null,
      },
    })
  } catch (error) {
    console.error("UNPUBLISH PAWARTOS FAILED", error)

    return {
      status: "error",
      message: "Publikasi Pawartos gagal dibatalkan. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/pawartos")
  revalidatePath(`/admin/pawartos/${id}/edit`)

  updateTag(PUBLIC_CACHE_TAGS.pawartos)

  revalidatePath("/")
  revalidatePath("/pawartos")
  revalidatePath(`/pawartos/${pawartos.slug}`)

  return {
    status: "success",
    message: "Pawartos dikembalikan menjadi Draft.",
  }
}

export { unpublishPawartos }
