"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  type ChurchStatisticSnapshotActionState,
  getChurchStatisticSnapshotFieldErrors,
} from "@/features/church-statistics/lib/church-statistic-action-state"
import { churchStatisticSnapshotFormSchema } from "@/features/church-statistics/schemas/church-statistic-snapshot-schema"
import { prisma } from "@/lib/db/prisma"

async function createChurchStatisticSnapshot(
  previousState: ChurchStatisticSnapshotActionState,
  formData: FormData
): Promise<ChurchStatisticSnapshotActionState> {
  await requirePermission("church.manage")

  const parsed = churchStatisticSnapshotFormSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    asOfDate: String(formData.get("asOfDate") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data yang diisi.",
      fieldErrors: getChurchStatisticSnapshotFieldErrors(parsed.error.issues),
      submissionId: previousState.submissionId,
    }
  }

  const asOfDate = new Date(`${parsed.data.asOfDate}T00:00:00.000Z`)

  const duplicateDate = await prisma.churchStatisticSnapshot.findUnique({
    where: {
      asOfDate,
    },
    select: {
      id: true,
    },
  })

  if (duplicateDate) {
    return {
      status: "error",
      message: "Periksa kembali tanggal statistik.",
      fieldErrors: {
        asOfDate: ["Snapshot statistik untuk tanggal tersebut sudah tersedia."],
      },
      submissionId: previousState.submissionId,
    }
  }

  try {
    await prisma.churchStatisticSnapshot.create({
      data: {
        title: parsed.data.title,
        asOfDate,
        notes: parsed.data.notes || null,
        isActive: true,
      },
    })
  } catch (error) {
    console.error("CREATE CHURCH STATISTIC SNAPSHOT FAILED", error)

    return {
      status: "error",
      message: "Snapshot statistik gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/statistik")

  return {
    status: "success",
    message: "Snapshot statistik berhasil ditambahkan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { createChurchStatisticSnapshot }
