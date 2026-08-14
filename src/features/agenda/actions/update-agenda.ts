"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  type AgendaActionState,
  getAgendaFieldErrors,
} from "@/features/agenda/lib/agenda-action-state"
import { createAgendaDateTime } from "@/features/agenda/lib/agenda-date-time"
import { canEditAgenda } from "@/features/agenda/lib/agenda-permissions"
import { createAgendaSlug } from "@/features/agenda/lib/agenda-slug"
import { agendaFormSchema } from "@/features/agenda/schemas/agenda-schema"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/lib/db/prisma"
import { getGoogleDriveFileId, normalizeGoogleDriveUrl } from "@/lib/google-drive"

function parseContent(value: FormDataEntryValue | null): unknown {
  if (typeof value !== "string") {
    return null
  }

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function toPrismaJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
}

async function updateAgenda(
  id: string,
  previousState: AgendaActionState,
  formData: FormData
): Promise<AgendaActionState> {
  const currentUser = await requirePermission("content.edit.own")

  const existingAgenda = await prisma.agenda.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      slug: true,
      authorId: true,
      status: true,
    },
  })

  if (!existingAgenda) {
    return {
      status: "error",
      message: "Agenda tidak ditemukan.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  if (
    !canEditAgenda({
      role: currentUser.role,
      userId: currentUser.id,
      authorId: existingAgenda.authorId,
    })
  ) {
    return {
      status: "error",
      message: "Anda tidak memiliki izin untuk mengubah agenda ini.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  const parsed = agendaFormSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: parseContent(formData.get("content")),

    startsAt: String(formData.get("startsAt") ?? ""),
    endsAt: String(formData.get("endsAt") ?? ""),

    location: String(formData.get("location") ?? ""),
    googleMapsUrl: String(formData.get("googleMapsUrl") ?? ""),

    coverImageUrl: String(formData.get("coverImageUrl") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data agenda.",
      fieldErrors: getAgendaFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  let coverImageUrl: string | null = null
  let coverImageFileId: string | null = null

  if (parsed.data.coverImageUrl) {
    coverImageFileId = getGoogleDriveFileId(parsed.data.coverImageUrl)

    coverImageUrl = normalizeGoogleDriveUrl(parsed.data.coverImageUrl)

    if (!coverImageFileId || !coverImageUrl) {
      return {
        status: "error",
        message: "Periksa kembali data agenda.",
        fieldErrors: {
          coverImageUrl: ["Link cover Google Drive tidak dapat diproses."],
        },
        submissionId: previousState.submissionId,
      }
    }
  }

  /*
   * Draft mengikuti perubahan judul.
   * Published mempertahankan slug agar URL publik stabil.
   */
  let slug = existingAgenda.slug

  if (existingAgenda.status === "DRAFT") {
    const baseSlug = createAgendaSlug(parsed.data.title)

    if (!baseSlug) {
      return {
        status: "error",
        message: "Periksa kembali data agenda.",
        fieldErrors: {
          title: ["Judul agenda tidak dapat digunakan untuk membuat slug."],
        },
        submissionId: previousState.submissionId,
      }
    }

    slug = baseSlug
    let suffix = 2

    while (
      await prisma.agenda.findFirst({
        where: {
          slug,

          id: {
            not: id,
          },
        },

        select: {
          id: true,
        },
      })
    ) {
      slug = `${baseSlug}-${suffix}`
      suffix += 1
    }
  }

  try {
    await prisma.agenda.update({
      where: {
        id,
      },

      data: {
        title: parsed.data.title,
        slug,
        excerpt: parsed.data.excerpt,

        content: toPrismaJson(parsed.data.content),

        startsAt: createAgendaDateTime(parsed.data.startsAt),

        endsAt: parsed.data.endsAt ? createAgendaDateTime(parsed.data.endsAt) : null,

        location: parsed.data.location || null,

        googleMapsUrl: parsed.data.googleMapsUrl || null,

        coverImageUrl,
        coverImageFileId,
      },
    })
  } catch (error) {
    console.error("UPDATE AGENDA FAILED", error)

    return {
      status: "error",
      message: "Perubahan agenda gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/agenda")
  revalidatePath(`/admin/agenda/${id}/edit`)

  if (existingAgenda.status === "PUBLISHED") {
    updateTag(PUBLIC_CACHE_TAGS.agendas)

    revalidatePath("/")
    revalidatePath("/agenda")
    revalidatePath(`/agenda/${existingAgenda.slug}`)
  }

  return {
    status: "success",
    message: "Perubahan agenda berhasil disimpan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { updateAgenda }
