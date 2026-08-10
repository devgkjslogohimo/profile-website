import { ChurchMinistryManager } from "@/features/church-ministries/components/church-ministry-manager"
import { getChurchMinistries } from "@/features/church-ministries/queries/get-church-ministries"

export default async function ChurchMinistriesPage() {
  const ministries = await getChurchMinistries()

  return <ChurchMinistryManager ministries={ministries} />
}
