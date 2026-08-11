"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function toggleChurchPastor(id: string) {
  await requirePermission("church.manage")

  const pastor = await prisma.churchPastor.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      fullName: true,
      isActive: true,
    },
  })

  if (!pastor) {
    return {
      success: false,
      message: "Pendeta tidak ditemukan.",
    }
  }

  try {
    await prisma.churchPastor.update({
      where: {
        id,
      },
      data: {
        isActive: !pastor.isActive,
      },
    })
  } catch (error) {
    console.error("TOGGLE CHURCH PASTOR FAILED", error)

    return {
      success: false,
      message: "Status pendeta gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/pendeta")

  return {
    success: true,
    message: pastor.isActive
      ? `${pastor.fullName} berhasil dinonaktifkan.`
      : `${pastor.fullName} berhasil diaktifkan.`,
  }
}

export { toggleChurchPastor }
