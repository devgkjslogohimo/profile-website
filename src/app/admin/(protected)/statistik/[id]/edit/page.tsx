import { notFound } from "next/navigation"

import { EditChurchStatisticSnapshotView } from "@/features/church-statistics/components/edit-church-statistic-snapshot-view"
import { getChurchStatisticSnapshot } from "@/features/church-statistics/queries/get-church-statistic-snapshot"

type EditChurchStatisticSnapshotPageProps = {
  params: Promise<{
    id: string
  }>
}

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10)
}

async function EditChurchStatisticSnapshotPage({ params }: EditChurchStatisticSnapshotPageProps) {
  const { id } = await params

  const snapshot = await getChurchStatisticSnapshot(id)

  if (!snapshot) {
    notFound()
  }

  return (
    <EditChurchStatisticSnapshotView
      snapshot={{
        id: snapshot.id,
        title: snapshot.title,
        asOfDate: formatDateInput(snapshot.asOfDate),
        notes: snapshot.notes,
        isActive: snapshot.isActive,
        metricCount: snapshot._count.metrics,
      }}
    />
  )
}

export default EditChurchStatisticSnapshotPage
