"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

type ReorderDirection = "up" | "down"

async function reorderChurchCouncilMember(id: string, direction: ReorderDirection) {
  await requirePermission("church.manage")

  const member = await prisma.churchCouncilMember.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      sortOrder: true,
    },
  })

  if (!member) {
    return {
      success: false,
      message: "Anggota Majelis tidak ditemukan.",
    }
  }

  const neighbor =
    direction === "up"
      ? await prisma.churchCouncilMember.findFirst({
          where: {
            sortOrder: {
              lt: member.sortOrder,
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
      : await prisma.churchCouncilMember.findFirst({
          where: {
            sortOrder: {
              gt: member.sortOrder,
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
          ? "Anggota sudah berada di urutan paling atas."
          : "Anggota sudah berada di urutan paling bawah.",
    }
  }

  try {
    await prisma.$transaction([
      prisma.churchCouncilMember.update({
        where: {
          id: member.id,
        },
        data: {
          sortOrder: neighbor.sortOrder,
        },
      }),

      prisma.churchCouncilMember.update({
        where: {
          id: neighbor.id,
        },
        data: {
          sortOrder: member.sortOrder,
        },
      }),
    ])
  } catch (error) {
    console.error("REORDER CHURCH COUNCIL MEMBER FAILED", error)

    return {
      success: false,
      message: "Urutan anggota Majelis gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/majelis")

  return {
    success: true,
    message: "Urutan anggota Majelis berhasil diperbarui.",
  }
}

export { reorderChurchCouncilMember }
