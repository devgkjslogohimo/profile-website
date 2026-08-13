import { requirePermission } from "@/dal/auth"
import { SitePageManager } from "@/features/site-pages/components/site-page-manager"
import { getSitePages } from "@/features/site-pages/queries/get-site-pages"

async function SitePagesPage() {
  const currentUser = await requirePermission("content.create")

  const sitePages = await getSitePages()

  return (
    <SitePageManager
      sitePages={sitePages}
      currentUserId={currentUser.id}
      currentUserRole={currentUser.role}
    />
  )
}

export default SitePagesPage
