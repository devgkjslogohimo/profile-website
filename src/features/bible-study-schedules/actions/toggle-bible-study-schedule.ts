"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { ToggleBibleStudyScheduleActionState } from "@/features/bible-study-schedules/lib/toggle-action-state"
import { prisma } from "@/lib/db/prisma"

async function toggleBibleStudySchedule(
  id: string,
  _previousState: ToggleBibleStudyScheduleActionState,
  _formData: FormData
): Promise<ToggleBibleStudyScheduleActionState> {
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

  const nextIsActive = !schedule.isActive

  try {
    await prisma.bibleStudySchedule.update({
      where: {
        id: schedule.id,
      },
      data: {
        isActive: nextIsActive,
      },
    })
  } catch (error) {
    console.error("TOGGLE BIBLE STUDY SCHEDULE FAILED", error)

    return {
      status: "error",
      message: "Status Jadwal PA gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/jadwal-pa")
  revalidatePath(`/admin/jadwal-pa/${schedule.id}/edit`)

  return {
    status: "success",
    message: nextIsActive
      ? `${schedule.groupName} berhasil diaktifkan.`
      : `${schedule.groupName} berhasil dinonaktifkan.`,
  }
}

export { toggleBibleStudySchedule }
