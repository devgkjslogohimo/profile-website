"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  getLocationImageFieldErrors,
  type LocationImageActionState,
} from "@/features/church-locations/lib/location-media-action-state"
import { churchLocationImageFormSchema } from "@/features/church-locations/schemas/church-location-media-schema"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"
import { getGoogleDriveFileId, normalizeGoogleDriveUrl } from "@/lib/google-drive"
import { createMediaAltText } from "@/lib/media-alt-text"

async function createLocationImage(
  locationId: string,
  previousState: LocationImageActionState,
  formData: FormData
): Promise<LocationImageActionState> {
  await requirePermission("church.manage")

  const location = await prisma.churchLocation.findUnique({
    where: {
      id: locationId,
    },
    select: {
      id: true,
      name: true,
      coverImageFileId: true,
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

  const parsed = churchLocationImageFormSchema.safeParse({
    imageUrl: String(formData.get("imageUrl") ?? ""),
    caption: String(formData.get("caption") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data foto.",
      fieldErrors: getLocationImageFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const imageFileId = getGoogleDriveFileId(parsed.data.imageUrl)
  const imageUrl = normalizeGoogleDriveUrl(parsed.data.imageUrl)

  if (!imageFileId || !imageUrl) {
    return {
      status: "error",
      message: "Periksa kembali link foto.",
      fieldErrors: {
        imageUrl: ["Link foto Google Drive tidak dapat diproses."],
      },
      submissionId: previousState.submissionId,
    }
  }

  if (location.coverImageFileId === imageFileId) {
    return {
      status: "error",
      message: "Foto sudah digunakan.",
      fieldErrors: {
        imageUrl: ["Foto tersebut sedang digunakan sebagai cover lokasi."],
      },
      submissionId: previousState.submissionId,
    }
  }

  const duplicateImage = await prisma.churchLocationImage.findFirst({
    where: {
      churchLocationId: location.id,
      imageFileId,
    },
    select: {
      id: true,
    },
  })

  if (duplicateImage) {
    return {
      status: "error",
      message: "Foto sudah tersedia.",
      fieldErrors: {
        imageUrl: ["Foto tersebut sudah tersedia pada koleksi lokasi ini."],
      },
      submissionId: previousState.submissionId,
    }
  }

  const lastImage = await prisma.churchLocationImage.aggregate({
    where: {
      churchLocationId: location.id,
    },
    _max: {
      sortOrder: true,
    },
  })

  await prisma.churchLocationImage.create({
    data: {
      churchLocationId: location.id,
      imageUrl,
      imageFileId,
      caption: parsed.data.caption || null,
      altText: createMediaAltText({
        subjectName: location.name,
        caption: parsed.data.caption,
      }),
      sortOrder: (lastImage._max.sortOrder ?? 0) + 1,
      isActive: true,
    },
  })

  revalidatePath(`/admin/lokasi/${location.id}/edit`)

  updateTag(PUBLIC_CACHE_TAGS.churchLocations)
  revalidatePath("/lokasi", "layout")

  return {
    status: "success",
    message: "Foto lokasi berhasil ditambahkan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createLocationImage }
