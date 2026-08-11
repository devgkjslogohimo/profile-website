import { notFound } from "next/navigation"

import { ChurchStatisticMetricManager } from "@/features/church-statistics/components/church-statistic-metric-manager"
import { getChurchStatisticMetrics } from "@/features/church-statistics/queries/get-church-statistic-metrics"
import { getChurchStatisticSnapshot } from "@/features/church-statistics/queries/get-church-statistic-snapshot"

type ChurchStatisticDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

async function ChurchStatisticDetailPage({ params }: ChurchStatisticDetailPageProps) {
  const { id } = await params

  const [snapshot, metrics] = await Promise.all([
    getChurchStatisticSnapshot(id),
    getChurchStatisticMetrics(id),
  ])

  if (!snapshot) {
    notFound()
  }

  return (
    <ChurchStatisticMetricManager
      snapshot={{
        id: snapshot.id,
        title: snapshot.title,
        asOfDate: snapshot.asOfDate,
        notes: snapshot.notes,
        isActive: snapshot.isActive,
      }}
      metrics={metrics}
    />
  )
}

export default ChurchStatisticDetailPage
