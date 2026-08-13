"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { getNewsFieldErrors, type NewsActionState } from "@/features/news/lib/news-action-state"
import { createNewsSlug } from "@/features/news/lib/news-slug"
import { newsFormSchema } from "@/features/news/schemas/news-schema"
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

async function createNews(
  previousState: NewsActionState,
  formData: FormData
): Promise<NewsActionState> {
  const currentUser = await requirePermission("content.create")

  const parsed = newsFormSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: parseContent(formData.get("content")),
    coverImageUrl: String(formData.get("coverImageUrl") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data berita.",
      fieldErrors: getNewsFieldErrors(parsed.error.issues),
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
        message: "Periksa kembali data berita.",
        fieldErrors: {
          coverImageUrl: ["Link cover Google Drive tidak dapat diproses."],
        },
        submissionId: previousState.submissionId,
      }
    }
  }

  const baseSlug = createNewsSlug(parsed.data.title)

  if (!baseSlug) {
    return {
      status: "error",
      message: "Periksa kembali data berita.",
      fieldErrors: {
        title: ["Judul berita tidak dapat digunakan untuk membuat slug."],
      },
      submissionId: previousState.submissionId,
    }
  }

  try {
    let slug = baseSlug
    let suffix = 2

    while (
      await prisma.news.findUnique({
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

    await prisma.news.create({
      data: {
        title: parsed.data.title,
        slug,
        excerpt: parsed.data.excerpt,

        content: toPrismaJson(parsed.data.content),

        coverImageUrl,
        coverImageFileId,

        /*
         * Create tidak menerima status dari browser.
         */
        status: "DRAFT",
        publishedAt: null,

        /*
         * Ownership selalu dari session.
         */
        authorId: currentUser.id,
      },
    })
  } catch (error) {
    console.error("CREATE NEWS FAILED", error)

    return {
      status: "error",
      message: "Berita gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/berita")

  return {
    status: "success",
    message: "Berita berhasil ditambahkan sebagai draft.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createNews }
