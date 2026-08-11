"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  type GalleryAlbumActionState,
  getGalleryAlbumFieldErrors,
} from "@/features/gallery/lib/gallery-album-action-state"
import { createGalleryAlbumSlug } from "@/features/gallery/lib/gallery-album-slug"
import { normalizeGoogleDriveFolderUrl } from "@/features/gallery/lib/gallery-google-drive-url"
import { galleryAlbumFormSchema } from "@/features/gallery/schemas/gallery-album-schema"
import { prisma } from "@/lib/db/prisma"
import { normalizeGoogleDriveUrl } from "@/lib/google-drive"

async function createGalleryAlbum(
  previousState: GalleryAlbumActionState,
  formData: FormData
): Promise<GalleryAlbumActionState> {
  await requirePermission("content.create")

  const parsed = galleryAlbumFormSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    eventDate: String(formData.get("eventDate") ?? ""),
    coverImageUrl: String(formData.get("coverImageUrl") ?? ""),
    googleDriveUrl: String(formData.get("googleDriveUrl") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data yang diisi.",
      fieldErrors: getGalleryAlbumFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const eventDate = parsed.data.eventDate
    ? new Date(`${parsed.data.eventDate}T00:00:00.000Z`)
    : null

  try {
    const baseSlug = createGalleryAlbumSlug(parsed.data.title)

    if (!baseSlug) {
      return {
        status: "error",
        message: "Periksa kembali data album.",
        fieldErrors: {
          title: ["Judul album tidak dapat digunakan untuk membuat slug."],
        },
        submissionId: previousState.submissionId,
      }
    }

    let slug = baseSlug
    let suffix = 2

    while (
      await prisma.galleryAlbum.findUnique({
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

    const lastAlbum = await prisma.galleryAlbum.aggregate({
      _max: {
        sortOrder: true,
      },
    })

    const coverImageUrl = parsed.data.coverImageUrl
      ? normalizeGoogleDriveUrl(parsed.data.coverImageUrl)
      : null

    const googleDriveUrl = parsed.data.googleDriveUrl
      ? normalizeGoogleDriveFolderUrl(parsed.data.googleDriveUrl)
      : null

    await prisma.galleryAlbum.create({
      data: {
        title: parsed.data.title,
        slug,
        description: parsed.data.description || null,
        eventDate,
        coverImageUrl,
        googleDriveUrl,
        sortOrder: (lastAlbum._max.sortOrder ?? 0) + 1,
        isActive: true,
      },
    })
  } catch (error) {
    console.error("CREATE GALLERY ALBUM FAILED", error)

    return {
      status: "error",
      message: "Album galeri gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/galeri")

  return {
    status: "success",
    message: "Album galeri berhasil ditambahkan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createGalleryAlbum }
