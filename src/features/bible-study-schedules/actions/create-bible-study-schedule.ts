"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type {
  BibleStudyScheduleActionState,
  BibleStudyScheduleField,
} from "@/features/bible-study-schedules/lib/action-state"
import { bibleStudyScheduleFormSchema } from "@/features/bible-study-schedules/schemas/bible-study-schedule-schema"
import { prisma } from "@/lib/db/prisma"

function getFieldErrors(
  issues: Array<{ path: PropertyKey[]; message: string }>
): BibleStudyScheduleActionState["fieldErrors"] {
  const fieldErrors: BibleStudyScheduleActionState["fieldErrors"] = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (
      field !== "groupName" &&
      field !== "dayOfWeek" &&
      field !== "startTime" &&
      field !== "location" &&
      field !== "leaderName" &&
      field !== "notes"
    ) {
      continue
    }

    const key = field as BibleStudyScheduleField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

async function createBibleStudySchedule(
  previousState: BibleStudyScheduleActionState,
  formData: FormData
): Promise<BibleStudyScheduleActionState> {
  await requirePermission("church.manage")

  const parsed = bibleStudyScheduleFormSchema.safeParse({
    groupName: String(formData.get("groupName") ?? ""),
    dayOfWeek: String(formData.get("dayOfWeek") ?? ""),
    startTime: String(formData.get("startTime") ?? ""),
    location: String(formData.get("location") ?? ""),
    leaderName: String(formData.get("leaderName") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data yang diisi.",
      fieldErrors: getFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const duplicateSchedule = await prisma.bibleStudySchedule.findFirst({
    where: {
      groupName: {
        equals: parsed.data.groupName,
        mode: "insensitive",
      },
      dayOfWeek: parsed.data.dayOfWeek,
      startTime: parsed.data.startTime,
    },
    select: {
      id: true,
    },
  })

  if (duplicateSchedule) {
    return {
      status: "error",
      message: "Periksa kembali jadwal PA.",
      fieldErrors: {
        groupName: ["Kelompok dengan hari dan jam yang sama sudah tersedia."],
      },
      submissionId: previousState.submissionId,
    }
  }

  try {
    const lastSchedule = await prisma.bibleStudySchedule.aggregate({
      where: {
        dayOfWeek: parsed.data.dayOfWeek,
      },
      _max: {
        sortOrder: true,
      },
    })

    const sortOrder = (lastSchedule._max.sortOrder ?? 0) + 1

    await prisma.bibleStudySchedule.create({
      data: {
        groupName: parsed.data.groupName,
        dayOfWeek: parsed.data.dayOfWeek,
        startTime: parsed.data.startTime,
        location: parsed.data.location || null,
        leaderName: parsed.data.leaderName || null,
        notes: parsed.data.notes || null,
        sortOrder,
        isActive: true,
      },
    })
  } catch (error) {
    console.error("CREATE BIBLE STUDY SCHEDULE FAILED", error)

    return {
      status: "error",
      message: "Jadwal PA gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/jadwal-pa")

  return {
    status: "success",
    message: "Jadwal PA berhasil ditambahkan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createBibleStudySchedule }
