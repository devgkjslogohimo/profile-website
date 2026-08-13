"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { AnnouncementDeleteActionResult } from "@/features/announcements/lib/announcement-delete-action-state"
import { canEditAnnouncement } from "@/features/announcements/lib/announcement-permissions"
import { prisma } from "@/lib/db/prisma"

async function deleteAnnouncement(id: string): Promise<AnnouncementDeleteActionResult> {
  const currentUser = await requirePermission("content.edit.own")

  const announcement = await prisma.announcement.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      authorId: true,
    },
  })

  if (!announcement) {
    return {
      status: "error",
      message: "Pengumuman tidak ditemukan.",
    }
  }

  if (
    !canEditAnnouncement({
      role: currentUser.role,
      userId: currentUser.id,
      authorId: announcement.authorId,
    })
  ) {
    return {
      status: "error",
      message: "Anda tidak memiliki izin untuk menghapus pengumuman ini.",
    }
  }

  /*
   * Pengumuman Published harus di-Unpublish terlebih dahulu.
   */
  if (announcement.status === "PUBLISHED") {
    return {
      status: "error",
      message:
        "Pengumuman yang sudah dipublikasikan tidak dapat langsung dihapus. Batalkan publikasi terlebih dahulu.",
    }
  }

  try {
    await prisma.announcement.delete({
      where: {
        id: announcement.id,
      },
    })
  } catch (error) {
    console.error("DELETE ANNOUNCEMENT FAILED", error)

    return {
      status: "error",
      message: "Pengumuman gagal dihapus. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/pengumuman")

  revalidatePath("/pengumuman")
  revalidatePath(`/pengumuman/${announcement.slug}`)

  return {
    status: "success",
    message: `${announcement.title} berhasil dihapus dari sistem.`,
  }
}

export { deleteAnnouncement }
