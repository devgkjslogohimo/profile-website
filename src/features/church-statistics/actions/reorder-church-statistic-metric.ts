"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

type ReorderDirection = "up" | "down"

async function reorderChurchStatisticMetric(id: string, direction: ReorderDirection) {
  await requirePermission("church.manage")

  const metric = await prisma.churchStatisticMetric.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      snapshotId: true,
      category: true,
      sortOrder: true,
    },
  })

  if (!metric) {
    return {
      success: false,
      message: "Data statistik tidak ditemukan.",
    }
  }

  const neighbor =
    direction === "up"
      ? await prisma.churchStatisticMetric.findFirst({
          where: {
            snapshotId: metric.snapshotId,
            category: {
              equals: metric.category,
              mode: "insensitive",
            },
            sortOrder: {
              lt: metric.sortOrder,
            },
          },
          orderBy: {
            sortOrder: "desc",
          },
          select: {
            id: true,
            sortOrder: true,
          },
        })
      : await prisma.churchStatisticMetric.findFirst({
          where: {
            snapshotId: metric.snapshotId,
            category: {
              equals: metric.category,
              mode: "insensitive",
            },
            sortOrder: {
              gt: metric.sortOrder,
            },
          },
          orderBy: {
            sortOrder: "asc",
          },
          select: {
            id: true,
            sortOrder: true,
          },
        })

  if (!neighbor) {
    return {
      success: false,
      message:
        direction === "up"
          ? "Data sudah berada di urutan paling atas pada kategori ini."
          : "Data sudah berada di urutan paling bawah pada kategori ini.",
    }
  }

  try {
    await prisma.$transaction([
      prisma.churchStatisticMetric.update({
        where: {
          id: metric.id,
        },
        data: {
          sortOrder: neighbor.sortOrder,
        },
      }),

      prisma.churchStatisticMetric.update({
        where: {
          id: neighbor.id,
        },
        data: {
          sortOrder: metric.sortOrder,
        },
      }),
    ])
  } catch (error) {
    console.error("REORDER CHURCH STATISTIC METRIC FAILED", error)

    return {
      success: false,
      message: "Urutan data statistik gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath(`/admin/statistik/${metric.snapshotId}`)

  return {
    success: true,
    message: "Urutan data statistik berhasil diperbarui.",
  }
}

export { reorderChurchStatisticMetric }
