import { notFound } from "next/navigation"

import { requirePermission } from "@/dal/auth"
import { EditPawartosView } from "@/features/pawartos/components/edit-pawartos-view"
import { canEditPawartos } from "@/features/pawartos/lib/pawartos-permissions"
import { getPawartosById } from "@/features/pawartos/queries/get-pawartos-by-id"
import { hasPermission } from "@/lib/auth/permissions"

type EditPawartosPageProps = {
  params: Promise<{
    id: string
  }>
}

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10)
}

async function EditPawartosPage({ params }: EditPawartosPageProps) {
  const currentUser = await requirePermission("content.edit.own")

  const { id } = await params

  const pawartos = await getPawartosById(id)

  if (!pawartos) {
    notFound()
  }

  if (
    !canEditPawartos({
      role: currentUser.role,
      userId: currentUser.id,
      authorId: pawartos.authorId,
    })
  ) {
    notFound()
  }

  return (
    <EditPawartosView
      pawartos={{
        id: pawartos.id,
        title: pawartos.title,
        slug: pawartos.slug,
        publicationDate: formatDateInput(pawartos.publicationDate),
        description: pawartos.description,
        googleDriveUrl: pawartos.googleDriveUrl,
        status: pawartos.status,
        publishedAt: pawartos.publishedAt,
        createdAt: pawartos.createdAt,
        updatedAt: pawartos.updatedAt,
        author: pawartos.author,
      }}
      canPublish={hasPermission(currentUser.role, "content.publish")}
    />
  )
}

export default EditPawartosPage
