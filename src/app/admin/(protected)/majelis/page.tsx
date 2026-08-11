import { ChurchCouncilMemberManager } from "@/features/church-councils/components/church-council-member-manager"
import { getChurchCouncilMembers } from "@/features/church-councils/queries/get-church-council-members"

async function ChurchCouncilPage() {
  const members = await getChurchCouncilMembers()

  return <ChurchCouncilMemberManager members={members} />
}

export default ChurchCouncilPage
