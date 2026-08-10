"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { DeleteBibleStudyScheduleActionState } from "@/features/bible-study-schedules/lib/delete-action-state"
import { prisma } from "@/lib/db/prisma"

async function deleteBibleStudySchedule(id: string): Promise<DeleteBibleStudyScheduleActionState> {
  await requirePermission("church.manage")

  const schedule = await prisma.bibleStudySchedule.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      groupName: true,
      isActive: true,
    },
  })

  if (!schedule) {
    return {
      status: "error",
      message: "Jadwal PA tidak ditemukan.",
    }
  }

  if (schedule.isActive) {
    return {
      status: "error",
      message: "Jadwal PA masih aktif. Nonaktifkan jadwal terlebih dahulu sebelum menghapus.",
    }
  }

  try {
    await prisma.bibleStudySchedule.delete({
      where: {
        id: schedule.id,
      },
    })
  } catch (error) {
    console.error("DELETE BIBLE STUDY SCHEDULE FAILED", error)

    return {
      status: "error",
      message: "Jadwal PA gagal dihapus. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/jadwal-pa")

  return {
    status: "success",
    message: `${schedule.groupName} berhasil dihapus.`,
  }
}

export { deleteBibleStudySchedule }
