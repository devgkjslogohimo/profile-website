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

async function updateChurchCouncilMember(
  id: string,
  previousState: ChurchCouncilMemberActionState,
  formData: FormData
): Promise<ChurchCouncilMemberActionState> {
  await requirePermission("church.manage")

  const existingMember = await prisma.churchCouncilMember.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      churchLocationId: true,
      sortOrder: true,
    },
  })

  if (!existingMember) {
    return {
      status: "error",
      message: "Anggota Majelis tidak ditemukan.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  const parsed = churchCouncilMemberFormSchema.safeParse({
    fullName: String(formData.get("fullName") ?? ""),
    position: String(formData.get("position") ?? ""),
    periodStart: String(formData.get("periodStart") ?? ""),
    periodEnd: String(formData.get("periodEnd") ?? ""),
    photoUrl: String(formData.get("photoUrl") ?? ""),
    churchLocationId: String(formData.get("churchLocationId") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data yang diisi.",
      fieldErrors: getChurchCouncilMemberFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const churchLocation = await prisma.churchLocation.findUnique({
    where: {
      id: parsed.data.churchLocationId,
    },

    select: {
      id: true,
      name: true,
      isActive: true,
    },
  })

  if (!churchLocation) {
    return {
      status: "error",
      message: "Periksa kembali lokasi pelayanan.",
      fieldErrors: {
        churchLocationId: ["Lokasi pelayanan tidak ditemukan."],
      },
      submissionId: previousState.submissionId,
    }
  }

  if (!churchLocation.isActive && churchLocation.id !== existingMember.churchLocationId) {
    return {
      status: "error",
      message: "Periksa kembali lokasi pelayanan.",
      fieldErrors: {
        churchLocationId: ["Lokasi nonaktif tidak dapat dipilih sebagai lokasi pelayanan baru."],
      },
      submissionId: previousState.submissionId,
    }
  }
  const periodStart = new Date(`${parsed.data.periodStart}T00:00:00.000Z`)

  const periodEnd = parsed.data.periodEnd
    ? new Date(`${parsed.data.periodEnd}T00:00:00.000Z`)
    : null

  try {
    const photoUrl = parsed.data.photoUrl ? normalizeGoogleDriveUrl(parsed.data.photoUrl) : null

    let sortOrder = existingMember.sortOrder

    if (existingMember.churchLocationId !== churchLocation.id) {
      const targetLocationOrder = await prisma.churchCouncilMember.aggregate({
        where: {
          churchLocationId: churchLocation.id,
        },

        _max: {
          sortOrder: true,
        },
      })

      sortOrder = (targetLocationOrder._max.sortOrder ?? 0) + 1
    }

    await prisma.churchCouncilMember.update({
      where: {
        id,
      },
      data: {
        churchLocationId: churchLocation.id,
        fullName: parsed.data.fullName,
        position: parsed.data.position,
        periodStart,
        periodEnd,
        photoUrl,
        sortOrder,
      },
    })
  } catch (error) {
    console.error("UPDATE CHURCH COUNCIL MEMBER FAILED", error)

    return {
      status: "error",
      message: "Perubahan anggota Majelis gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/majelis")
  revalidatePath(`/admin/majelis/${id}/edit`)

  updateTag(PUBLIC_CACHE_TAGS.churchLocations)
  updateTag(PUBLIC_CACHE_TAGS.churchServants)

  revalidatePath("/lokasi", "layout")
  revalidatePath("/pelayan")

  return {
    status: "success",
    message: "Perubahan anggota Majelis berhasil disimpan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { updateChurchCouncilMember }
