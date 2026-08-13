"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { AgendaDeleteActionResult } from "@/features/agenda/lib/agenda-delete-action-state"
import { canEditAgenda } from "@/features/agenda/lib/agenda-permissions"
import { prisma } from "@/lib/db/prisma"

async function deleteAgenda(id: string): Promise<AgendaDeleteActionResult> {
  const currentUser = await requirePermission("content.edit.own")

  const agenda = await prisma.agenda.findUnique({
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

  if (!agenda) {
    return {
      status: "error",
      message: "Agenda tidak ditemukan.",
    }
  }

  if (
    !canEditAgenda({
      role: currentUser.role,
      userId: currentUser.id,
      authorId: agenda.authorId,
    })
  ) {
    return {
      status: "error",
      message: "Anda tidak memiliki izin untuk menghapus agenda ini.",
    }
  }

  /*
   * Agenda Published harus di-Unpublish terlebih dahulu.
   */
  if (agenda.status === "PUBLISHED") {
    return {
      status: "error",
      message:
        "Agenda yang sudah dipublikasikan tidak dapat langsung dihapus. Batalkan publikasi terlebih dahulu.",
    }
  }

  try {
    await prisma.agenda.delete({
      where: {
        id: agenda.id,
      },
    })
  } catch (error) {
    console.error("DELETE AGENDA FAILED", error)

    return {
      status: "error",
      message: "Agenda gagal dihapus. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/agenda")

  revalidatePath("/agenda")
  revalidatePath(`/agenda/${agenda.slug}`)

  return {
    status: "success",
    message: `${agenda.title} berhasil dihapus dari sistem.`,
  }
}

export { deleteAgenda }
