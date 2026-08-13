"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { AnnouncementPublicationActionResult } from "@/features/announcements/lib/announcement-publication-action-state"
import { prisma } from "@/lib/db/prisma"

async function unpublishAnnouncement(id: string): Promise<AnnouncementPublicationActionResult> {
  await requirePermission("content.publish")

  const announcement = await prisma.announcement.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      slug: true,
      status: true,
    },
  })

  if (!announcement) {
    return {
      status: "error",
      message: "Pengumuman tidak ditemukan.",
    }
  }

  if (announcement.status === "DRAFT") {
    return {
      status: "success",
      message: "Pengumuman sudah berstatus Draft.",
    }
  }

  try {
    await prisma.announcement.update({
      where: {
        id,
      },

      data: {
        status: "DRAFT",
        publishedAt: null,
      },
    })
  } catch (error) {
    console.error("UNPUBLISH ANNOUNCEMENT FAILED", error)

    return {
      status: "error",
      message: "Publikasi pengumuman gagal dibatalkan. Silakan coba kembali.",
    }
  }

  revalidatePath("/admin/pengumuman")
  revalidatePath(`/admin/pengumuman/${id}/edit`)

  revalidatePath("/pengumuman")
  revalidatePath(`/pengumuman/${announcement.slug}`)

  return {
    status: "success",
    message: "Pengumuman dikembalikan menjadi Draft.",
  }
}

export { unpublishAnnouncement }
