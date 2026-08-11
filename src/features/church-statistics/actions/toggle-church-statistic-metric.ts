"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

async function toggleChurchStatisticMetric(id: string) {
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

  try {
    await prisma.churchStatisticMetric.update({
      where: {
        id,
      },
      data: {
        isActive: !metric.isActive,
      },
    })
  } catch (error) {
    console.error("TOGGLE CHURCH STATISTIC METRIC FAILED", error)

    return {
      success: false,
      message: "Status data statistik gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/statistik")
  revalidatePath(`/admin/statistik/${metric.snapshotId}`)

  return {
    success: true,
    message: metric.isActive
      ? `${metric.label} berhasil dinonaktifkan.`
      : `${metric.label} berhasil diaktifkan.`,
  }
}

export { toggleChurchStatisticMetric }
