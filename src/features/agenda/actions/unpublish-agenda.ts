"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { AgendaPublicationActionResult } from "@/features/agenda/lib/agenda-publication-action-state"
import { prisma } from "@/lib/db/prisma"

async function unpublishAgenda(id: string): Promise<AgendaPublicationActionResult> {
  await requirePermission("content.publish")

  const agenda = await prisma.agenda.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      slug: true,
      status: true,
    },
  })

  if (!agenda) {
    return {
      status: "error",
      message: "Agenda tidak ditemukan.",
    }
  }

  if (agenda.status === "DRAFT") {
    return {
      status: "success",
      message: "Agenda sudah berstatus Draft.",
    }
  }

  try {
    await prisma.agenda.update({
      where: {
        id,
      },

      data: {
        status: "DRAFT",
        publishedAt: null,
      },
    })
  } catch (error) {
    console.error("UNPUBLISH AGENDA FAILED", error)

    return {
      status: "error",
      message: "Publikasi agenda gagal dibatalkan. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/agenda")
  revalidatePath(`/admin/agenda/${id}/edit`)

  revalidatePath("/agenda")
  revalidatePath(`/agenda/${agenda.slug}`)

  return {
    status: "success",
    message: "Agenda dikembalikan menjadi Draft.",
  }
}

export { unpublishAgenda }
