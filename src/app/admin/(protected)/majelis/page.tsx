import { ChurchCouncilMemberManager } from "@/features/church-councils/components/church-council-member-manager"
import { getChurchCouncilMembers } from "@/features/church-councils/queries/get-church-council-members"
import { getActiveChurchLocations } from "@/features/church-locations/queries/get-active-church-locations"

async function ChurchCouncilPage() {
  const [members, locations] = await Promise.all([
    getChurchCouncilMembers(),
    getActiveChurchLocations(),
  ])

  return <ChurchCouncilMemberManager members={members} locations={locations} />
}

export default ChurchCouncilPage
