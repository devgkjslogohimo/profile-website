"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function deleteChurchForm(id: string) {
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

  if (churchForm.isActive) {
    return {
      success: false,
      message: "Nonaktifkan formulir terlebih dahulu sebelum menghapus.",
    }
  }

  try {
    await prisma.churchForm.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    console.error("DELETE CHURCH FORM FAILED", error)

    return {
      success: false,
      message: "Formulir gagal dihapus. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/pengajuan")

  return {
    success: true,
    message: `${churchForm.title} berhasil dihapus.`,
  }
}

export { deleteChurchForm }
