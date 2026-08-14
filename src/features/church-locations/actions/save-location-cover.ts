"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { LocationCoverActionState } from "@/features/church-locations/lib/location-media-action-state"
import { churchLocationCoverFormSchema } from "@/features/church-locations/schemas/church-location-media-schema"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"
import { getGoogleDriveFileId, normalizeGoogleDriveUrl } from "@/lib/google-drive"
import { createMediaAltText } from "@/lib/media-alt-text"

async function saveLocationCover(
  locationId: string,
  previousState: LocationCoverActionState,
  formData: FormData
): Promise<LocationCoverActionState> {
  await requirePermission("church.manage")

  const location = await prisma.churchLocation.findUnique({
    where: {
      id: locationId,
    },
    select: {
      id: true,
      name: true,
    },
  })

  if (!location) {
    return {
      status: "error",
      message: "Lokasi tidak ditemukan.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  const parsed = churchLocationCoverFormSchema.safeParse({
    imageUrl: String(formData.get("imageUrl") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali foto cover.",
      fieldErrors: {
        imageUrl: parsed.error.issues.map((issue) => issue.message),
      },
      submissionId: previousState.submissionId,
    }
  }

  if (!parsed.data.imageUrl) {
    await prisma.churchLocation.update({
      where: {
        id: location.id,
      },
      data: {
        coverImageUrl: null,
        coverImageFileId: null,
        coverAltText: null,
      },
    })

    revalidatePath("/admin/lokasi")
    revalidatePath(`/admin/lokasi/${location.id}/edit`)

    updateTag(PUBLIC_CACHE_TAGS.worshipSchedules)
    updateTag(PUBLIC_CACHE_TAGS.churchLocations)
    revalidatePath("/")
    revalidatePath("/lokasi", "layout")

    return {
      status: "success",
      message: "Cover lokasi berhasil dihapus.",
      fieldErrors: {},
      submissionId: previousState.submissionId + 1,
    }
  }

  const imageFileId = getGoogleDriveFileId(parsed.data.imageUrl)
  const imageUrl = normalizeGoogleDriveUrl(parsed.data.imageUrl)

  if (!imageFileId || !imageUrl) {
    return {
      status: "error",
      message: "Periksa kembali foto cover.",
      fieldErrors: {
        imageUrl: ["Link foto Google Drive tidak dapat diproses."],
      },
      submissionId: previousState.submissionId,
    }
  }

  const duplicateCollectionImage = await prisma.churchLocationImage.findFirst({
    where: {
      churchLocationId: location.id,
      imageFileId,
    },
    select: {
      id: true,
    },
  })

  if (duplicateCollectionImage) {
    return {
      status: "error",
      message: "Foto sudah digunakan.",
      fieldErrors: {
        imageUrl: ["Foto tersebut sudah tersedia pada koleksi foto lokasi."],
      },
      submissionId: previousState.submissionId,
    }
  }

  await prisma.churchLocation.update({
    where: {
      id: location.id,
    },
    data: {
      coverImageUrl: imageUrl,
      coverImageFileId: imageFileId,
      coverAltText: createMediaAltText({
        subjectName: location.name,
        variant: "cover",
      }),
    },
  })

  revalidatePath("/admin/lokasi")
  revalidatePath(`/admin/lokasi/${location.id}/edit`)

  updateTag(PUBLIC_CACHE_TAGS.worshipSchedules)
  updateTag(PUBLIC_CACHE_TAGS.churchLocations)

  revalidatePath("/")
  revalidatePath("/lokasi", "layout")

  return {
    status: "success",
    message: "Cover lokasi berhasil disimpan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { saveLocationCover }
