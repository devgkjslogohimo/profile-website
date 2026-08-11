"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function deleteChurchStatisticMetric(id: string) {
  await requirePermission("church.manage")

  const metric = await prisma.churchStatisticMetric.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      label: true,
      snapshotId: true,
      isActive: true,
    },
  })

  if (!metric) {
    return {
      success: false,
      message: "Data statistik tidak ditemukan.",
    }
  }

  if (metric.isActive) {
    return {
      success: false,
      message: "Nonaktifkan data statistik terlebih dahulu sebelum menghapus.",
    }
  }

  try {
    await prisma.churchStatisticMetric.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    console.error("DELETE CHURCH STATISTIC METRIC FAILED", error)

    return {
      success: false,
      message: "Data statistik gagal dihapus. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/statistik")
  revalidatePath(`/admin/statistik/${metric.snapshotId}`)

  return {
    success: true,
    message: `${metric.label} berhasil dihapus.`,
  }
}

export { deleteChurchStatisticMetric }
