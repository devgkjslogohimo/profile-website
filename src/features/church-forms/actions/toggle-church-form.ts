"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function toggleChurchForm(id: string) {
  await requirePermission("submissions.manage")

  const churchForm = await prisma.churchForm.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      isActive: true,
    },
  })

  if (!churchForm) {
    return {
      success: false,
      message: "Formulir tidak ditemukan.",
    }
  }

  try {
    await prisma.churchForm.update({
      where: {
        id,
      },
      data: {
        isActive: !churchForm.isActive,
      },
    })
  } catch (error) {
    console.error("TOGGLE CHURCH FORM FAILED", error)

    return {
      success: false,
      message: "Status formulir gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/pengajuan")
  revalidatePath(`/admin/pengajuan/${id}/edit`)

  return {
    success: true,
    message: churchForm.isActive
      ? `${churchForm.title} berhasil dinonaktifkan.`
      : `${churchForm.title} berhasil diaktifkan.`,
  }
}

export { toggleChurchForm }
