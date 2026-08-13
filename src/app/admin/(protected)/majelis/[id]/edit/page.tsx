import { notFound } from "next/navigation"

import { EditChurchCouncilMemberView } from "@/features/church-councils/components/edit-church-council-member-view"
import { isCurrentChurchCouncilMemberPeriod } from "@/features/church-councils/lib/church-council-member-period"
import { getChurchCouncilMember } from "@/features/church-councils/queries/get-church-council-member"
import { prisma } from "@/lib/db/prisma"

type EditChurchCouncilMemberPageProps = {
  params: Promise<{
    id: string
  }>
}

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10)
}

async function EditChurchCouncilMemberPage({ params }: EditChurchCouncilMemberPageProps) {
  const { id } = await params

  const member = await getChurchCouncilMember(id)

  if (!member) {
    notFound()
  }

  const locations = await prisma.churchLocation.findMany({
    where: {
      OR: [
        {
          isActive: true,
        },
        ...(member.churchLocationId
          ? [
              {
                id: member.churchLocationId,
              },
            ]
          : []),
      ],
    },

    select: {
      id: true,
      name: true,
      type: true,
      isActive: true,
      sortOrder: true,
    },

    orderBy: {
      sortOrder: "asc",
    },
  })

  return (
    <EditChurchCouncilMemberView
      member={{
        id: member.id,
        fullName: member.fullName,
        position: member.position,
        periodStart: formatDateInput(member.periodStart),
        periodEnd: member.periodEnd ? formatDateInput(member.periodEnd) : null,
        photoUrl: member.photoUrl,
        sortOrder: member.sortOrder,
        isActive: member.isActive,
        isCurrent: isCurrentChurchCouncilMemberPeriod(member.periodStart, member.periodEnd),
        churchLocationId: member.churchLocationId,
        churchLocation: member.churchLocation,
      }}
      locations={locations}
    />
  )
}

export default EditChurchCouncilMemberPage
