import { cache } from "react"

import { prisma } from "@/lib/db/prisma"

const getPublicChurchLocationBySlug = cache(async (slug: string) => {
  return prisma.churchLocation.findFirst({
    where: {
      slug,
      isActive: true,
    },

    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      googleMapsUrl: true,

      coverImageUrl: true,
      coverAltText: true,

      images: {
        where: {
          isActive: true,
        },

        select: {
          id: true,
          imageUrl: true,
          caption: true,
          altText: true,
          sortOrder: true,
        },

        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
      },
    },
  })
})

export { getPublicChurchLocationBySlug }
