"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

import type { ToggleChurchLocationActionState } from "../toggle-action-state"

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

  return {
    status: "success",
    message: nextIsActive
      ? `${location.name} berhasil diaktifkan.`
      : `${location.name} berhasil dinonaktifkan.`,
  }
}

export { toggleChurchLocation }
