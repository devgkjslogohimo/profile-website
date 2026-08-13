"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { getNewsFieldErrors, type NewsActionState } from "@/features/news/lib/news-action-state"
import { canEditNews } from "@/features/news/lib/news-permissions"
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
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
}

async function updateNews(
  id: string,
  previousState: NewsActionState,
  formData: FormData
): Promise<NewsActionState> {
  const currentUser = await requirePermission("content.edit.own")

  const existingNews = await prisma.news.findUnique({
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

  if (!existingNews) {
    return {
      status: "error",
      message: "Berita tidak ditemukan.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  if (
    !canEditNews({
      role: currentUser.role,
      userId: currentUser.id,
      authorId: existingNews.authorId,
    })
  ) {
    return {
      status: "error",
      message: "Anda tidak memiliki izin untuk mengubah berita ini.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

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

  if (existingNews.status === "PUBLISHED" && (!coverImageUrl || !coverImageFileId)) {
    return {
      status: "error",
      message: "Periksa kembali data berita.",
      fieldErrors: {
        coverImageUrl: [
          "Cover tidak dapat dihapus selama berita berstatus Published. Batalkan publikasi terlebih dahulu.",
        ],
      },
      submissionId: previousState.submissionId,
    }
  }

  /*
   * Draft mengikuti perubahan judul.
   * Published mempertahankan slug agar URL publik stabil.
   */
  let slug = existingNews.slug

  if (existingNews.status === "DRAFT") {
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

    slug = baseSlug
    let suffix = 2

    while (
      await prisma.news.findFirst({
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
    await prisma.news.update({
      where: {
        id,
      },
      data: {
        title: parsed.data.title,
        slug,
        excerpt: parsed.data.excerpt,

        content: toPrismaJson(parsed.data.content),

        coverImageUrl,
        coverImageFileId,
      },
    })
  } catch (error) {
    console.error("UPDATE NEWS FAILED", error)

    return {
      status: "error",
      message: "Perubahan berita gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/berita")
  revalidatePath(`/admin/berita/${id}/edit`)

  return {
    status: "success",
    message: "Perubahan berita berhasil disimpan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { updateNews }
