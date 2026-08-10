"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  type WorshipServiceAssignmentActionState,
  type WorshipServiceAssignmentField,
} from "@/features/worship-schedules/lib/assignment-action-state"
import { worshipServiceAssignmentFormSchema } from "@/features/worship-schedules/schemas/worship-service-assignment-schema"
import { prisma } from "@/lib/db/prisma"

function getFieldErrors(
  issues: Array<{ path: PropertyKey[]; message: string }>
): WorshipServiceAssignmentActionState["fieldErrors"] {
  const fieldErrors: WorshipServiceAssignmentActionState["fieldErrors"] = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (field !== "worshipServiceRoleId" && field !== "personName") {
      continue
    }

    const key = field as WorshipServiceAssignmentField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

async function createWorshipServiceAssignment(
  worshipServiceId: string,
  previousState: WorshipServiceAssignmentActionState,
  formData: FormData
): Promise<WorshipServiceAssignmentActionState> {
  await requirePermission("church.manage")

  const parsed = worshipServiceAssignmentFormSchema.safeParse({
    worshipServiceRoleId: String(formData.get("worshipServiceRoleId") ?? ""),
    personName: String(formData.get("personName") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data yang diisi.",
      fieldErrors: getFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const service = await prisma.worshipService.findUnique({
    where: {
      id: worshipServiceId,
    },
    select: {
      id: true,
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
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  if (service.worshipSchedule.isPublished) {
    return {
      status: "error",
      message: "Batalkan publikasi jadwal terlebih dahulu sebelum menambah petugas.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  const role = await prisma.worshipServiceRole.findUnique({
    where: {
      id: parsed.data.worshipServiceRoleId,
    },
    select: {
      id: true,
      isActive: true,
    },
  })

  if (!role || !role.isActive) {
    return {
      status: "error",
      message: "Periksa kembali peran petugas.",
      fieldErrors: {
        worshipServiceRoleId: ["Peran petugas tidak tersedia atau sudah nonaktif."],
      },
      submissionId: previousState.submissionId,
    }
  }

  try {
    const lastAssignment = await prisma.worshipServiceAssignment.aggregate({
      where: {
        worshipServiceId,
      },
      _max: {
        sortOrder: true,
      },
    })

    const sortOrder = (lastAssignment._max.sortOrder ?? 0) + 1

    await prisma.worshipServiceAssignment.create({
      data: {
        worshipServiceId,
        worshipServiceRoleId: parsed.data.worshipServiceRoleId,
        personName: parsed.data.personName,
        sortOrder,
      },
    })
  } catch (error) {
    console.error("CREATE WORSHIP SERVICE ASSIGNMENT FAILED", error)

    return {
      status: "error",
      message: "Petugas ibadah gagal ditambahkan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/jadwal-ibadah")
  revalidatePath(`/admin/jadwal-ibadah/${service.worshipScheduleId}`)

  return {
    status: "success",
    message: "Petugas ibadah berhasil ditambahkan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createWorshipServiceAssignment }
