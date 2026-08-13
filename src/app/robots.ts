import type { MetadataRoute } from "next"

import { getAbsoluteSiteUrl } from "@/lib/site-url"

function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/design-system"],
      },
    ],

    sitemap: getAbsoluteSiteUrl("/sitemap.xml"),
  }
}

export default robots
