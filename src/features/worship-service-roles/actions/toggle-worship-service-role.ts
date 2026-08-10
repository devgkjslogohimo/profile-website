"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { ToggleWorshipServiceRoleActionState } from "@/features/worship-service-roles/lib/toggle-action-state"
import { prisma } from "@/lib/db/prisma"

async function toggleWorshipServiceRole(
  id: string,
  _previousState: ToggleWorshipServiceRoleActionState,
  _formData: FormData
): Promise<ToggleWorshipServiceRoleActionState> {
  await requirePermission("church.manage")

  const role = await prisma.worshipServiceRole.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
  })

  if (!role) {
    return {
      status: "error",
      message: "Peran petugas tidak ditemukan.",
    }
  }

  const nextIsActive = !role.isActive

  try {
    await prisma.worshipServiceRole.update({
      where: {
        id: role.id,
      },
      data: {
        isActive: nextIsActive,
      },
    })
  } catch (error) {
    console.error("TOGGLE WORSHIP SERVICE ROLE FAILED", error)

    return {
      status: "error",
      message: "Status peran petugas gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/peran-petugas-ibadah")
  revalidatePath(`/admin/peran-petugas-ibadah/${role.id}/edit`)

  return {
    status: "success",
    message: nextIsActive
      ? `${role.name} berhasil diaktifkan.`
      : `${role.name} berhasil dinonaktifkan.`,
  }
}

export { toggleWorshipServiceRole }
