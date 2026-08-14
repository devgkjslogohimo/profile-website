"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { ToggleChurchLocationActionState } from "@/features/church-locations/lib/toggle-action-state"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

async function toggleChurchLocation(
  id: string,
  _previousState: ToggleChurchLocationActionState,
  _formData: FormData
): Promise<ToggleChurchLocationActionState> {
  await requirePermission("church.manage")

  const location = await prisma.churchLocation.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
  })

  if (!location) {
    return {
      status: "error",
      message: "Lokasi tidak ditemukan.",
    }
  }

  const nextIsActive = !location.isActive

  try {
    await prisma.churchLocation.update({
      where: {
        id: location.id,
      },
      data: {
        isActive: nextIsActive,
      },
    })
  } catch (error) {
    console.error("TOGGLE CHURCH LOCATION FAILED", error)

    return {
      status: "error",
      message: "Status lokasi gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/lokasi")
  revalidatePath(`/admin/lokasi/${location.id}/edit`)

  updateTag(PUBLIC_CACHE_TAGS.worshipSchedules)
  updateTag(PUBLIC_CACHE_TAGS.churchLocations)
  updateTag(PUBLIC_CACHE_TAGS.churchServants)

  revalidatePath("/jadwal-ibadah", "layout")
  revalidatePath("/lokasi", "layout")
  revalidatePath("/pelayan")

  return {
    status: "success",
    message: nextIsActive
      ? `${location.name} berhasil diaktifkan.`
      : `${location.name} berhasil dinonaktifkan.`,
  }
}

export { toggleChurchLocation }
