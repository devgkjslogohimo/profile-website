"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { combineScheduleDateAndWibTime } from "@/features/worship-schedules/lib/date-time"
import { hasPrismaErrorCode } from "@/features/worship-schedules/lib/prisma-error"
import {
  type WorshipServiceActionState,
  type WorshipServiceField,
} from "@/features/worship-schedules/lib/service-action-state"
import { worshipServiceFormSchema } from "@/features/worship-schedules/schemas/worship-service-schema"
import { prisma } from "@/lib/db/prisma"

function getFieldErrors(
  issues: Array<{ path: PropertyKey[]; message: string }>
): WorshipServiceActionState["fieldErrors"] {
  const fieldErrors: WorshipServiceActionState["fieldErrors"] = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (
      field !== "name" &&
      field !== "churchLocationId" &&
      field !== "startTime" &&
      field !== "language"
    ) {
      continue
    }

    const key = field as WorshipServiceField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

async function createWorshipService(
  worshipScheduleId: string,
  previousState: WorshipServiceActionState,
  formData: FormData
): Promise<WorshipServiceActionState> {
  await requirePermission("church.manage")

  const parsed = worshipServiceFormSchema.safeParse({
    name: String(formData.get("name") ?? ""),

    churchLocationId: String(formData.get("churchLocationId") ?? ""),

    startTime: String(formData.get("startTime") ?? ""),

    language: String(formData.get("language") ?? "AUTO"),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data yang diisi.",
      fieldErrors: getFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const schedule = await prisma.worshipSchedule.findUnique({
    where: {
      id: worshipScheduleId,
    },
    select: {
      id: true,
      date: true,
      isPublished: true,
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
      message: "Batalkan publikasi jadwal terlebih dahulu sebelum menambah ibadah.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  const location = await prisma.churchLocation.findUnique({
    where: {
      id: parsed.data.churchLocationId,
    },
    select: {
      id: true,
      isActive: true,
    },
  })

  if (!location || !location.isActive) {
    return {
      status: "error",
      message: "Periksa kembali lokasi ibadah.",
      fieldErrors: {
        churchLocationId: ["Lokasi ibadah tidak tersedia atau sudah nonaktif."],
      },
      submissionId: previousState.submissionId,
    }
  }

  const startsAt = combineScheduleDateAndWibTime(schedule.date, parsed.data.startTime)

  const duplicateService = await prisma.worshipService.findFirst({
    where: {
      worshipScheduleId,
      churchLocationId: parsed.data.churchLocationId,
      startsAt,
    },
    select: {
      id: true,
    },
  })

  if (duplicateService) {
    return {
      status: "error",
      message: "Periksa kembali lokasi dan jam ibadah.",
      fieldErrors: {
        startTime: ["Lokasi tersebut sudah memiliki ibadah pada jam yang sama."],
      },
      submissionId: previousState.submissionId,
    }
  }

  try {
    const lastService = await prisma.worshipService.aggregate({
      where: {
        worshipScheduleId,
      },
      _max: {
        sortOrder: true,
      },
    })

    const sortOrder = (lastService._max.sortOrder ?? 0) + 1

    await prisma.worshipService.create({
      data: {
        worshipScheduleId,
        churchLocationId: parsed.data.churchLocationId,
        name: parsed.data.name,
        startsAt,
        sortOrder,
        languageOverride: parsed.data.language === "AUTO" ? null : parsed.data.language,
      },
    })
  } catch (error) {
    if (hasPrismaErrorCode(error, "P2002")) {
      return {
        status: "error",
        message: "Periksa kembali lokasi dan jam ibadah.",
        fieldErrors: {
          startTime: ["Lokasi tersebut sudah memiliki ibadah pada jam yang sama."],
        },
        submissionId: previousState.submissionId,
      }
    }

    console.error("CREATE WORSHIP SERVICE FAILED", error)

    return {
      status: "error",
      message: "Ibadah gagal ditambahkan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/jadwal-ibadah")
  revalidatePath(`/admin/jadwal-ibadah/${worshipScheduleId}`)

  return {
    status: "success",
    message: "Ibadah berhasil ditambahkan ke jadwal.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createWorshipService }
