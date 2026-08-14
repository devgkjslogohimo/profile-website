"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { AgendaPublicationActionResult } from "@/features/agenda/lib/agenda-publication-action-state"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"
import { isRichTextContent, isRichTextEmpty } from "@/lib/rich-text"

async function publishAgenda(id: string): Promise<AgendaPublicationActionResult> {
  await requirePermission("content.publish")

  const agenda = await prisma.agenda.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,

      startsAt: true,
      endsAt: true,

      status: true,
    },
  })

  if (!agenda) {
    return {
      status: "error",
      message: "Agenda tidak ditemukan.",
    }
  }

  if (agenda.status === "PUBLISHED") {
    return {
      status: "success",
      message: "Agenda sudah berstatus Published.",
    }
  }

  if (!agenda.title.trim()) {
    return {
      status: "error",
      message: "Agenda belum dapat dipublikasikan karena judul belum tersedia.",
    }
  }

  if (!agenda.excerpt.trim()) {
    return {
      status: "error",
      message: "Agenda belum dapat dipublikasikan karena ringkasan belum tersedia.",
    }
  }

  if (!isRichTextContent(agenda.content) || isRichTextEmpty(agenda.content)) {
    return {
      status: "error",
      message: "Agenda belum dapat dipublikasikan karena isi agenda belum valid.",
    }
  }

  /*
   * Pertahanan tambahan pada boundary publikasi.
   * Form sudah mencegah waktu selesai lebih awal dari waktu mulai,
   * tetapi database tetap menjadi source of truth.
   */
  if (agenda.endsAt && agenda.endsAt.getTime() < agenda.startsAt.getTime()) {
    return {
      status: "error",
      message:
        "Agenda belum dapat dipublikasikan karena waktu selesai lebih awal dari waktu mulai.",
    }
  }

  try {
    await prisma.agenda.update({
      where: {
        id,
      },

      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    })
  } catch (error) {
    console.error("PUBLISH AGENDA FAILED", error)

    return {
      status: "error",
      message: "Agenda gagal dipublikasikan. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/agenda")
  revalidatePath(`/admin/agenda/${id}/edit`)

  updateTag(PUBLIC_CACHE_TAGS.agendas)

  revalidatePath("/")
  revalidatePath("/agenda")
  revalidatePath(`/agenda/${agenda.slug}`)

  return {
    status: "success",
    message: "Agenda berhasil dipublikasikan.",
  }
}

export { publishAgenda }
