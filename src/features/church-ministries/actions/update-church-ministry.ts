"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  type ChurchMinistryActionState,
  getChurchMinistryFieldErrors,
} from "@/features/church-ministries/lib/action-state"
import { getUniqueChurchMinistrySlug } from "@/features/church-ministries/lib/slug"
import { churchMinistryFormSchema } from "@/features/church-ministries/schemas/church-ministry-schema"
import { prisma } from "@/lib/db/prisma"
import { normalizeGoogleDriveUrl } from "@/lib/google-drive"

async function updateChurchMinistry(
  id: string,
  previousState: ChurchMinistryActionState,
  formData: FormData
): Promise<ChurchMinistryActionState> {
  await requirePermission("church.manage")

  const existingMinistry = await prisma.churchMinistry.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  })

  if (!existingMinistry) {
    return {
      status: "error",
      message: "Pelayanan tidak ditemukan.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  const parsed = churchMinistryFormSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    description: String(formData.get("description") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data yang diisi.",
      fieldErrors: getChurchMinistryFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const duplicateName = await prisma.churchMinistry.findFirst({
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

  if (duplicateName) {
    return {
      status: "error",
      message: "Periksa kembali data pelayanan.",
      fieldErrors: {
        name: ["Nama pelayanan sudah digunakan."],
      },
      submissionId: previousState.submissionId,
    }
  }

  try {
    const slug = await getUniqueChurchMinistrySlug(parsed.data.name, id)
    const imageUrl = parsed.data.imageUrl ? normalizeGoogleDriveUrl(parsed.data.imageUrl) : null

    await prisma.churchMinistry.update({
      where: {
        id,
      },
      data: {
        name: parsed.data.name,
        slug,
        summary: parsed.data.summary || null,
        description: parsed.data.description || null,
        imageUrl,
      },
    })
  } catch (error) {
    console.error("UPDATE CHURCH MINISTRY FAILED", error)

    return {
      status: "error",
      message: "Perubahan pelayanan gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/pelayanan")
  revalidatePath(`/admin/pelayanan/${id}/edit`)

  return {
    status: "success",
    message: "Perubahan pelayanan berhasil disimpan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { updateChurchMinistry }
