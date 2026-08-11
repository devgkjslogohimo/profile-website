"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function toggleChurchStatisticSnapshot(id: string) {
  await requirePermission("church.manage")

  const snapshot = await prisma.churchStatisticSnapshot.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      isActive: true,
    },
  })

  if (!snapshot) {
    return {
      success: false,
      message: "Snapshot statistik tidak ditemukan.",
    }
  }

  try {
    await prisma.churchStatisticSnapshot.update({
      where: {
        id,
      },
      data: {
        isActive: !snapshot.isActive,
      },
    })
  } catch (error) {
    console.error("TOGGLE CHURCH STATISTIC SNAPSHOT FAILED", error)

    return {
      success: false,
      message: "Status snapshot statistik gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/statistik")
  revalidatePath(`/admin/statistik/${id}`)
  revalidatePath(`/admin/statistik/${id}/edit`)

  return {
    success: true,
    message: snapshot.isActive
      ? `${snapshot.title} berhasil dinonaktifkan.`
      : `${snapshot.title} berhasil diaktifkan.`,
  }
}

export { toggleChurchStatisticSnapshot }
