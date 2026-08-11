import { prisma } from "@/lib/db/prisma"

async function getChurchForms() {
  return prisma.churchForm.findMany({
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

export { getChurchForms }
