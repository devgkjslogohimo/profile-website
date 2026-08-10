"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type {
  ReorderActionResult,
  ReorderDirection,
} from "@/features/worship-schedules/lib/reorder-action-state"
import { prisma } from "@/lib/db/prisma"

async function reorderWorshipService(
  id: string,
  direction: ReorderDirection
): Promise<ReorderActionResult> {
  await requirePermission("church.manage")

  const service = await prisma.worshipService.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      worshipScheduleId: true,
      worshipSchedule: {
        select: {
          isPublished: true,
        },
      },
    },
  })

  if (!service) {
    return {
      status: "error",
      message: "Ibadah tidak ditemukan.",
    }
  }

  if (service.worshipSchedule.isPublished) {
    return {
      status: "error",
      message: "Batalkan publikasi jadwal terlebih dahulu untuk mengubah urutan.",
    }
  }

  const services = await prisma.worshipService.findMany({
    where: {
      worshipScheduleId: service.worshipScheduleId,
    },
    select: {
      id: true,
      sortOrder: true,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        startsAt: "asc",
      },
    ],
  })

  const currentIndex = services.findIndex((item) => item.id === id)

  if (currentIndex === -1) {
    return {
      status: "error",
      message: "Ibadah tidak ditemukan dalam jadwal.",
    }
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

  if (targetIndex < 0 || targetIndex >= services.length) {
    return {
      status: "success",
      message: "Urutan ibadah tidak berubah.",
    }
  }

  const current = services[currentIndex]
  const target = services[targetIndex]

  try {
    await prisma.$transaction([
      prisma.worshipService.update({
        where: {
          id: current.id,
        },
        data: {
          sortOrder: target.sortOrder,
        },
      }),
      prisma.worshipService.update({
        where: {
          id: target.id,
        },
        data: {
          sortOrder: current.sortOrder,
        },
      }),
    ])
  } catch (error) {
    console.error("REORDER WORSHIP SERVICE FAILED", error)

    return {
      status: "error",
      message: "Urutan ibadah gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/jadwal-ibadah")
  revalidatePath(`/admin/jadwal-ibadah/${service.worshipScheduleId}`)

  return {
    status: "success",
    message: "Urutan ibadah berhasil diperbarui.",
  }
}

export { reorderWorshipService }
