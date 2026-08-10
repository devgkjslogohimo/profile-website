"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type {
  ReorderActionResult,
  ReorderDirection,
} from "@/features/worship-schedules/lib/reorder-action-state"
import { prisma } from "@/lib/db/prisma"

async function reorderWorshipServiceAssignment(
  id: string,
  direction: ReorderDirection
): Promise<ReorderActionResult> {
  await requirePermission("church.manage")

  const assignment = await prisma.worshipServiceAssignment.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      worshipServiceId: true,
      worshipService: {
        select: {
          worshipScheduleId: true,
          worshipSchedule: {
            select: {
              isPublished: true,
            },
          },
        },
      },
    },
  })

  if (!assignment) {
    return {
      status: "error",
      message: "Petugas ibadah tidak ditemukan.",
    }
  }

  if (assignment.worshipService.worshipSchedule.isPublished) {
    return {
      status: "error",
      message: "Batalkan publikasi jadwal terlebih dahulu untuk mengubah urutan petugas.",
    }
  }

  const assignments = await prisma.worshipServiceAssignment.findMany({
    where: {
      worshipServiceId: assignment.worshipServiceId,
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
        id: "asc",
      },
    ],
  })

  const currentIndex = assignments.findIndex((item) => item.id === id)

  if (currentIndex === -1) {
    return {
      status: "error",
      message: "Petugas tidak ditemukan dalam ibadah.",
    }
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

  if (targetIndex < 0 || targetIndex >= assignments.length) {
    return {
      status: "success",
      message: "Urutan petugas tidak berubah.",
    }
  }

  const current = assignments[currentIndex]
  const target = assignments[targetIndex]

  try {
    await prisma.$transaction([
      prisma.worshipServiceAssignment.update({
        where: {
          id: current.id,
        },
        data: {
          sortOrder: target.sortOrder,
        },
      }),
      prisma.worshipServiceAssignment.update({
        where: {
          id: target.id,
        },
        data: {
          sortOrder: current.sortOrder,
        },
      }),
    ])
  } catch (error) {
    console.error("REORDER WORSHIP SERVICE ASSIGNMENT FAILED", error)

    return {
      status: "error",
      message: "Urutan petugas gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath(`/admin/jadwal-ibadah/${assignment.worshipService.worshipScheduleId}`)

  return {
    status: "success",
    message: "Urutan petugas berhasil diperbarui.",
  }
}

export { reorderWorshipServiceAssignment }
