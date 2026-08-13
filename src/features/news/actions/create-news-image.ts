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

async function createNewsImage(
  newsId: string,
  previousState: NewsImageActionState,
  formData: FormData
): Promise<NewsImageActionState> {
  const currentUser = await requirePermission("content.edit.own")

  const news = await prisma.news.findUnique({
    where: {
      id: newsId,
    },

    select: {
      id: true,
      authorId: true,
    },
  })

  if (!news) {
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
      authorId: news.authorId,
    })
  ) {
    return {
      status: "error",
      message: "Anda tidak memiliki izin untuk menambahkan foto pada berita ini.",
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

  if (duplicateImage) {
    return {
      status: "error",
      message: "Periksa kembali foto yang dipilih.",
      fieldErrors: {
        googleDriveUrl: ["Foto tersebut sudah digunakan pada berita ini."],
      },
      submissionId: previousState.submissionId,
    }
  }

  const lastImage = await prisma.newsImage.findFirst({
    where: {
      newsId,
    },

    orderBy: {
      sortOrder: "desc",
    },

    select: {
      sortOrder: true,
    },
  })

  try {
    await prisma.newsImage.create({
      data: {
        newsId,

        googleDriveUrl,
        googleDriveFileId,

        altText: parsed.data.altText || null,
        caption: parsed.data.caption || null,

        sortOrder: (lastImage?.sortOrder ?? -1) + 1,
      },
    })
  } catch (error) {
    console.error("CREATE NEWS IMAGE FAILED", error)

    return {
      status: "error",
      message: "Foto berita gagal ditambahkan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/berita")
  revalidatePath(`/admin/berita/${newsId}/edit`)

  return {
    status: "success",
    message: "Foto dokumentasi berhasil ditambahkan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createNewsImage }
