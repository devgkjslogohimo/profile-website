import { notFound } from "next/navigation"

import { requirePermission } from "@/dal/auth"
import { EditAgendaView } from "@/features/agenda/components/edit-agenda-view"
import { canEditAgenda } from "@/features/agenda/lib/agenda-permissions"
import { getAgendaById } from "@/features/agenda/queries/get-agenda-by-id"
import { hasPermission } from "@/lib/auth/permissions"
import { isRichTextContent, type RichTextContent } from "@/lib/rich-text"

type EditAgendaPageProps = {
  params: Promise<{
    id: string
  }>
}

async function EditAgendaPage({ params }: EditAgendaPageProps) {
  const currentUser = await requirePermission("content.edit.own")

  const { id } = await params

  const agenda = await getAgendaById(id)

  if (!agenda) {
    notFound()
  }

  if (
    !canEditAgenda({
      role: currentUser.role,
      userId: currentUser.id,
      authorId: agenda.authorId,
    })
  ) {
    notFound()
  }

  if (!isRichTextContent(agenda.content)) {
    throw new Error(`Invalid rich text content for agenda ${agenda.id}`)
  }

  const content: RichTextContent = agenda.content

  return (
    <EditAgendaView
      agenda={{
        id: agenda.id,
        title: agenda.title,
        slug: agenda.slug,
        excerpt: agenda.excerpt,
        content,

        startsAt: agenda.startsAt,
        endsAt: agenda.endsAt,

        location: agenda.location,
        googleMapsUrl: agenda.googleMapsUrl,

        coverImageUrl: agenda.coverImageUrl,

        status: agenda.status,
        publishedAt: agenda.publishedAt,

        createdAt: agenda.createdAt,
        updatedAt: agenda.updatedAt,

        author: agenda.author,
      }}
      canPublish={hasPermission(currentUser.role, "content.publish")}
    />
  )
}

export default EditAgendaPage
