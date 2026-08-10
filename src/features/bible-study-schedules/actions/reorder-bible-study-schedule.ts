"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

type ReorderDirection = "up" | "down"

type ReorderBibleStudyScheduleResult = {
  status: "success" | "error"
  message: string
}

async function reorderBibleStudySchedule(
  id: string,
  direction: ReorderDirection
): Promise<ReorderBibleStudyScheduleResult> {
  await requirePermission("church.manage")

  const schedule = await prisma.bibleStudySchedule.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      dayOfWeek: true,
    },
  })

  if (!schedule) {
    return {
      status: "error",
      message: "Jadwal PA tidak ditemukan.",
    }
  }

  const schedules = await prisma.bibleStudySchedule.findMany({
    where: {
      dayOfWeek: schedule.dayOfWeek,
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

  const currentIndex = schedules.findIndex((item) => item.id === id)

  if (currentIndex === -1) {
    return {
      status: "error",
      message: "Jadwal PA tidak ditemukan dalam kelompok hari.",
    }
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

  if (targetIndex < 0 || targetIndex >= schedules.length) {
    return {
      status: "success",
      message: "Urutan Jadwal PA tidak berubah.",
    }
  }

  const current = schedules[currentIndex]
  const target = schedules[targetIndex]

  try {
    await prisma.$transaction([
      prisma.bibleStudySchedule.update({
        where: {
          id: current.id,
        },
        data: {
          sortOrder: target.sortOrder,
        },
      }),

      prisma.bibleStudySchedule.update({
        where: {
          id: target.id,
        },
        data: {
          sortOrder: current.sortOrder,
        },
      }),
    ])
  } catch (error) {
    console.error("REORDER BIBLE STUDY SCHEDULE FAILED", error)

    return {
      status: "error",
      message: "Urutan Jadwal PA gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/jadwal-pa")

  return {
    status: "success",
    message: "Urutan Jadwal PA berhasil diperbarui.",
  }
}

export { reorderBibleStudySchedule }
export type { ReorderDirection }
