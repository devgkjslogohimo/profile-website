"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  type ChurchStatisticMetricActionState,
  getChurchStatisticMetricFieldErrors,
} from "@/features/church-statistics/lib/church-statistic-action-state"
import { churchStatisticMetricFormSchema } from "@/features/church-statistics/schemas/church-statistic-metric-schema"
import { prisma } from "@/lib/db/prisma"

async function updateChurchStatisticMetric(
  id: string,
  previousState: ChurchStatisticMetricActionState,
  formData: FormData
): Promise<ChurchStatisticMetricActionState> {
  await requirePermission("church.manage")

  const existingMetric = await prisma.churchStatisticMetric.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      snapshotId: true,
    },
  })

  if (!existingMetric) {
    return {
      status: "error",
      message: "Data statistik tidak ditemukan.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  const parsed = churchStatisticMetricFormSchema.safeParse({
    category: String(formData.get("category") ?? ""),
    label: String(formData.get("label") ?? ""),
    value: String(formData.get("value") ?? ""),
    unit: String(formData.get("unit") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data yang diisi.",
      fieldErrors: getChurchStatisticMetricFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const duplicateMetric = await prisma.churchStatisticMetric.findFirst({
    where: {
      snapshotId: existingMetric.snapshotId,
      category: {
        equals: parsed.data.category,
        mode: "insensitive",
      },
      label: {
        equals: parsed.data.label,
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

  if (duplicateMetric) {
    return {
      status: "error",
      message: "Periksa kembali data statistik.",
      fieldErrors: {
        label: ["Statistik dengan kategori dan nama tersebut sudah tersedia."],
      },
      submissionId: previousState.submissionId,
    }
  }

  try {
    await prisma.churchStatisticMetric.update({
      where: {
        id,
      },
      data: {
        category: parsed.data.category,
        label: parsed.data.label,
        value: Number(parsed.data.value),
        unit: parsed.data.unit || null,
      },
    })
  } catch (error) {
    console.error("UPDATE CHURCH STATISTIC METRIC FAILED", error)

    return {
      status: "error",
      message: "Perubahan data statistik gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/statistik")
  revalidatePath(`/admin/statistik/${existingMetric.snapshotId}`)

  return {
    status: "success",
    message: "Perubahan data statistik berhasil disimpan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { updateChurchStatisticMetric }
