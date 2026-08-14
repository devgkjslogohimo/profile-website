"use server"

import { revalidatePath, updateTag } from "next/cache"

import { requirePermission } from "@/dal/auth"
import type { AnnouncementPublicationActionResult } from "@/features/announcements/lib/announcement-publication-action-state"
import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"
import { isRichTextContent, isRichTextEmpty } from "@/lib/rich-text"

async function publishAnnouncement(id: string): Promise<AnnouncementPublicationActionResult> {
  await requirePermission("content.publish")

  const announcement = await prisma.announcement.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      slug: true,
      title: true,
      content: true,
      status: true,
    },
  })

  if (!announcement) {
    return {
      status: "error",
      message: "Pengumuman tidak ditemukan.",
    }
  }

  if (announcement.status === "PUBLISHED") {
    return {
      status: "success",
      message: "Pengumuman sudah berstatus Published.",
    }
  }

  if (!announcement.title.trim()) {
    return {
      status: "error",
      message: "Pengumuman belum dapat dipublikasikan karena judul belum tersedia.",
    }
  }

  if (!isRichTextContent(announcement.content) || isRichTextEmpty(announcement.content)) {
    return {
      status: "error",
      message: "Pengumuman belum dapat dipublikasikan karena isi pengumuman belum valid.",
    }
  }

  try {
    await prisma.announcement.update({
      where: {
        id,
      },

      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    })
  } catch (error) {
    console.error("PUBLISH ANNOUNCEMENT FAILED", error)

    return {
      status: "error",
      message: "Pengumuman gagal dipublikasikan. Silakan coba kembali.",
    }
  }
  revalidatePath("/admin/pengumuman")
  revalidatePath(`/admin/pengumuman/${id}/edit`)

  updateTag(PUBLIC_CACHE_TAGS.announcements)

  revalidatePath("/")
  revalidatePath("/pengumuman")
  revalidatePath(`/pengumuman/${announcement.slug}`)

  return {
    status: "success",
    message: "Pengumuman berhasil dipublikasikan.",
  }
}

export { publishAnnouncement }
