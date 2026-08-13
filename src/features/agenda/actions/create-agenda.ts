"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  type AgendaActionState,
  getAgendaFieldErrors,
} from "@/features/agenda/lib/agenda-action-state"
import { createAgendaDateTime } from "@/features/agenda/lib/agenda-date-time"
import { createAgendaSlug } from "@/features/agenda/lib/agenda-slug"
import { agendaFormSchema } from "@/features/agenda/schemas/agenda-schema"
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
  /*
   * Hilangkan kemungkinan undefined dari object JS
   * sebelum masuk ke Prisma Json.
   */
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
}

async function createAgenda(
  previousState: AgendaActionState,
  formData: FormData
): Promise<AgendaActionState> {
  const currentUser = await requirePermission("content.create")

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

  try {
    let slug = baseSlug
    let suffix = 2

    while (
      await prisma.agenda.findUnique({
        where: {
          slug,
        },

        select: {
          id: true,
        },
      })
    ) {
      slug = `${baseSlug}-${suffix}`
      suffix += 1
    }

    await prisma.agenda.create({
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

        /*
         * Create tidak menerima status dari browser.
         */
        status: "DRAFT",
        publishedAt: null,

        /*
         * Ownership selalu berasal dari session.
         */
        authorId: currentUser.id,
      },
    })
  } catch (error) {
    console.error("CREATE AGENDA FAILED", error)

    return {
      status: "error",
      message: "Agenda gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/agenda")

  return {
    status: "success",
    message: "Agenda berhasil ditambahkan sebagai draft.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createAgenda }
