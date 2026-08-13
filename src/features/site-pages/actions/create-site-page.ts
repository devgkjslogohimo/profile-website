"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  getSitePageFieldErrors,
  type SitePageActionState,
} from "@/features/site-pages/lib/site-page-action-state"
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

async function createSitePage(
  previousState: SitePageActionState,
  formData: FormData
): Promise<SitePageActionState> {
  const currentUser = await requirePermission("content.create")

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

  try {
    let slug = baseSlug
    let suffix = 2

    while (
      await prisma.sitePage.findUnique({
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

    await prisma.sitePage.create({
      data: {
        title: parsed.data.title,
        slug,

        content: toPrismaJson(parsed.data.content),

        /*
         * Halaman baru selalu Draft.
         * Status tidak diterima dari browser.
         */
        status: "DRAFT",
        publishedAt: null,

        /*
         * Author selalu berasal dari
         * authenticated session.
         */
        authorId: currentUser.id,
        showInNavigation: parsed.data.showInNavigation,

        navigationLabel: parsed.data.showInNavigation ? parsed.data.navigationLabel : null,

        navigationOrder: parsed.data.navigationOrder,
      },
    })
  } catch (error) {
    console.error("CREATE SITE PAGE FAILED", error)

    return {
      status: "error",
      message: "Halaman gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/halaman")

  return {
    status: "success",
    message: "Halaman berhasil ditambahkan sebagai draft.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createSitePage }
