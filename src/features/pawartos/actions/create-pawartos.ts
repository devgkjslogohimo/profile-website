"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  getPawartosFieldErrors,
  type PawartosActionState,
} from "@/features/pawartos/lib/pawartos-action-state"
import { createPawartosSlug } from "@/features/pawartos/lib/pawartos-slug"
import { pawartosFormSchema } from "@/features/pawartos/schemas/pawartos-schema"
import { prisma } from "@/lib/db/prisma"
import { getGoogleDriveFileId, normalizeGoogleDriveUrl } from "@/lib/google-drive"

async function createPawartos(
  previousState: PawartosActionState,
  formData: FormData
): Promise<PawartosActionState> {
  const currentUser = await requirePermission("content.create")

  const parsed = pawartosFormSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    publicationDate: String(formData.get("publicationDate") ?? ""),
    description: String(formData.get("description") ?? ""),
    googleDriveUrl: String(formData.get("googleDriveUrl") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data Pawartos.",
      fieldErrors: getPawartosFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const publicationDate = new Date(`${parsed.data.publicationDate}T00:00:00.000Z`)

  const googleDriveFileId = getGoogleDriveFileId(parsed.data.googleDriveUrl)

  const googleDriveUrl = normalizeGoogleDriveUrl(parsed.data.googleDriveUrl)

  if (!googleDriveFileId || !googleDriveUrl) {
    return {
      status: "error",
      message: "Periksa kembali data Pawartos.",
      fieldErrors: {
        googleDriveUrl: ["Link file Google Drive tidak dapat diproses."],
      },
      submissionId: previousState.submissionId,
    }
  }

  const duplicatePdf = await prisma.pawartos.findUnique({
    where: {
      googleDriveFileId,
    },
    select: {
      id: true,
    },
  })

  if (duplicatePdf) {
    return {
      status: "error",
      message: "Periksa kembali data Pawartos.",
      fieldErrors: {
        googleDriveUrl: ["File PDF Google Drive tersebut sudah digunakan pada Pawartos lain."],
      },
      submissionId: previousState.submissionId,
    }
  }

  if (duplicatePdf) {
    return {
      status: "error",
      message: "Periksa kembali data Pawartos.",
      fieldErrors: {
        googleDriveUrl: ["File PDF Google Drive tersebut sudah digunakan pada Pawartos lain."],
      },
      submissionId: previousState.submissionId,
    }
  }

  const baseSlug = createPawartosSlug(parsed.data.title)

  if (!baseSlug) {
    return {
      status: "error",
      message: "Periksa kembali data Pawartos.",
      fieldErrors: {
        title: ["Judul Pawartos tidak dapat digunakan untuk membuat slug."],
      },
      submissionId: previousState.submissionId,
    }
  }

  try {
    let slug = baseSlug
    let suffix = 2

    while (
      await prisma.pawartos.findUnique({
        where: {
          slug,
        },
        select: {
          id: true,
        },
      })
    ) {
      slug = `${baseSlug}-${suffix}`
      suffix += 1
    }

    await prisma.pawartos.create({
      data: {
        title: parsed.data.title,
        slug,
        publicationDate,
        description: parsed.data.description || null,

        googleDriveUrl,
        googleDriveFileId,

        status: "DRAFT",
        publishedAt: null,
        authorId: currentUser.id,
      },
    })
  } catch (error) {
    console.error("CREATE PAWARTOS FAILED", error)

    return {
      status: "error",
      message: "Pawartos gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/pawartos")

  return {
    status: "success",
    message: "Pawartos berhasil ditambahkan sebagai draft.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createPawartos }
