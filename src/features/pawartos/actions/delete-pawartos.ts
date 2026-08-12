"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { PawartosDeleteActionResult } from "@/features/pawartos/lib/pawartos-delete-action-state"
import { canEditPawartos } from "@/features/pawartos/lib/pawartos-permissions"
import { prisma } from "@/lib/db/prisma"

async function deletePawartos(id: string): Promise<PawartosDeleteActionResult> {
  /*
   * Seluruh role yang boleh melakukan edit minimal
   * mempunyai content.edit.own.
   */
  const currentUser = await requirePermission("content.edit.own")

  const pawartos = await prisma.pawartos.findUnique({
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

  if (!pawartos) {
    return {
      status: "error",
      message: "Pawartos tidak ditemukan.",
    }
  }

  /*
   * Server-side ownership / edit-any check.
   */
  if (
    !canEditPawartos({
      role: currentUser.role,
      userId: currentUser.id,
      authorId: pawartos.authorId,
    })
  ) {
    return {
      status: "error",
      message: "Anda tidak memiliki izin untuk menghapus Pawartos ini.",
    }
  }

  /*
   * Published tidak boleh langsung dihapus.
   * Harus dikembalikan menjadi Draft terlebih dahulu.
   */
  if (pawartos.status === "PUBLISHED") {
    return {
      status: "error",
      message:
        "Pawartos yang sudah dipublikasikan tidak dapat langsung dihapus. Batalkan publikasi terlebih dahulu.",
    }
  }

  try {
    await prisma.pawartos.delete({
      where: {
        id: pawartos.id,
      },
    })
  } catch (error) {
    console.error("DELETE PAWARTOS FAILED", error)

    return {
      status: "error",
      message: "Pawartos gagal dihapus. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/pawartos")
  revalidatePath("/pawartos")
  revalidatePath(`/pawartos/${pawartos.slug}`)

  return {
    status: "success",
    message: `${pawartos.title} berhasil dihapus.`,
  }
}

export { deletePawartos }
