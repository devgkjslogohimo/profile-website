"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type {
  WorshipServiceRoleActionState,
  WorshipServiceRoleField,
} from "@/features/worship-service-roles/lib/action-state"
import { worshipServiceRoleFormSchema } from "@/features/worship-service-roles/schemas/worship-service-role-schema"
import { prisma } from "@/lib/db/prisma"

function getFieldErrors(
  issues: Array<{ path: PropertyKey[]; message: string }>
): WorshipServiceRoleActionState["fieldErrors"] {
  const fieldErrors: WorshipServiceRoleActionState["fieldErrors"] = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (field !== "name") {
      continue
    }

    const key = field as WorshipServiceRoleField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

async function createWorshipServiceRole(
  previousState: WorshipServiceRoleActionState,
  formData: FormData
): Promise<WorshipServiceRoleActionState> {
  await requirePermission("church.manage")

  const parsed = worshipServiceRoleFormSchema.safeParse({
    name: String(formData.get("name") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data yang diisi.",
      fieldErrors: getFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  try {
    const existingRole = await prisma.worshipServiceRole.findFirst({
      where: {
        name: {
          equals: parsed.data.name,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
      },
    })

    if (existingRole) {
      return {
        status: "error",
        message: "Periksa kembali nama peran.",
        fieldErrors: {
          name: ["Nama peran sudah digunakan."],
        },
        submissionId: previousState.submissionId,
      }
    }

    const lastRole = await prisma.worshipServiceRole.aggregate({
      _max: {
        sortOrder: true,
      },
    })

    const sortOrder = (lastRole._max.sortOrder ?? 0) + 1

    await prisma.worshipServiceRole.create({
      data: {
        name: parsed.data.name,
        sortOrder,
        isActive: true,
      },
    })
  } catch (error) {
    console.error("CREATE WORSHIP SERVICE ROLE FAILED", error)

    return {
      status: "error",
      message: "Peran petugas gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/peran-petugas-ibadah")

  return {
    status: "success",
    message: "Peran petugas berhasil ditambahkan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createWorshipServiceRole }
