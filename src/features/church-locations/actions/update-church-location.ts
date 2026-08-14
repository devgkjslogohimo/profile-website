"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type {
  ChurchLocationActionState,
  ChurchLocationField,
} from "@/features/church-locations/lib/action-state"
import { createChurchLocationSlug } from "@/features/church-locations/lib/slug"
import {
  churchLocationFormSchema,
  churchLocationSlugSchema,
} from "@/features/church-locations/schemas/church-location-schema"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"
import { createMediaAltText } from "@/lib/media-alt-text"

function getFieldErrors(
  issues: Array<{ path: PropertyKey[]; message: string }>
): ChurchLocationActionState["fieldErrors"] {
  const fieldErrors: ChurchLocationActionState["fieldErrors"] = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (field !== "name" && field !== "type" && field !== "googleMapsUrl") {
      continue
    }

    const key = field as ChurchLocationField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

async function updateChurchLocation(
  id: string,
  previousState: ChurchLocationActionState,
  formData: FormData
): Promise<ChurchLocationActionState> {
  await requirePermission("church.manage")

  const existingLocation = await prisma.churchLocation.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      coverImageUrl: true,

      images: {
        select: {
          id: true,
          caption: true,
        },
      },
    },
  })

  if (!existingLocation) {
    return {
      status: "error",
      message: "Lokasi tidak ditemukan.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  const parsed = churchLocationFormSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    type: String(formData.get("type") ?? ""),
    googleMapsUrl: String(formData.get("googleMapsUrl") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data yang diisi.",
      fieldErrors: getFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const slug = createChurchLocationSlug(parsed.data.name)
  const parsedSlug = churchLocationSlugSchema.safeParse(slug)

  if (!parsedSlug.success) {
    return {
      status: "error",
      message: "Periksa kembali nama lokasi.",
      fieldErrors: {
        name: parsedSlug.error.issues.map((issue) => issue.message),
      },
      submissionId: previousState.submissionId,
    }
  }

  const duplicateSlug = await prisma.churchLocation.findFirst({
    where: {
      slug,
      NOT: {
        id,
      },
    },
    select: {
      id: true,
    },
  })

  if (duplicateSlug) {
    return {
      status: "error",
      message: "Periksa kembali nama lokasi.",
      fieldErrors: {
        name: ["Nama lokasi sudah digunakan atau menghasilkan slug yang sama."],
      },
      submissionId: previousState.submissionId,
    }
  }

  try {
    await prisma.$transaction([
      prisma.churchLocation.update({
        where: {
          id,
        },
        data: {
          name: parsed.data.name,
          slug,
          type: parsed.data.type,
          googleMapsUrl: parsed.data.googleMapsUrl || null,

          coverAltText: existingLocation.coverImageUrl
            ? createMediaAltText({
                subjectName: parsed.data.name,
                variant: "cover",
              })
            : null,
        },
      }),

      ...existingLocation.images.map((image) =>
        prisma.churchLocationImage.update({
          where: {
            id: image.id,
          },
          data: {
            altText: createMediaAltText({
              subjectName: parsed.data.name,
              caption: image.caption,
            }),
          },
        })
      ),
    ])
  } catch (error) {
    console.error("UPDATE CHURCH LOCATION FAILED", error)

    return {
      status: "error",
      message: "Perubahan lokasi gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/lokasi")
  revalidatePath(`/admin/lokasi/${id}/edit`)

  updateTag(PUBLIC_CACHE_TAGS.worshipSchedules)
  updateTag(PUBLIC_CACHE_TAGS.churchLocations)
  updateTag(PUBLIC_CACHE_TAGS.churchServants)

  revalidatePath("/")
  revalidatePath("/jadwal-ibadah", "layout")
  revalidatePath("/lokasi", "layout")
  revalidatePath("/pelayan")

  return {
    status: "success",
    message: "Perubahan lokasi berhasil disimpan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { updateChurchLocation }
