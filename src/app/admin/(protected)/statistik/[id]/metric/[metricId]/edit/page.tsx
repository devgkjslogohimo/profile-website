import { notFound } from "next/navigation"

import { EditChurchStatisticMetricView } from "@/features/church-statistics/components/edit-church-statistic-metric-view"
import { getChurchStatisticMetric } from "@/features/church-statistics/queries/get-church-statistic-metric"
import { getChurchStatisticSnapshot } from "@/features/church-statistics/queries/get-church-statistic-snapshot"

type EditChurchStatisticMetricPageProps = {
  params: Promise<{
    id: string
    metricId: string
  }>
}

async function EditChurchStatisticMetricPage({ params }: EditChurchStatisticMetricPageProps) {
  const { id, metricId } = await params

  const [snapshot, metric] = await Promise.all([
    getChurchStatisticSnapshot(id),
    getChurchStatisticMetric(metricId),
  ])

  if (!snapshot || !metric || metric.snapshotId !== snapshot.id) {
    notFound()
  }

  return (
    <EditChurchStatisticMetricView
      snapshot={{
        id: snapshot.id,
        title: snapshot.title,
      }}
      metric={{
        id: metric.id,
        snapshotId: metric.snapshotId,
        category: metric.category,
        label: metric.label,
        value: metric.value,
        unit: metric.unit,
        isActive: metric.isActive,
      }}
    />
  )
}

export default EditChurchStatisticMetricPage
