"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  getNewsImageFieldErrors,
  type NewsImageActionState,
} from "@/features/news/lib/news-image-action-state"
import { canEditNews } from "@/features/news/lib/news-permissions"
import { newsImageFormSchema } from "@/features/news/schemas/news-image-schema"
import { prisma } from "@/lib/db/prisma"
import { getGoogleDriveFileId, normalizeGoogleDriveUrl } from "@/lib/google-drive"

async function updateNewsImage(
  newsId: string,
  imageId: string,
  previousState: NewsImageActionState,
  formData: FormData
): Promise<NewsImageActionState> {
  const currentUser = await requirePermission("content.edit.own")

  const image = await prisma.newsImage.findUnique({
    where: {
      id: imageId,
    },

    include: {
      news: {
        select: {
          id: true,
          slug: true,
          authorId: true,
        },
      },
    },
  })

  if (!image || image.newsId !== newsId) {
    return {
      status: "error",
      message: "Foto berita tidak ditemukan.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  if (
    !canEditNews({
      role: currentUser.role,
      userId: currentUser.id,
      authorId: image.news.authorId,
    })
  ) {
    return {
      status: "error",
      message: "Anda tidak memiliki izin untuk mengubah foto berita ini.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  const parsed = newsImageFormSchema.safeParse({
    googleDriveUrl: String(formData.get("googleDriveUrl") ?? ""),
    altText: String(formData.get("altText") ?? ""),
    caption: String(formData.get("caption") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data foto.",
      fieldErrors: getNewsImageFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const googleDriveFileId = getGoogleDriveFileId(parsed.data.googleDriveUrl)

  const googleDriveUrl = normalizeGoogleDriveUrl(parsed.data.googleDriveUrl)

  if (!googleDriveFileId || !googleDriveUrl) {
    return {
      status: "error",
      message: "Periksa kembali data foto.",
      fieldErrors: {
        googleDriveUrl: ["Link foto Google Drive tidak dapat diproses."],
      },
      submissionId: previousState.submissionId,
    }
  }

  /*
   * Foto saat ini harus dikecualikan dari duplicate check.
   */
  const duplicateImage = await prisma.newsImage.findUnique({
    where: {
      newsId_googleDriveFileId: {
        newsId,
        googleDriveFileId,
      },
    },

    select: {
      id: true,
    },
  })

  if (duplicateImage && duplicateImage.id !== imageId) {
    return {
      status: "error",
      message: "Periksa kembali data foto.",
      fieldErrors: {
        googleDriveUrl: ["Foto tersebut sudah digunakan pada berita ini."],
      },
      submissionId: previousState.submissionId,
    }
  }

  try {
    await prisma.newsImage.update({
      where: {
        id: imageId,
      },

      data: {
        googleDriveUrl,
        googleDriveFileId,
        altText: parsed.data.altText || null,
        caption: parsed.data.caption || null,
      },
    })
  } catch (error) {
    console.error("UPDATE NEWS IMAGE FAILED", error)

    return {
      status: "error",
      message: "Perubahan foto gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/berita")
  revalidatePath(`/admin/berita/${newsId}/edit`)
  revalidatePath(`/admin/berita/${newsId}/foto/${imageId}/edit`)

  revalidatePath(`/berita/${image.news.slug}`)

  return {
    status: "success",
    message: "Perubahan foto berhasil disimpan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { updateNewsImage }
