"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  getPawartosFieldErrors,
  type PawartosActionState,
} from "@/features/pawartos/lib/pawartos-action-state"
import { canEditPawartos } from "@/features/pawartos/lib/pawartos-permissions"
import { createPawartosSlug } from "@/features/pawartos/lib/pawartos-slug"
import { pawartosFormSchema } from "@/features/pawartos/schemas/pawartos-schema"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"
import { getGoogleDriveFileId, normalizeGoogleDriveUrl } from "@/lib/google-drive"

async function updatePawartos(
  id: string,
  previousState: PawartosActionState,
  formData: FormData
): Promise<PawartosActionState> {
  const currentUser = await requirePermission("content.edit.own")

  const existingPawartos = await prisma.pawartos.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      authorId: true,
      status: true,
    },
  })

  if (!existingPawartos) {
    return {
      status: "error",
      message: "Pawartos tidak ditemukan.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  if (
    !canEditPawartos({
      role: currentUser.role,
      userId: currentUser.id,
      authorId: existingPawartos.authorId,
    })
  ) {
    return {
      status: "error",
      message: "Anda tidak memiliki izin untuk mengubah Pawartos ini.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

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

  const duplicatePdf = await prisma.pawartos.findFirst({
    where: {
      googleDriveFileId,
      id: {
        not: id,
      },
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

  /*
   * Draft boleh mengikuti perubahan judul.
   * Published mempertahankan slug untuk stabilitas URL publik.
   */
  let slug = existingPawartos.slug

  if (existingPawartos.status === "DRAFT") {
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

    slug = baseSlug

    let suffix = 2

    while (
      await prisma.pawartos.findFirst({
        where: {
          slug,
          NOT: {
            id,
          },
        },
        select: {
          id: true,
        },
      })
    ) {
      slug = `${baseSlug}-${suffix}`
      suffix += 1
    }
  }

  try {
    await prisma.pawartos.update({
      where: {
        id,
      },
      data: {
        title: parsed.data.title,
        slug,
        publicationDate,
        description: parsed.data.description || null,
        googleDriveUrl,
        googleDriveFileId,
      },
    })
  } catch (error) {
    console.error("UPDATE PAWARTOS FAILED", error)

    return {
      status: "error",
      message: "Perubahan Pawartos gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/pawartos")
  revalidatePath(`/admin/pawartos/${id}/edit`)

  if (existingPawartos.status === "PUBLISHED") {
    updateTag(PUBLIC_CACHE_TAGS.pawartos)

    revalidatePath("/")
    revalidatePath("/pawartos")
    revalidatePath(`/pawartos/${slug}`)
  }

  return {
    status: "success",
    message: "Perubahan Pawartos berhasil disimpan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { updatePawartos }
