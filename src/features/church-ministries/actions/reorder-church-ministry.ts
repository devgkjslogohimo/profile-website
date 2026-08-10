"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

type ReorderChurchMinistryDirection = "up" | "down"

type ReorderChurchMinistryResult = {
  status: "success" | "error"
  message: string
}

async function reorderChurchMinistry(
  id: string,
  direction: ReorderChurchMinistryDirection
): Promise<ReorderChurchMinistryResult> {
  await requirePermission("church.manage")

  const ministry = await prisma.churchMinistry.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  })

  if (!ministry) {
    return {
      status: "error",
      message: "Pelayanan tidak ditemukan.",
    }
  }

  const ministries = await prisma.churchMinistry.findMany({
    select: {
      id: true,
      sortOrder: true,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        name: "asc",
      },
    ],
  })

  const currentIndex = ministries.findIndex((item) => item.id === ministry.id)

  if (currentIndex === -1) {
    return {
      status: "error",
      message: "Pelayanan tidak ditemukan dalam daftar.",
    }
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

  if (targetIndex < 0 || targetIndex >= ministries.length) {
    return {
      status: "success",
      message: "Urutan pelayanan tidak berubah.",
    }
  }

  const current = ministries[currentIndex]
  const target = ministries[targetIndex]

  try {
    await prisma.$transaction([
      prisma.churchMinistry.update({
        where: {
          id: current.id,
        },
        data: {
          sortOrder: target.sortOrder,
        },
      }),

      prisma.churchMinistry.update({
        where: {
          id: target.id,
        },
        data: {
          sortOrder: current.sortOrder,
        },
      }),
    ])
  } catch (error) {
    console.error("REORDER CHURCH MINISTRY FAILED", error)

    return {
      status: "error",
      message: "Urutan pelayanan gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/pelayanan")

  return {
    status: "success",
    message: "Urutan pelayanan berhasil diperbarui.",
  }
}

export { reorderChurchMinistry }
export type { ReorderChurchMinistryDirection, ReorderChurchMinistryResult }
