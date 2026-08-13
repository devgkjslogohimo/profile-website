"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  createScheduleDate,
  moveDateTimeToScheduleDate,
} from "@/features/worship-schedules/lib/date-time"
import { worshipScheduleFormSchema } from "@/features/worship-schedules/schemas/worship-schedule-schema"
import { prisma } from "@/lib/db/prisma"

type DuplicateWorshipScheduleResult =
  | {
      status: "success"
      message: string
      scheduleId: string
    }
  | {
      status: "error"
      message: string
    }

async function duplicateWorshipSchedule(
  sourceScheduleId: string,
  targetDateValue: string
): Promise<DuplicateWorshipScheduleResult> {
  await requirePermission("church.manage")

  const parsed = worshipScheduleFormSchema.safeParse({
    date: targetDateValue,
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Pilih tanggal tujuan yang valid.",
    }
  }

  const targetDate = createScheduleDate(parsed.data.date)

  const sourceSchedule = await prisma.worshipSchedule.findUnique({
    where: {
      id: sourceScheduleId,
    },
    select: {
      id: true,

      services: {
        select: {
          id: true,
          name: true,
          churchLocationId: true,
          startsAt: true,
          sortOrder: true,
          languageOverride: true,
          assignments: {
            select: {
              worshipServiceRoleId: true,
              personName: true,
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
          },
        },

        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            startsAt: "asc",
          },
        ],
      },
    },
  })

  if (!sourceSchedule) {
    return {
      status: "error",
      message: "Jadwal sumber tidak ditemukan.",
    }
  }

  const existingSchedule = await prisma.worshipSchedule.findUnique({
    where: {
      date: targetDate,
    },
    select: {
      id: true,
    },
  })

  if (existingSchedule) {
    return {
      status: "error",
      message: "Tanggal tujuan sudah memiliki jadwal ibadah.",
    }
  }

  try {
    const newSchedule = await prisma.$transaction(async (tx) => {
      const schedule = await tx.worshipSchedule.create({
        data: {
          date: targetDate,
          isPublished: false,
          publishedAt: null,
        },
        select: {
          id: true,
        },
      })

      for (const service of sourceSchedule.services) {
        const newService = await tx.worshipService.create({
          data: {
            worshipScheduleId: schedule.id,
            churchLocationId: service.churchLocationId,
            name: service.name,
            startsAt: moveDateTimeToScheduleDate(service.startsAt, targetDate),
            sortOrder: service.sortOrder,
          },
          select: {
            id: true,
          },
        })

        if (service.assignments.length > 0) {
          await tx.worshipServiceAssignment.createMany({
            data: service.assignments.map((assignment) => ({
              worshipServiceId: newService.id,
              worshipServiceRoleId: assignment.worshipServiceRoleId,
              personName: assignment.personName,
              sortOrder: assignment.sortOrder,
            })),
          })
        }
      }

      return schedule
    })

    revalidatePath("/admin/jadwal-ibadah")

    return {
      status: "success",
      message: "Jadwal ibadah berhasil disalin.",
      scheduleId: newSchedule.id,
    }
  } catch (error) {
    console.error("DUPLICATE WORSHIP SCHEDULE FAILED", error)

    return {
      status: "error",
      message: "Jadwal ibadah gagal disalin. Silakan coba kembali.",
    }
  }
}

export { duplicateWorshipSchedule }
