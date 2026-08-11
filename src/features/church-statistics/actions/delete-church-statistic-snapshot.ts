"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function deleteChurchStatisticSnapshot(id: string) {
  await requirePermission("church.manage")

  const snapshot = await prisma.churchStatisticSnapshot.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      isActive: true,
      _count: {
        select: {
          metrics: true,
        },
      },
    },
  })

  if (!snapshot) {
    return {
      success: false,
      message: "Snapshot statistik tidak ditemukan.",
    }
  }

  if (snapshot.isActive) {
    return {
      success: false,
      message: "Nonaktifkan snapshot statistik terlebih dahulu sebelum menghapus.",
    }
  }

  if (snapshot._count.metrics > 0) {
    return {
      success: false,
      message: "Snapshot statistik tidak dapat dihapus karena masih memiliki data statistik.",
    }
  }

  try {
    await prisma.churchStatisticSnapshot.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    console.error("DELETE CHURCH STATISTIC SNAPSHOT FAILED", error)

    return {
      success: false,
      message: "Snapshot statistik gagal dihapus. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/statistik")

  return {
    success: true,
    message: `${snapshot.title} berhasil dihapus.`,
  }
}

export { deleteChurchStatisticSnapshot }
