"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { createScheduleDate } from "@/features/worship-schedules/lib/date-time"
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

async function createWorshipSchedule(
  previousState: WorshipScheduleActionState,
  formData: FormData
): Promise<WorshipScheduleActionState> {
  await requirePermission("church.manage")

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

  const duplicateSchedule = await prisma.worshipSchedule.findUnique({
    where: {
      date,
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
    await prisma.worshipSchedule.create({
      data: {
        date,
        isPublished: false,
      },
    })
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

    console.error("CREATE WORSHIP SCHEDULE FAILED", error)

    return {
      status: "error",
      message: "Jadwal ibadah gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/jadwal-ibadah")

  return {
    status: "success",
    message: "Jadwal ibadah berhasil ditambahkan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createWorshipSchedule }
