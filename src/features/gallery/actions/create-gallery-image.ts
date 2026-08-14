"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  type GalleryImageActionState,
  getGalleryImageFieldErrors,
} from "@/features/gallery/lib/gallery-image-action-state"
import { galleryImageFormSchema } from "@/features/gallery/schemas/gallery-image-schema"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"
import { getGoogleDriveFileId, normalizeGoogleDriveUrl } from "@/lib/google-drive"

import { findDuplicateGalleryImage } from "../lib/find-duplicate-gallery-image"

async function createGalleryImage(
  albumId: string,
  previousState: GalleryImageActionState,
  formData: FormData
): Promise<GalleryImageActionState> {
  await requirePermission("content.create")

  const album = await prisma.galleryAlbum.findUnique({
    where: {
      id: albumId,
    },
    select: {
      id: true,
    },
  })

  if (!album) {
    return {
      status: "error",
      message: "Album galeri tidak ditemukan.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  const parsed = galleryImageFormSchema.safeParse({
    imageUrl: String(formData.get("imageUrl") ?? ""),
    caption: String(formData.get("caption") ?? ""),
    altText: String(formData.get("altText") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data yang diisi.",
      fieldErrors: getGalleryImageFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const fileId = getGoogleDriveFileId(parsed.data.imageUrl)
  const imageUrl = normalizeGoogleDriveUrl(parsed.data.imageUrl)

  if (!fileId || !imageUrl) {
    return {
      status: "error",
      message: "Periksa kembali link foto.",
      fieldErrors: {
        imageUrl: ["Link foto Google Drive tidak dapat diproses."],
      },
      submissionId: previousState.submissionId,
    }
  }

  const duplicateImage = await findDuplicateGalleryImage({
    albumId,
    fileId,
  })

  if (duplicateImage) {
    return {
      status: "error",
      message: "Periksa kembali foto yang dipilih.",
      fieldErrors: {
        imageUrl: ["Foto tersebut sudah tersedia di album ini."],
      },
      submissionId: previousState.submissionId,
    }
  }

  try {
    const lastImage = await prisma.galleryImage.aggregate({
      where: {
        albumId,
      },
      _max: {
        sortOrder: true,
      },
    })

    await prisma.galleryImage.create({
      data: {
        albumId,
        imageUrl,
        caption: parsed.data.caption || null,
        altText: parsed.data.altText || null,
        sortOrder: (lastImage._max.sortOrder ?? 0) + 1,
        isActive: true,
      },
    })
  } catch (error) {
    console.error("CREATE GALLERY IMAGE FAILED", error)

    return {
      status: "error",
      message: "Foto galeri gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/galeri")
  revalidatePath(`/admin/galeri/${albumId}`)

  updateTag(PUBLIC_CACHE_TAGS.gallery)

  revalidatePath("/")
  revalidatePath("/galeri", "layout")

  return {
    status: "success",
    message: "Foto galeri berhasil ditambahkan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createGalleryImage }
