import { notFound } from "next/navigation"

import { EditChurchMinistryView } from "@/features/church-ministries/components/edit-church-ministry-view"
import { getChurchMinistry } from "@/features/church-ministries/queries/get-church-ministry"

export default async function EditChurchMinistryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const ministry = await getChurchMinistry(id)

  if (!ministry) {
    notFound()
  }

  return <EditChurchMinistryView ministry={ministry} />
}
