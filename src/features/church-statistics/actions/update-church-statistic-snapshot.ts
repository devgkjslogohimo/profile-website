"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import {
  type ChurchStatisticSnapshotActionState,
  getChurchStatisticSnapshotFieldErrors,
} from "@/features/church-statistics/lib/church-statistic-action-state"
import { churchStatisticSnapshotFormSchema } from "@/features/church-statistics/schemas/church-statistic-snapshot-schema"
import { prisma } from "@/lib/db/prisma"

async function updateChurchStatisticSnapshot(
  id: string,
  previousState: ChurchStatisticSnapshotActionState,
  formData: FormData
): Promise<ChurchStatisticSnapshotActionState> {
  await requirePermission("church.manage")

  const existingSnapshot = await prisma.churchStatisticSnapshot.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  })

  if (!existingSnapshot) {
    return {
      status: "error",
      message: "Snapshot statistik tidak ditemukan.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

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

  const duplicateDate = await prisma.churchStatisticSnapshot.findFirst({
    where: {
      asOfDate,
      NOT: {
        id,
      },
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
    await prisma.churchStatisticSnapshot.update({
      where: {
        id,
      },
      data: {
        title: parsed.data.title,
        asOfDate,
        notes: parsed.data.notes || null,
      },
    })
  } catch (error) {
    console.error("UPDATE CHURCH STATISTIC SNAPSHOT FAILED", error)

    return {
      status: "error",
      message: "Perubahan snapshot statistik gagal disimpan. Silakan coba kembali.",
      fieldErrors: {},
      submissionId: previousState.submissionId,
    }
  }

  revalidatePath("/admin/statistik")
  revalidatePath(`/admin/statistik/${id}`)
  revalidatePath(`/admin/statistik/${id}/edit`)

  return {
    status: "success",
    message: "Perubahan snapshot statistik berhasil disimpan.",
    fieldErrors: {},
    submissionId: previousState.submissionId + 1,
  }
}

export { updateChurchStatisticSnapshot }
