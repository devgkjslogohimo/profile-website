import { prisma } from "@/lib/db/prisma"

async function getPawartosById(id: string) {
  return prisma.pawartos.findUnique({
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

export { getPawartosById }
