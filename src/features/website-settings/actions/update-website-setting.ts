"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import {
  getWebsiteSettingFieldErrors,
  type WebsiteSettingActionState,
} from "@/features/website-settings/lib/website-setting-action-state"
import { websiteSettingFormSchema } from "@/features/website-settings/schemas/website-setting-schema"
import { prisma } from "@/lib/db/prisma"

function emptyToNull(value: string) {
  return value || null
}

async function updateWebsiteSetting(
  previousState: WebsiteSettingActionState,
  formData: FormData
): Promise<WebsiteSettingActionState> {
  await requirePermission("settings.manage")

  const parsed = websiteSettingFormSchema.safeParse({
    siteName: String(formData.get("siteName") ?? ""),
    tagline: String(formData.get("tagline") ?? ""),
    description: String(formData.get("description") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    facebookUrl: String(formData.get("facebookUrl") ?? ""),
    instagramUrl: String(formData.get("instagramUrl") ?? ""),
    youtubeUrl: String(formData.get("youtubeUrl") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data pengaturan yang diisi.",
      fieldErrors: getWebsiteSettingFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const data = {
    siteName: parsed.data.siteName,
    tagline: emptyToNull(parsed.data.tagline),
    description: emptyToNull(parsed.data.description),
    email: emptyToNull(parsed.data.email),
    phone: emptyToNull(parsed.data.phone),
    whatsapp: emptyToNull(parsed.data.whatsapp),
    facebookUrl: emptyToNull(parsed.data.facebookUrl),
    instagramUrl: emptyToNull(parsed.data.instagramUrl),
    youtubeUrl: emptyToNull(parsed.data.youtubeUrl),
  }

  try {
    await prisma.websiteSetting.upsert({
      where: {
        id: "main",
      },
      create: {
        id: "main",
        ...data,
      },
      update: data,
    })
  } catch (error) {
    console.error("UPDATE WEBSITE SETTING FAILED", error)

    return {
      status: "error",
      message: "Pengaturan website gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/pengaturan")

  updateTag(PUBLIC_CACHE_TAGS.siteSettings)
  revalidatePath("/", "layout")

  return {
    status: "success",
    message: "Pengaturan website berhasil disimpan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { updateWebsiteSetting }
