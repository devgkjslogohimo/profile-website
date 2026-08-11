"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  type GalleryImageActionState,
  getGalleryImageFieldErrors,
} from "@/features/gallery/lib/gallery-image-action-state"
import { galleryImageFormSchema } from "@/features/gallery/schemas/gallery-image-schema"
import { prisma } from "@/lib/db/prisma"
import { getGoogleDriveFileId, normalizeGoogleDriveUrl } from "@/lib/google-drive"

import { findDuplicateGalleryImage } from "../lib/find-duplicate-gallery-image"

async function updateGalleryImage(
  id: string,
  previousState: GalleryImageActionState,
  formData: FormData
): Promise<GalleryImageActionState> {
  await requirePermission("content.create")

  const existingImage = await prisma.galleryImage.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      albumId: true,
    },
  })

  if (!existingImage) {
    return {
      status: "error",
      message: "Foto galeri tidak ditemukan.",
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
    albumId: existingImage.albumId,
    fileId,
    excludeId: id,
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
    await prisma.galleryImage.update({
      where: {
        id,
      },
      data: {
        imageUrl,
        caption: parsed.data.caption || null,
        altText: parsed.data.altText || null,
      },
    })
  } catch (error) {
    console.error("UPDATE GALLERY IMAGE FAILED", error)

    return {
      status: "error",
      message: "Perubahan foto galeri gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/galeri")
  revalidatePath(`/admin/galeri/${existingImage.albumId}`)
  revalidatePath(`/admin/galeri/${existingImage.albumId}/foto/${id}/edit`)

  return {
    status: "success",
    message: "Perubahan foto galeri berhasil disimpan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { updateGalleryImage }
