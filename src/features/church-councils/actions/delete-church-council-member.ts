"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function deleteChurchCouncilMember(id: string) {
  await requirePermission("church.manage")

  const member = await prisma.churchCouncilMember.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      fullName: true,
      isActive: true,
    },
  })

  if (!member) {
    return {
      success: false,
      message: "Anggota Majelis tidak ditemukan.",
    }
  }

  if (member.isActive) {
    return {
      success: false,
      message: "Nonaktifkan anggota Majelis terlebih dahulu sebelum menghapus.",
    }
  }

  try {
    await prisma.churchCouncilMember.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    console.error("DELETE CHURCH COUNCIL MEMBER FAILED", error)

    return {
      success: false,
      message: "Anggota Majelis gagal dihapus. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/majelis")

  return {
    success: true,
    message: `${member.fullName} berhasil dihapus.`,
  }
}

export { deleteChurchCouncilMember }
