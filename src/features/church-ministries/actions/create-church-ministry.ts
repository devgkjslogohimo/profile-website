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

async function createChurchMinistry(
  previousState: ChurchMinistryActionState,
  formData: FormData
): Promise<ChurchMinistryActionState> {
  await requirePermission("church.manage")

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

  const imageUrl = parsed.data.imageUrl ? normalizeGoogleDriveUrl(parsed.data.imageUrl) : null

  try {
    const [slug, lastMinistry] = await Promise.all([
      getUniqueChurchMinistrySlug(parsed.data.name),

      prisma.churchMinistry.aggregate({
        _max: {
          sortOrder: true,
        },
      }),
    ])

    await prisma.churchMinistry.create({
      data: {
        name: parsed.data.name,
        slug,
        summary: parsed.data.summary || null,
        description: parsed.data.description || null,
        imageUrl,
        sortOrder: (lastMinistry._max.sortOrder ?? 0) + 1,
        isActive: true,
      },
    })
  } catch (error) {
    console.error("CREATE CHURCH MINISTRY FAILED", error)

    return {
      status: "error",
      message: "Pelayanan gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/pelayanan")

  return {
    status: "success",
    message: "Pelayanan berhasil ditambahkan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createChurchMinistry }
