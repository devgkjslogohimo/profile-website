"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { SitePageDeleteActionResult } from "@/features/site-pages/lib/site-page-delete-action-state"
import { canEditSitePage } from "@/features/site-pages/lib/site-page-permissions"
import { prisma } from "@/lib/db/prisma"

async function deleteSitePage(id: string): Promise<SitePageDeleteActionResult> {
  const currentUser = await requirePermission("content.edit.own")

  const sitePage = await prisma.sitePage.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      authorId: true,
    },
  })

  if (!sitePage) {
    return {
      status: "error",
      message: "Halaman tidak ditemukan.",
    }
  }

  if (
    !canEditSitePage({
      role: currentUser.role,
      userId: currentUser.id,
      authorId: sitePage.authorId,
    })
  ) {
    return {
      status: "error",
      message: "Anda tidak memiliki izin untuk menghapus halaman ini.",
    }
  }

  /*
   * Halaman Published harus
   * dikembalikan menjadi Draft
   * terlebih dahulu.
   */
  if (sitePage.status === "PUBLISHED") {
    return {
      status: "error",
      message:
        "Halaman yang sudah dipublikasikan tidak dapat langsung dihapus. Batalkan publikasi terlebih dahulu.",
    }
  }

  try {
    await prisma.sitePage.delete({
      where: {
        id: sitePage.id,
      },
    })
  } catch (error) {
    console.error("DELETE SITE PAGE FAILED", error)

    return {
      status: "error",
      message: "Halaman gagal dihapus. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/halaman")

  revalidatePath(`/${sitePage.slug}`)

  return {
    status: "success",
    message: `${sitePage.title} berhasil dihapus dari sistem.`,
  }
}

export { deleteSitePage }
