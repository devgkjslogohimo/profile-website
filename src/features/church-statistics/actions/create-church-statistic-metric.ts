"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  type ChurchStatisticMetricActionState,
  getChurchStatisticMetricFieldErrors,
} from "@/features/church-statistics/lib/church-statistic-action-state"
import { churchStatisticMetricFormSchema } from "@/features/church-statistics/schemas/church-statistic-metric-schema"
import { prisma } from "@/lib/db/prisma"

async function createChurchStatisticMetric(
  snapshotId: string,
  previousState: ChurchStatisticMetricActionState,
  formData: FormData
): Promise<ChurchStatisticMetricActionState> {
  await requirePermission("church.manage")

  const snapshot = await prisma.churchStatisticSnapshot.findUnique({
    where: {
      id: snapshotId,
    },
    select: {
      id: true,
    },
  })

  if (!snapshot) {
    return {
      status: "error",
      message: "Snapshot statistik tidak ditemukan.",
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
      snapshotId,
      category: {
        equals: parsed.data.category,
        mode: "insensitive",
      },
      label: {
        equals: parsed.data.label,
        mode: "insensitive",
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
    const lastMetric = await prisma.churchStatisticMetric.aggregate({
      where: {
        snapshotId,
      },
      _max: {
        sortOrder: true,
      },
    })

    await prisma.churchStatisticMetric.create({
      data: {
        snapshotId,
        category: parsed.data.category,
        label: parsed.data.label,
        value: Number(parsed.data.value),
        unit: parsed.data.unit || null,
        sortOrder: (lastMetric._max.sortOrder ?? 0) + 1,
        isActive: true,
      },
    })
  } catch (error) {
    console.error("CREATE CHURCH STATISTIC METRIC FAILED", error)

    return {
      status: "error",
      message: "Data statistik gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/statistik")
  revalidatePath(`/admin/statistik/${snapshotId}`)

  return {
    status: "success",
    message: "Data statistik berhasil ditambahkan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createChurchStatisticMetric }
