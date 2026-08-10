"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { WorshipSchedulePublicationActionState } from "@/features/worship-schedules/lib/publication-action-state"
import { prisma } from "@/lib/db/prisma"

async function unpublishWorshipSchedule(
  id: string,
  _previousState: WorshipSchedulePublicationActionState,
  _formData: FormData
): Promise<WorshipSchedulePublicationActionState> {
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

  if (!schedule.isPublished) {
    return {
      status: "success",
      message: "Jadwal ibadah sudah berstatus draft.",
    }
  }

  try {
    await prisma.worshipSchedule.update({
      where: {
        id,
      },
      data: {
        isPublished: false,
      },
    })
  } catch (error) {
    console.error("UNPUBLISH WORSHIP SCHEDULE FAILED", error)

    return {
      status: "error",
      message: "Publikasi jadwal ibadah gagal dibatalkan. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/jadwal-ibadah")
  revalidatePath(`/admin/jadwal-ibadah/${id}`)
  revalidatePath("/")

  return {
    status: "success",
    message: "Jadwal ibadah dikembalikan menjadi draft.",
  }
}

export { unpublishWorshipSchedule }
