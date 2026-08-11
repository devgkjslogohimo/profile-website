"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

type ReorderDirection = "up" | "down"

async function reorderChurchForm(id: string, direction: ReorderDirection) {
  await requirePermission("submissions.manage")

  const churchForm = await prisma.churchForm.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      sortOrder: true,
    },
  })

  if (!churchForm) {
    return {
      success: false,
      message: "Formulir tidak ditemukan.",
    }
  }

  const neighbor =
    direction === "up"
      ? await prisma.churchForm.findFirst({
          where: {
            sortOrder: {
              lt: churchForm.sortOrder,
            },
          },
          orderBy: {
            sortOrder: "desc",
          },
          select: {
            id: true,
            sortOrder: true,
          },
        })
      : await prisma.churchForm.findFirst({
          where: {
            sortOrder: {
              gt: churchForm.sortOrder,
            },
          },
          orderBy: {
            sortOrder: "asc",
          },
          select: {
            id: true,
            sortOrder: true,
          },
        })

  if (!neighbor) {
    return {
      success: false,
      message:
        direction === "up"
          ? "Formulir sudah berada di urutan paling atas."
          : "Formulir sudah berada di urutan paling bawah.",
    }
  }

  try {
    await prisma.$transaction([
      prisma.churchForm.update({
        where: {
          id: churchForm.id,
        },
        data: {
          sortOrder: neighbor.sortOrder,
        },
      }),

      prisma.churchForm.update({
        where: {
          id: neighbor.id,
        },
        data: {
          sortOrder: churchForm.sortOrder,
        },
      }),
    ])
  } catch (error) {
    console.error("REORDER CHURCH FORM FAILED", error)

    return {
      success: false,
      message: "Urutan formulir gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/pengajuan")

  return {
    success: true,
    message: "Urutan formulir berhasil diperbarui.",
  }
}

export { reorderChurchForm }
