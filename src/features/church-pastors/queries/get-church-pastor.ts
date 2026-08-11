import { prisma } from "@/lib/db/prisma"

async function getChurchPastor(id: string) {
  return prisma.churchPastor.findUnique({
    where: {
      id,
    },
  })
}

export { getChurchPastor }
