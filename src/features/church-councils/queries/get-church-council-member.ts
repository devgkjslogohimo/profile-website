import { prisma } from "@/lib/db/prisma"

async function getChurchCouncilMember(id: string) {
  return prisma.churchCouncilMember.findUnique({
    where: {
      id,
    },
  })
}

export { getChurchCouncilMember }
