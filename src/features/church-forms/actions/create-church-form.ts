"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  type ChurchFormActionState,
  getChurchFormFieldErrors,
} from "@/features/church-forms/lib/church-form-action-state"
import { normalizeGoogleFormUrl } from "@/features/church-forms/lib/google-form-url"
import { churchFormFormSchema } from "@/features/church-forms/schemas/church-form-schema"
import { prisma } from "@/lib/db/prisma"

async function createChurchForm(
  previousState: ChurchFormActionState,
  formData: FormData
): Promise<ChurchFormActionState> {
  await requirePermission("submissions.manage")

  const parsed = churchFormFormSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    googleFormUrl: String(formData.get("googleFormUrl") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data yang diisi.",
      fieldErrors: getChurchFormFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const googleFormUrl = normalizeGoogleFormUrl(parsed.data.googleFormUrl)

  if (!googleFormUrl) {
    return {
      status: "error",
      message: "Periksa kembali link Google Form.",
      fieldErrors: {
        googleFormUrl: ["Link Google Form tidak dapat diproses."],
      },
      submissionId: previousState.submissionId,
    }
  }

  try {
    const lastForm = await prisma.churchForm.aggregate({
      _max: {
        sortOrder: true,
      },
    })

    await prisma.churchForm.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
        googleFormUrl,
        sortOrder: (lastForm._max.sortOrder ?? 0) + 1,
        isActive: true,
      },
    })
  } catch (error) {
    console.error("CREATE CHURCH FORM FAILED", error)

    return {
      status: "error",
      message: "Formulir gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/pengajuan")

  return {
    status: "success",
    message: "Formulir berhasil ditambahkan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createChurchForm }
