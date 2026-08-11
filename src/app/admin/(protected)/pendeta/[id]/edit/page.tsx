import { notFound } from "next/navigation"

import { EditChurchPastorView } from "@/features/church-pastors/components/edit-church-pastor-view"
import { getChurchPastor } from "@/features/church-pastors/queries/get-church-pastor"

type EditChurchPastorPageProps = {
  params: Promise<{
    id: string
  }>
}

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10)
}

async function EditChurchPastorPage({ params }: EditChurchPastorPageProps) {
  const { id } = await params

  const pastor = await getChurchPastor(id)

  if (!pastor) {
    notFound()
  }

  return (
    <EditChurchPastorView
      pastor={{
        id: pastor.id,
        fullName: pastor.fullName,
        slug: pastor.slug,
        periodStart: formatDateInput(pastor.periodStart),
        periodEnd: pastor.periodEnd ? formatDateInput(pastor.periodEnd) : null,
        summary: pastor.summary,
        biography: pastor.biography,
        photoUrl: pastor.photoUrl,
        isActive: pastor.isActive,
      }}
    />
  )
}

export default EditChurchPastorPage
