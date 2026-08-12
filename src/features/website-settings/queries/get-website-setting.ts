import { prisma } from "@/lib/db/prisma"

async function getWebsiteSetting() {
  return prisma.websiteSetting.findUnique({
    where: {
      id: "main",
    },
  })
}

export { getWebsiteSetting }
