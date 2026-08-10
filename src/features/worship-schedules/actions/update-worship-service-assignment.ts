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

async function updateWorshipServiceAssignment(
  id: string,
  previousState: WorshipServiceAssignmentActionState,
  formData: FormData
): Promise<WorshipServiceAssignmentActionState> {
  await requirePermission("church.manage")

  const assignment = await prisma.worshipServiceAssignment.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      worshipServiceRoleId: true,
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
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  if (assignment.worshipService.worshipSchedule.isPublished) {
    return {
      status: "error",
      message: "Batalkan publikasi jadwal terlebih dahulu sebelum mengubah petugas.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

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

  const role = await prisma.worshipServiceRole.findUnique({
    where: {
      id: parsed.data.worshipServiceRoleId,
    },
    select: {
      id: true,
      isActive: true,
    },
  })

  if (!role || (!role.isActive && role.id !== assignment.worshipServiceRoleId)) {
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
    await prisma.worshipServiceAssignment.update({
      where: {
        id,
      },
      data: {
        worshipServiceRoleId: parsed.data.worshipServiceRoleId,
        personName: parsed.data.personName,
      },
    })
  } catch (error) {
    console.error("UPDATE WORSHIP SERVICE ASSIGNMENT FAILED", error)

    return {
      status: "error",
      message: "Perubahan petugas ibadah gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/jadwal-ibadah")
  revalidatePath(`/admin/jadwal-ibadah/${assignment.worshipService.worshipScheduleId}`)

  return {
    status: "success",
    message: "Perubahan petugas ibadah berhasil disimpan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { updateWorshipServiceAssignment }
