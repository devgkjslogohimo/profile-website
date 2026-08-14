"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  type ChurchCouncilMemberActionState,
  getChurchCouncilMemberFieldErrors,
} from "@/features/church-councils/lib/church-council-action-state"
import { churchCouncilMemberFormSchema } from "@/features/church-councils/schemas/church-council-member-schema"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"
import { normalizeGoogleDriveUrl } from "@/lib/google-drive"

async function createChurchCouncilMember(
  previousState: ChurchCouncilMemberActionState,
  formData: FormData
): Promise<ChurchCouncilMemberActionState> {
  await requirePermission("church.manage")

  const parsed = churchCouncilMemberFormSchema.safeParse({
    fullName: String(formData.get("fullName") ?? ""),
    churchLocationId: String(formData.get("churchLocationId") ?? ""),
    position: String(formData.get("position") ?? ""),
    periodStart: String(formData.get("periodStart") ?? ""),
    periodEnd: String(formData.get("periodEnd") ?? ""),
    photoUrl: String(formData.get("photoUrl") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data yang diisi.",
      fieldErrors: getChurchCouncilMemberFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const churchLocation = await prisma.churchLocation.findFirst({
    where: {
      id: parsed.data.churchLocationId,
      isActive: true,
    },

    select: {
      id: true,
      name: true,
    },
  })

  if (!churchLocation) {
    return {
      status: "error",
      message: "Periksa kembali lokasi pelayanan.",
      fieldErrors: {
        churchLocationId: ["Lokasi pelayanan tidak ditemukan atau sudah nonaktif."],
      },
      submissionId: previousState.submissionId,
    }
  }

  const periodStart = new Date(`${parsed.data.periodStart}T00:00:00.000Z`)

  const periodEnd = parsed.data.periodEnd
    ? new Date(`${parsed.data.periodEnd}T00:00:00.000Z`)
    : null

  try {
    const lastMember = await prisma.churchCouncilMember.aggregate({
      where: {
        churchLocationId: churchLocation.id,
      },

      _max: {
        sortOrder: true,
      },
    })

    const photoUrl = parsed.data.photoUrl ? normalizeGoogleDriveUrl(parsed.data.photoUrl) : null

    await prisma.churchCouncilMember.create({
      data: {
        churchLocationId: churchLocation.id,
        fullName: parsed.data.fullName,
        position: parsed.data.position,
        periodStart,
        periodEnd,
        photoUrl,
        sortOrder: (lastMember._max.sortOrder ?? 0) + 1,
        isActive: true,
      },
    })
  } catch (error) {
    console.error("CREATE CHURCH COUNCIL MEMBER FAILED", error)

    return {
      status: "error",
      message: "Anggota Majelis gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/majelis")

  updateTag(PUBLIC_CACHE_TAGS.churchLocations)
  updateTag(PUBLIC_CACHE_TAGS.churchServants)

  revalidatePath("/lokasi", "layout")
  revalidatePath("/pelayan")

  return {
    status: "success",
    message: "Anggota Majelis berhasil ditambahkan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createChurchCouncilMember }
