import { notFound } from "next/navigation"

import { EditChurchFormView } from "@/features/church-forms/components/edit-church-form-view"
import { getChurchForm } from "@/features/church-forms/queries/get-church-form"

type EditChurchFormPageProps = {
  params: Promise<{
    id: string
  }>
}

async function EditChurchFormPage({ params }: EditChurchFormPageProps) {
  const { id } = await params

  const churchForm = await getChurchForm(id)

  if (!churchForm) {
    notFound()
  }

  return (
    <EditChurchFormView
      churchForm={{
        id: churchForm.id,
        title: churchForm.title,
        description: churchForm.description,
        googleFormUrl: churchForm.googleFormUrl,
        sortOrder: churchForm.sortOrder,
        isActive: churchForm.isActive,
      }}
    />
  )
}

export default EditChurchFormPage
