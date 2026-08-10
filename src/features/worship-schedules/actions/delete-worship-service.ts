"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { DeleteWorshipServiceActionState } from "@/features/worship-schedules/lib/delete-action-state"
import { prisma } from "@/lib/db/prisma"

async function deleteWorshipService(id: string): Promise<DeleteWorshipServiceActionState> {
  await requirePermission("church.manage")

  const service = await prisma.worshipService.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
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
      message: "Batalkan publikasi jadwal terlebih dahulu sebelum menghapus ibadah.",
    }
  }

  try {
    await prisma.worshipService.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    console.error("DELETE WORSHIP SERVICE FAILED", error)

    return {
      status: "error",
      message: "Ibadah gagal dihapus. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/jadwal-ibadah")
  revalidatePath(`/admin/jadwal-ibadah/${service.worshipScheduleId}`)

  return {
    status: "success",
    message: `${service.name} berhasil dihapus dari jadwal.`,
  }
}

export { deleteWorshipService }
