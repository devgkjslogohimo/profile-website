import { prisma } from "@/lib/db/prisma"

async function getChurchCouncilMembers() {
  return prisma.churchCouncilMember.findMany({
    orderBy: [
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
