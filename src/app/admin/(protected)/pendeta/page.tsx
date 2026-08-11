import { ChurchPastorList } from "@/features/church-pastors/components/church-pastor-list"
import { getChurchPastors } from "@/features/church-pastors/queries/get-church-pastors"

async function ChurchPastorsPage() {
  const pastors = await getChurchPastors()

  return <ChurchPastorList pastors={pastors} />
}

export default ChurchPastorsPage
