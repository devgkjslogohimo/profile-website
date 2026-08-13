"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  getLocationImageFieldErrors,
  type LocationImageActionState,
} from "@/features/church-locations/lib/location-media-action-state"
import { churchLocationImageFormSchema } from "@/features/church-locations/schemas/church-location-media-schema"
import { prisma } from "@/lib/db/prisma"
import { getGoogleDriveFileId, normalizeGoogleDriveUrl } from "@/lib/google-drive"
import { createMediaAltText } from "@/lib/media-alt-text"

async function updateLocationImage(
  id: string,
  previousState: LocationImageActionState,
  formData: FormData
): Promise<LocationImageActionState> {
  await requirePermission("church.manage")

  const image = await prisma.churchLocationImage.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      churchLocationId: true,

      churchLocation: {
        select: {
          name: true,
          coverImageFileId: true,
        },
      },
    },
  })

  if (!image) {
    return {
      status: "error",
      message: "Foto lokasi tidak ditemukan.",
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

  if (image.churchLocation.coverImageFileId === imageFileId) {
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
      churchLocationId: image.churchLocationId,
      imageFileId,

      NOT: {
        id: image.id,
      },
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

  await prisma.churchLocationImage.update({
    where: {
      id: image.id,
    },
    data: {
      imageUrl,
      imageFileId,
      caption: parsed.data.caption || null,
      altText: createMediaAltText({
        subjectName: image.churchLocation.name,
        caption: parsed.data.caption,
      }),
    },
  })

  revalidatePath(`/admin/lokasi/${image.churchLocationId}/edit`)

  return {
    status: "success",
    message: "Foto lokasi berhasil diperbarui.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { updateLocationImage }
