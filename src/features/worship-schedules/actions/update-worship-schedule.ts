"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  createScheduleDate,
  moveDateTimeToScheduleDate,
} from "@/features/worship-schedules/lib/date-time"
import { hasPrismaErrorCode } from "@/features/worship-schedules/lib/prisma-error"
import {
  type WorshipScheduleActionState,
  type WorshipScheduleField,
} from "@/features/worship-schedules/lib/schedule-action-state"
import { worshipScheduleFormSchema } from "@/features/worship-schedules/schemas/worship-schedule-schema"
import { prisma } from "@/lib/db/prisma"

function getFieldErrors(
  issues: Array<{ path: PropertyKey[]; message: string }>
): WorshipScheduleActionState["fieldErrors"] {
  const fieldErrors: WorshipScheduleActionState["fieldErrors"] = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (field !== "date") {
      continue
    }

    const key = field as WorshipScheduleField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

async function updateWorshipSchedule(
  id: string,
  previousState: WorshipScheduleActionState,
  formData: FormData
): Promise<WorshipScheduleActionState> {
  await requirePermission("church.manage")

  const schedule = await prisma.worshipSchedule.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      date: true,
      isPublished: true,
      services: {
        select: {
          id: true,
          startsAt: true,
        },
      },
    },
  })

  if (!schedule) {
    return {
      status: "error",
      message: "Jadwal ibadah tidak ditemukan.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  if (schedule.isPublished) {
    return {
      status: "error",
      message: "Batalkan publikasi jadwal terlebih dahulu sebelum mengubah tanggal.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  const parsed = worshipScheduleFormSchema.safeParse({
    date: String(formData.get("date") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data yang diisi.",
      fieldErrors: getFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const date = createScheduleDate(parsed.data.date)

  const duplicateSchedule = await prisma.worshipSchedule.findFirst({
    where: {
      date,
      NOT: {
        id,
      },
    },
    select: {
      id: true,
    },
  })

  if (duplicateSchedule) {
    return {
      status: "error",
      message: "Periksa kembali tanggal jadwal.",
      fieldErrors: {
        date: ["Jadwal ibadah untuk tanggal tersebut sudah tersedia."],
      },
      submissionId: previousState.submissionId,
    }
  }

  try {
    await prisma.$transaction([
      prisma.worshipSchedule.update({
        where: {
          id,
        },
        data: {
          date,
        },
      }),
      ...schedule.services.map((service) =>
        prisma.worshipService.update({
          where: {
            id: service.id,
          },
          data: {
            startsAt: moveDateTimeToScheduleDate(service.startsAt, date),
          },
        })
      ),
    ])
  } catch (error) {
    if (hasPrismaErrorCode(error, "P2002")) {
      return {
        status: "error",
        message: "Periksa kembali tanggal jadwal.",
        fieldErrors: {
          date: ["Jadwal ibadah untuk tanggal tersebut sudah tersedia."],
        },
        submissionId: previousState.submissionId,
      }
    }

    console.error("UPDATE WORSHIP SCHEDULE FAILED", error)

    return {
      status: "error",
      message: "Perubahan jadwal ibadah gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/jadwal-ibadah")
  revalidatePath(`/admin/jadwal-ibadah/${id}`)

  return {
    status: "success",
    message: "Tanggal jadwal ibadah berhasil diperbarui.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { updateWorshipSchedule }
