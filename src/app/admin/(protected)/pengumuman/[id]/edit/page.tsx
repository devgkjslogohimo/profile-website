import { notFound } from "next/navigation"

import { requirePermission } from "@/dal/auth"
import { EditAnnouncementView } from "@/features/announcements/components/edit-announcement-view"
import { canEditAnnouncement } from "@/features/announcements/lib/announcement-permissions"
import { getAnnouncementById } from "@/features/announcements/queries/get-announcement-by-id"
import { hasPermission } from "@/lib/auth/permissions"
import { isRichTextContent, type RichTextContent } from "@/lib/rich-text"

type EditAnnouncementPageProps = {
  params: Promise<{
    id: string
  }>
}

async function EditAnnouncementPage({ params }: EditAnnouncementPageProps) {
  const currentUser = await requirePermission("content.edit.own")

  const { id } = await params

  const announcement = await getAnnouncementById(id)

  if (!announcement) {
    notFound()
  }

  if (
    !canEditAnnouncement({
      role: currentUser.role,
      userId: currentUser.id,
      authorId: announcement.authorId,
    })
  ) {
    notFound()
  }

  if (!isRichTextContent(announcement.content)) {
    throw new Error(`Invalid rich text content for announcement ${announcement.id}`)
  }

  const content: RichTextContent = announcement.content

  return (
    <EditAnnouncementView
      announcement={{
        id: announcement.id,
        title: announcement.title,
        slug: announcement.slug,
        content,

        status: announcement.status,

        publishedAt: announcement.publishedAt,

        createdAt: announcement.createdAt,

        updatedAt: announcement.updatedAt,

        author: announcement.author,
      }}
      canPublish={hasPermission(currentUser.role, "content.publish")}
    />
  )
}

export default EditAnnouncementPage
