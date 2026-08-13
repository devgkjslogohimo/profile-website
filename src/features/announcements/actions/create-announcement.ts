"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  type AnnouncementActionState,
  getAnnouncementFieldErrors,
} from "@/features/announcements/lib/announcement-action-state"
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
  /*
   * Hilangkan kemungkinan undefined dari object JS
   * sebelum masuk ke Prisma Json.
   */
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
}

async function createAnnouncement(
  previousState: AnnouncementActionState,
  formData: FormData
): Promise<AnnouncementActionState> {
  const currentUser = await requirePermission("content.create")

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

  try {
    let slug = baseSlug
    let suffix = 2

    while (
      await prisma.announcement.findUnique({
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

    await prisma.announcement.create({
      data: {
        title: parsed.data.title,
        slug,

        content: toPrismaJson(parsed.data.content),

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
    console.error("CREATE ANNOUNCEMENT FAILED", error)

    return {
      status: "error",
      message: "Pengumuman gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/pengumuman")

  return {
    status: "success",
    message: "Pengumuman berhasil ditambahkan sebagai draft.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createAnnouncement }
