"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

import type { ChurchLocationActionState, ChurchLocationField } from "../action-state"
import { churchLocationFormSchema, churchLocationSlugSchema } from "../schema"
import { createChurchLocationSlug } from "../slug"

function getFieldErrors(
  issues: Array<{ path: PropertyKey[]; message: string }>
): ChurchLocationActionState["fieldErrors"] {
  const fieldErrors: ChurchLocationActionState["fieldErrors"] = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (field !== "name" && field !== "type" && field !== "googleMapsUrl") {
      continue
    }

    const key = field as ChurchLocationField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

async function createChurchLocation(
  previousState: ChurchLocationActionState,
  formData: FormData
): Promise<ChurchLocationActionState> {
  await requirePermission("church.manage")

  const parsed = churchLocationFormSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    type: String(formData.get("type") ?? ""),
    googleMapsUrl: String(formData.get("googleMapsUrl") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data yang diisi.",
      fieldErrors: getFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const slug = createChurchLocationSlug(parsed.data.name)
  const parsedSlug = churchLocationSlugSchema.safeParse(slug)

  if (!parsedSlug.success) {
    return {
      status: "error",
      message: "Periksa kembali nama lokasi.",
      fieldErrors: {
        name: parsedSlug.error.issues.map((issue) => issue.message),
      },
      submissionId: previousState.submissionId,
    }
  }

  try {
    const existingSlug = await prisma.churchLocation.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    })

    if (existingSlug) {
      return {
        status: "error",
        message: "Periksa kembali nama lokasi.",
        fieldErrors: {
          name: ["Nama lokasi sudah digunakan atau menghasilkan slug yang sama."],
        },
        submissionId: previousState.submissionId,
      }
    }

    const lastLocation = await prisma.churchLocation.aggregate({
      _max: {
        sortOrder: true,
      },
    })

    const sortOrder = (lastLocation._max.sortOrder ?? 0) + 1

    await prisma.churchLocation.create({
      data: {
        name: parsed.data.name,
        slug,
        type: parsed.data.type,
        googleMapsUrl: parsed.data.googleMapsUrl || null,
        sortOrder,
        isActive: true,
      },
    })
  } catch (error) {
    console.error("CREATE CHURCH LOCATION FAILED", error)

    return {
      status: "error",
      message: "Lokasi gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/lokasi")

  return {
    status: "success",
    message: "Lokasi berhasil ditambahkan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createChurchLocation }
