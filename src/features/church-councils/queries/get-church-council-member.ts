import { prisma } from "@/lib/db/prisma"

async function getChurchCouncilMember(id: string) {
  return prisma.churchCouncilMember.findUnique({
    where: {
      id,
    },

    include: {
      churchLocation: {
        select: {
          id: true,
          name: true,
          type: true,
          isActive: true,
        },
      },
    },
  })
}

export { getChurchCouncilMember }
