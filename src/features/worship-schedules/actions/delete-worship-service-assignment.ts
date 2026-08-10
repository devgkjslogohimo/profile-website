"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { DeleteWorshipServiceAssignmentActionState } from "@/features/worship-schedules/lib/delete-action-state"
import { prisma } from "@/lib/db/prisma"

async function deleteWorshipServiceAssignment(
  id: string
): Promise<DeleteWorshipServiceAssignmentActionState> {
  await requirePermission("church.manage")

  const assignment = await prisma.worshipServiceAssignment.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      personName: true,
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
      message: "Batalkan publikasi jadwal terlebih dahulu sebelum menghapus petugas.",
    }
  }

  try {
    await prisma.worshipServiceAssignment.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    console.error("DELETE WORSHIP SERVICE ASSIGNMENT FAILED", error)

    return {
      status: "error",
      message: "Petugas ibadah gagal dihapus. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/jadwal-ibadah")
  revalidatePath(`/admin/jadwal-ibadah/${assignment.worshipService.worshipScheduleId}`)

  return {
    status: "success",
    message: `${assignment.personName} berhasil dihapus dari petugas ibadah.`,
  }
}

export { deleteWorshipServiceAssignment }
