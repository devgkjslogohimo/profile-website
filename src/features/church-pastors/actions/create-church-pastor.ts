"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  type ChurchPastorActionState,
  getChurchPastorFieldErrors,
} from "@/features/church-pastors/lib/church-pastor-action-state"
import { findOverlappingChurchPastor } from "@/features/church-pastors/lib/find-overlapping-church-pastor"
import { createChurchPastorSlug } from "@/features/church-pastors/lib/slug"
import { churchPastorFormSchema } from "@/features/church-pastors/schemas/church-pastor-schema"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"
import { normalizeGoogleDriveUrl } from "@/lib/google-drive"

async function createChurchPastor(
  previousState: ChurchPastorActionState,
  formData: FormData
): Promise<ChurchPastorActionState> {
  await requirePermission("church.manage")

  const parsed = churchPastorFormSchema.safeParse({
    fullName: String(formData.get("fullName") ?? ""),
    periodStart: String(formData.get("periodStart") ?? ""),
    periodEnd: String(formData.get("periodEnd") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    biography: String(formData.get("biography") ?? ""),
    photoUrl: String(formData.get("photoUrl") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data yang diisi.",
      fieldErrors: getChurchPastorFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const periodStart = new Date(`${parsed.data.periodStart}T00:00:00.000Z`)

  const periodEnd = parsed.data.periodEnd
    ? new Date(`${parsed.data.periodEnd}T00:00:00.000Z`)
    : null

  const overlappingPastor = await findOverlappingChurchPastor({
    periodStart,
    periodEnd,
  })

  if (overlappingPastor) {
    const message = `Periode pelayanan bertabrakan dengan periode ${overlappingPastor.fullName}.`

    return {
      status: "error",
      message: "Periksa kembali periode pelayanan.",
      fieldErrors: {
        periodStart: [message],
        periodEnd: [message],
      },
      submissionId: previousState.submissionId,
    }
  }

  try {
    const baseSlug = createChurchPastorSlug(parsed.data.fullName)

    if (!baseSlug) {
      return {
        status: "error",
        message: "Periksa kembali data pendeta.",
        fieldErrors: {
          fullName: ["Nama pendeta tidak dapat digunakan untuk membuat slug."],
        },
        submissionId: previousState.submissionId,
      }
    }

    let slug = baseSlug
    let suffix = 2

    while (
      await prisma.churchPastor.findUnique({
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

    const photoUrl = parsed.data.photoUrl ? normalizeGoogleDriveUrl(parsed.data.photoUrl) : null

    await prisma.churchPastor.create({
      data: {
        fullName: parsed.data.fullName,
        slug,
        periodStart,
        periodEnd,
        summary: parsed.data.summary || null,
        biography: parsed.data.biography || null,
        photoUrl,
        isActive: true,
      },
    })
  } catch (error) {
    console.error("CREATE CHURCH PASTOR FAILED", error)

    return {
      status: "error",
      message: "Pendeta gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/pendeta")

  updateTag(PUBLIC_CACHE_TAGS.churchServants)
  revalidatePath("/pelayan", "layout")

  return {
    status: "success",
    message: "Pendeta berhasil ditambahkan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createChurchPastor }
