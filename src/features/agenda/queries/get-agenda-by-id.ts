import { prisma } from "@/lib/db/prisma"

async function getAgendaById(id: string) {
  return prisma.agenda.findUnique({
    where: {
      id,
    },

    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

export { getAgendaById }
