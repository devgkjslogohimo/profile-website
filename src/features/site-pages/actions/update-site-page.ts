"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import {
  getSitePageFieldErrors,
  type SitePageActionState,
} from "@/features/site-pages/lib/site-page-action-state"
import { canEditSitePage } from "@/features/site-pages/lib/site-page-permissions"
import {
  createSitePageSlug,
  isReservedSitePageSlug,
} from "@/features/site-pages/lib/site-page-slug"
import { sitePageFormSchema } from "@/features/site-pages/schemas/site-page-schema"
import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/lib/db/prisma"

function parseContent(value: FormDataEntryValue | null): unknown {
  if (typeof value !== "string") {
    return null
  }

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function toPrismaJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
}

async function updateSitePage(
  id: string,
  previousState: SitePageActionState,
  formData: FormData
): Promise<SitePageActionState> {
  const currentUser = await requirePermission("content.edit.own")

  const existingPage = await prisma.sitePage.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      slug: true,
      authorId: true,
      status: true,
    },
  })

  if (!existingPage) {
    return {
      status: "error",
      message: "Halaman tidak ditemukan.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  if (
    !canEditSitePage({
      role: currentUser.role,
      userId: currentUser.id,
      authorId: existingPage.authorId,
    })
  ) {
    return {
      status: "error",
      message: "Anda tidak memiliki izin untuk mengubah halaman ini.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  const parsed = sitePageFormSchema.safeParse({
    title: String(formData.get("title") ?? ""),

    content: parseContent(formData.get("content")),

    showInNavigation: formData.get("showInNavigation") === "true",

    navigationLabel: String(formData.get("navigationLabel") ?? ""),

    navigationOrder: Number(formData.get("navigationOrder") ?? 0),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data halaman.",
      fieldErrors: getSitePageFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  /*
   * Saat Draft, slug mengikuti judul.
   *
   * Setelah Published, slug dipertahankan
   * agar URL halaman publik tetap stabil.
   */
  let slug = existingPage.slug

  if (existingPage.status === "DRAFT") {
    const baseSlug = createSitePageSlug(parsed.data.title)

    if (!baseSlug) {
      return {
        status: "error",
        message: "Periksa kembali data halaman.",
        fieldErrors: {
          title: ["Judul halaman tidak dapat digunakan untuk membuat slug."],
        },
        submissionId: previousState.submissionId,
      }
    }

    if (isReservedSitePageSlug(baseSlug)) {
      return {
        status: "error",
        message: "Periksa kembali data halaman.",
        fieldErrors: {
          title: [
            "Judul tersebut menghasilkan alamat yang digunakan oleh sistem. Gunakan judul lain.",
          ],
        },
        submissionId: previousState.submissionId,
      }
    }

    slug = baseSlug

    let suffix = 2

    while (
      await prisma.sitePage.findFirst({
        where: {
          slug,

          id: {
            not: id,
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
    await prisma.sitePage.update({
      where: {
        id,
      },

      data: {
        title: parsed.data.title,
        slug,

        content: toPrismaJson(parsed.data.content),
        showInNavigation: parsed.data.showInNavigation,

        navigationLabel: parsed.data.showInNavigation ? parsed.data.navigationLabel : null,

        navigationOrder: parsed.data.navigationOrder,
      },
    })
  } catch (error) {
    console.error("UPDATE SITE PAGE FAILED", error)

    return {
      status: "error",
      message: "Perubahan halaman gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/halaman")
  revalidatePath(`/admin/halaman/${id}/edit`)

  if (existingPage.status === "PUBLISHED") {
    updateTag(PUBLIC_CACHE_TAGS.sitePages)
    updateTag(PUBLIC_CACHE_TAGS.navigation)
  }

  /*
   * Route publik CMS belum dibangun.
   *
   * SitePage nantinya menggunakan
   * root slug, contoh:
   * /sejarah
   * /visi-misi
   */
  revalidatePath(`/${slug}`)

  return {
    status: "success",
    message: "Perubahan halaman berhasil disimpan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { updateSitePage }
