import { prisma } from "@/lib/db/prisma"

async function getAgendas() {
  return prisma.agenda.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,

      startsAt: true,
      endsAt: true,

      location: true,
      googleMapsUrl: true,

      coverImageUrl: true,

      status: true,
      publishedAt: true,

      createdAt: true,
      updatedAt: true,

      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },

    orderBy: [
      {
        startsAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  })
}

export { getAgendas }
