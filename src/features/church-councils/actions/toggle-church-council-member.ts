"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

async function toggleChurchCouncilMember(id: string) {
  await requirePermission("church.manage")

  const member = await prisma.churchCouncilMember.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      fullName: true,
      isActive: true,
    },
  })

  if (!member) {
    return {
      success: false,
      message: "Anggota Majelis tidak ditemukan.",
    }
  }

  try {
    await prisma.churchCouncilMember.update({
      where: {
        id,
      },
      data: {
        isActive: !member.isActive,
      },
    })
  } catch (error) {
    console.error("TOGGLE CHURCH COUNCIL MEMBER FAILED", error)

    return {
      success: false,
      message: "Status anggota Majelis gagal diperbarui. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/majelis")
  revalidatePath(`/admin/majelis/${id}/edit`)

  updateTag(PUBLIC_CACHE_TAGS.churchLocations)
  updateTag(PUBLIC_CACHE_TAGS.churchServants)

  revalidatePath("/lokasi", "layout")
  revalidatePath("/pelayan")

  return {
    success: true,
    message: member.isActive
      ? `${member.fullName} berhasil dinonaktifkan.`
      : `${member.fullName} berhasil diaktifkan.`,
  }
}

export { toggleChurchCouncilMember }
