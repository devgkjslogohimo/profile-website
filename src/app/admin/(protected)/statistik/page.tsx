import { ChurchStatisticSnapshotManager } from "@/features/church-statistics/components/church-statistic-snapshot-manager"
import { getChurchStatisticSnapshots } from "@/features/church-statistics/queries/get-church-statistic-snapshots"

async function ChurchStatisticPage() {
  const snapshots = await getChurchStatisticSnapshots()

  return <ChurchStatisticSnapshotManager snapshots={snapshots} />
}

export default ChurchStatisticPage
