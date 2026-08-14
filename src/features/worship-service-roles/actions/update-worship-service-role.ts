"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
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

async function updateWorshipServiceRole(
  id: string,
  previousState: WorshipServiceRoleActionState,
  formData: FormData
): Promise<WorshipServiceRoleActionState> {
  await requirePermission("church.manage")

  const existingRole = await prisma.worshipServiceRole.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  })

  if (!existingRole) {
    return {
      status: "error",
      message: "Peran petugas tidak ditemukan.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

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

  const duplicateRole = await prisma.worshipServiceRole.findFirst({
    where: {
      name: {
        equals: parsed.data.name,
        mode: "insensitive",
      },
      NOT: {
        id,
      },
    },
    select: {
      id: true,
    },
  })

  if (duplicateRole) {
    return {
      status: "error",
      message: "Periksa kembali nama peran.",
      fieldErrors: {
        name: ["Nama peran sudah digunakan."],
      },
      submissionId: previousState.submissionId,
    }
  }

  try {
    await prisma.worshipServiceRole.update({
      where: {
        id,
      },
      data: {
        name: parsed.data.name,
      },
    })
  } catch (error) {
    console.error("UPDATE WORSHIP SERVICE ROLE FAILED", error)

    return {
      status: "error",
      message: "Perubahan peran petugas gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/peran-petugas-ibadah")
  revalidatePath(`/admin/peran-petugas-ibadah/${id}/edit`)

  updateTag(PUBLIC_CACHE_TAGS.worshipSchedules)
  revalidatePath("/jadwal-ibadah", "layout")

  return {
    status: "success",
    message: "Perubahan peran petugas berhasil disimpan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { updateWorshipServiceRole }
