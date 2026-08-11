import { prisma } from "@/lib/db/prisma"

async function getChurchForm(id: string) {
  return prisma.churchForm.findUnique({
    where: {
      id,
    },
  })
}

export { getChurchForm }
