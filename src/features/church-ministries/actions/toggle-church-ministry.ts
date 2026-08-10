"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { ToggleChurchMinistryActionState } from "@/features/church-ministries/lib/toggle-action-state"
import { prisma } from "@/lib/db/prisma"

async function toggleChurchMinistry(
  id: string,
  _previousState: ToggleChurchMinistryActionState,
  _formData: FormData
): Promise<ToggleChurchMinistryActionState> {
  await requirePermission("church.manage")

  const ministry = await prisma.churchMinistry.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
  })

  if (!ministry) {
    return {
      status: "error",
      message: "Pelayanan tidak ditemukan.",
    }
  }

  const nextIsActive = !ministry.isActive

  try {
    await prisma.churchMinistry.update({
      where: {
        id: ministry.id,
      },
      data: {
        isActive: nextIsActive,
      },
    })
  } catch (error) {
    console.error("TOGGLE CHURCH MINISTRY FAILED", error)

    return {
      status: "error",
      message: "Status pelayanan gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/pelayanan")
  revalidatePath(`/admin/pelayanan/${ministry.id}/edit`)

  return {
    status: "success",
    message: nextIsActive
      ? `${ministry.name} berhasil diaktifkan.`
      : `${ministry.name} berhasil dinonaktifkan.`,
  }
}

export { toggleChurchMinistry }
