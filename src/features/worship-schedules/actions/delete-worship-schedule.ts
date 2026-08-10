"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { DeleteWorshipScheduleActionState } from "@/features/worship-schedules/lib/delete-action-state"
import { prisma } from "@/lib/db/prisma"

async function deleteWorshipSchedule(id: string): Promise<DeleteWorshipScheduleActionState> {
  await requirePermission("church.manage")

  const schedule = await prisma.worshipSchedule.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      isPublished: true,
    },
  })

  if (!schedule) {
    return {
      status: "error",
      message: "Jadwal ibadah tidak ditemukan.",
    }
  }

  if (schedule.isPublished) {
    return {
      status: "error",
      message: "Batalkan publikasi jadwal terlebih dahulu sebelum menghapus.",
    }
  }

  try {
    await prisma.worshipSchedule.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    console.error("DELETE WORSHIP SCHEDULE FAILED", error)

    return {
      status: "error",
      message: "Jadwal ibadah gagal dihapus. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/jadwal-ibadah")

  return {
    status: "success",
    message: "Jadwal ibadah berhasil dihapus.",
  }
}

export { deleteWorshipSchedule }
