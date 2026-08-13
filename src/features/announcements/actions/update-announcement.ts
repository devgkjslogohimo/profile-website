"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  type AnnouncementActionState,
  getAnnouncementFieldErrors,
} from "@/features/announcements/lib/announcement-action-state"
import { canEditAnnouncement } from "@/features/announcements/lib/announcement-permissions"
import { createAnnouncementSlug } from "@/features/announcements/lib/announcement-slug"
import { announcementFormSchema } from "@/features/announcements/schemas/announcement-schema"
import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/lib/db/prisma"

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

async function updateAnnouncement(
  id: string,
  previousState: AnnouncementActionState,
  formData: FormData
): Promise<AnnouncementActionState> {
  const currentUser = await requirePermission("content.edit.own")

  const existingAnnouncement = await prisma.announcement.findUnique({
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

  if (!existingAnnouncement) {
    return {
      status: "error",
      message: "Pengumuman tidak ditemukan.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  if (
    !canEditAnnouncement({
      role: currentUser.role,
      userId: currentUser.id,
      authorId: existingAnnouncement.authorId,
    })
  ) {
    return {
      status: "error",
      message: "Anda tidak memiliki izin untuk mengubah pengumuman ini.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  const parsed = announcementFormSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    content: parseContent(formData.get("content")),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data pengumuman.",
      fieldErrors: getAnnouncementFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  /*
   * Draft boleh mengikuti perubahan judul.
   * Published mempertahankan slug agar URL publik stabil.
   */
  let slug = existingAnnouncement.slug

  if (existingAnnouncement.status === "DRAFT") {
    const baseSlug = createAnnouncementSlug(parsed.data.title)

    if (!baseSlug) {
      return {
        status: "error",
        message: "Periksa kembali data pengumuman.",
        fieldErrors: {
          title: ["Judul pengumuman tidak dapat digunakan untuk membuat slug."],
        },
        submissionId: previousState.submissionId,
      }
    }

    slug = baseSlug
    let suffix = 2

    while (
      await prisma.announcement.findFirst({
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
    await prisma.announcement.update({
      where: {
        id,
      },

      data: {
        title: parsed.data.title,
        slug,

        content: toPrismaJson(parsed.data.content),
      },
    })
  } catch (error) {
    console.error("UPDATE ANNOUNCEMENT FAILED", error)

    return {
      status: "error",
      message: "Perubahan pengumuman gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/pengumuman")
  revalidatePath(`/admin/pengumuman/${id}/edit`)

  /*
   * Route publik belum dibangun.
   * Disiapkan seperti pola Berita/Pawartos.
   */
  revalidatePath("/pengumuman")
  revalidatePath(`/pengumuman/${slug}`)

  return {
    status: "success",
    message: "Perubahan pengumuman berhasil disimpan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { updateAnnouncement }
