"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  getHeroSlideFieldErrors,
  type HeroSlideActionState,
} from "@/features/hero-slides/lib/hero-slide-action-state"
import { heroSlideFormSchema } from "@/features/hero-slides/schemas/hero-slide-schema"
import { prisma } from "@/lib/db/prisma"
import { getGoogleDriveFileId, normalizeGoogleDriveUrl } from "@/lib/google-drive"

async function saveHeroSlideSlot(
  slot: number,
  previousState: HeroSlideActionState,
  formData: FormData
): Promise<HeroSlideActionState> {
  await requirePermission("settings.manage")

  if (![1, 2, 3].includes(slot)) {
    return {
      status: "error",
      message: "Slot hero tidak valid.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  const parsed = heroSlideFormSchema.safeParse({
    imageUrl: String(formData.get("imageUrl") ?? ""),
    altText: String(formData.get("altText") ?? ""),
    isActive: String(formData.get("isActive") ?? "") === "true",
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data slide hero.",
      fieldErrors: getHeroSlideFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  if (!parsed.data.imageUrl) {
    try {
      await prisma.heroSlide.deleteMany({
        where: {
          slot,
        },
      })
    } catch (error) {
      console.error("DELETE HERO SLIDE SLOT FAILED", error)

      return {
        status: "error",
        message: "Slide hero gagal dikosongkan. Silakan coba kembali.",
        fieldErrors: {},
        submissionId: previousState.submissionId,
      }
    }

    revalidatePath("/admin/pengaturan")
    revalidatePath("/")

    return {
      status: "success",
      message: `Slide ${slot} berhasil dikosongkan.`,
      fieldErrors: {},
      submissionId: previousState.submissionId + 1,
    }
  }

  const imageFileId = getGoogleDriveFileId(parsed.data.imageUrl)

  const imageUrl = normalizeGoogleDriveUrl(parsed.data.imageUrl)

  if (!imageFileId || !imageUrl) {
    return {
      status: "error",
      message: "Periksa kembali link foto.",
      fieldErrors: {
        imageUrl: ["Link foto Google Drive tidak dapat diproses."],
      },
      submissionId: previousState.submissionId,
    }
  }

  const duplicate = await prisma.heroSlide.findFirst({
    where: {
      imageFileId,

      slot: {
        not: slot,
      },
    },

    select: {
      slot: true,
    },
  })

  if (duplicate) {
    return {
      status: "error",
      message: "Foto hero sudah digunakan.",
      fieldErrors: {
        imageUrl: [`Foto tersebut sudah digunakan pada Slide ${duplicate.slot}.`],
      },
      submissionId: previousState.submissionId,
    }
  }

  try {
    await prisma.heroSlide.upsert({
      where: {
        slot,
      },

      create: {
        slot,
        imageUrl,
        imageFileId,
        altText: parsed.data.altText,
        isActive: parsed.data.isActive,
      },

      update: {
        imageUrl,
        imageFileId,
        altText: parsed.data.altText,
        isActive: parsed.data.isActive,
      },
    })
  } catch (error) {
    console.error("SAVE HERO SLIDE SLOT FAILED", error)

    return {
      status: "error",
      message: "Slide hero gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/pengaturan")
  revalidatePath("/")

  return {
    status: "success",
    message: `Slide ${slot} berhasil disimpan.`,
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { saveHeroSlideSlot }
