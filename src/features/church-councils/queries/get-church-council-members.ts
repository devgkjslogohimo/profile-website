import { prisma } from "@/lib/db/prisma"

async function getChurchCouncilMembers() {
  return prisma.churchCouncilMember.findMany({
    select: {
      id: true,
      churchLocationId: true,
      fullName: true,
      position: true,
      periodStart: true,
      periodEnd: true,
      photoUrl: true,
      sortOrder: true,
      isActive: true,

      churchLocation: {
        select: {
          id: true,
          name: true,
          type: true,
          sortOrder: true,
          isActive: true,
        },
      },
    },

    orderBy: [
      {
        churchLocation: {
          sortOrder: "asc",
        },
      },
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  })
}

export { getChurchCouncilMembers }
