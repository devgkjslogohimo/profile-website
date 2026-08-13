import { prisma } from "@/lib/db/prisma"

async function getAnnouncementById(id: string) {
  return prisma.announcement.findUnique({
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

export { getAnnouncementById }
