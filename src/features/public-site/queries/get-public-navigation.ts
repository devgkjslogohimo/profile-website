import { cache } from "react"

import { prisma } from "@/lib/db/prisma"

type PublicCmsNavigationItem = {
  id: string
  title: string
  slug: string
  navigationLabel: string
  navigationOrder: number
}

const getPublicNavigationPages = cache(async (): Promise<PublicCmsNavigationItem[]> => {
  const pages = await prisma.sitePage.findMany({
    where: {
      status: "PUBLISHED",
      showInNavigation: true,

      navigationLabel: {
        not: null,
      },
    },

    select: {
      id: true,
      title: true,
      slug: true,
      navigationLabel: true,
      navigationOrder: true,
    },

    orderBy: [
      {
        navigationOrder: "asc",
      },
      {
        title: "asc",
      },
    ],
  })

  return pages.flatMap((page) => {
    if (!page.navigationLabel) {
      return []
    }

    return [
      {
        id: page.id,
        title: page.title,
        slug: page.slug,
        navigationLabel: page.navigationLabel,
        navigationOrder: page.navigationOrder,
      },
    ]
  })
})

export { getPublicNavigationPages }
export type { PublicCmsNavigationItem }
