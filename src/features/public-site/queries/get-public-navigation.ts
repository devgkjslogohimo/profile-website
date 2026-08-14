import { unstable_cache } from "next/cache"
import { cache } from "react"

import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

const PUBLIC_NAVIGATION_REVALIDATE_SECONDS = 300

type PublicCmsNavigationItem = {
  id: string
  title: string
  slug: string
  navigationLabel: string
  navigationOrder: number
}

async function findPublicNavigationPages(): Promise<PublicCmsNavigationItem[]> {
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
}

const getCachedPublicNavigationPages = unstable_cache(
  findPublicNavigationPages,
  ["public-navigation-pages-v1"],
  {
    revalidate: PUBLIC_NAVIGATION_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.navigation],
  }
)

const getPublicNavigationPages = cache(async (): Promise<PublicCmsNavigationItem[]> => {
  return getCachedPublicNavigationPages()
})

export { getPublicNavigationPages }
export type { PublicCmsNavigationItem }
