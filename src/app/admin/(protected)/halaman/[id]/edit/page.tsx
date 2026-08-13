import { notFound } from "next/navigation"

import { requirePermission } from "@/dal/auth"
import { EditSitePageView } from "@/features/site-pages/components/edit-site-page-view"
import { canEditSitePage } from "@/features/site-pages/lib/site-page-permissions"
import { getSitePageById } from "@/features/site-pages/queries/get-site-page-by-id"
import { hasPermission } from "@/lib/auth/permissions"
import { isRichTextContent, type RichTextContent } from "@/lib/rich-text"

type EditSitePageProps = {
  params: Promise<{
    id: string
  }>
}

async function EditSitePage({ params }: EditSitePageProps) {
  const currentUser = await requirePermission("content.edit.own")

  const { id } = await params

  const sitePage = await getSitePageById(id)

  if (!sitePage) {
    notFound()
  }

  if (
    !canEditSitePage({
      role: currentUser.role,
      userId: currentUser.id,
      authorId: sitePage.authorId,
    })
  ) {
    notFound()
  }

  if (!isRichTextContent(sitePage.content)) {
    throw new Error(`Invalid rich text content for site page ${sitePage.id}`)
  }

  const content: RichTextContent = sitePage.content

  return (
    <EditSitePageView
      sitePage={{
        id: sitePage.id,
        title: sitePage.title,
        slug: sitePage.slug,
        content,

        status: sitePage.status,

        publishedAt: sitePage.publishedAt,

        createdAt: sitePage.createdAt,

        updatedAt: sitePage.updatedAt,

        author: sitePage.author,
      }}
      canPublish={hasPermission(currentUser.role, "content.publish")}
    />
  )
}

export default EditSitePage
