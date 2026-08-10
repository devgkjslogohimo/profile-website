"use server"

import { requirePermission } from "@/dal/auth"
import type { DeleteChurchLocationActionState } from "@/features/church-locations/lib/delete-action-state"
import { prisma } from "@/lib/db/prisma"

function isForeignKeyConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2003"
}

async function deleteChurchLocation(id: string): Promise<DeleteChurchLocationActionState> {
  await requirePermission("church.manage")

  const location = await prisma.churchLocation.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
  })

  if (!location) {
    return {
      status: "error",
      message: "Lokasi tidak ditemukan.",
    }
  }

  if (location.isActive) {
    return {
      status: "error",
      message: "Lokasi masih aktif. Nonaktifkan lokasi terlebih dahulu sebelum menghapus.",
    }
  }

  try {
    await prisma.churchLocation.delete({
      where: {
        id: location.id,
      },
    })
  } catch (error) {
    if (isForeignKeyConstraintError(error)) {
      return {
        status: "error",
        message:
          "Lokasi tidak dapat dihapus karena sudah digunakan oleh data lain. Gunakan status Nonaktif jika lokasi tidak ingin ditampilkan.",
      }
    }

    console.error("DELETE CHURCH LOCATION FAILED", error)

    return {
      status: "error",
      message: "Lokasi gagal dihapus. Silakan coba kembali.",
    }
  }

  return {
    status: "success",
    message: `${location.name} berhasil dihapus.`,
  }
}

export { deleteChurchLocation }
