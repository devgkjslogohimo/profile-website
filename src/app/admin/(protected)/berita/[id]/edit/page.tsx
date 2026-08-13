import { notFound } from "next/navigation"

import { requirePermission } from "@/dal/auth"
import { EditNewsView } from "@/features/news/components/edit-news-view"
import { canEditNews } from "@/features/news/lib/news-permissions"
import { getNewsById } from "@/features/news/queries/get-news-by-id"
import { getNewsImages } from "@/features/news/queries/get-news-images"
import { hasPermission } from "@/lib/auth/permissions"
import { isRichTextContent, type RichTextContent } from "@/lib/rich-text"

type EditNewsPageProps = {
  params: Promise<{
    id: string
  }>
}

async function EditNewsPage({ params }: EditNewsPageProps) {
  const currentUser = await requirePermission("content.edit.own")

  const { id } = await params

  const news = await getNewsById(id)

  if (!news) {
    notFound()
  }

  if (
    !canEditNews({
      role: currentUser.role,
      userId: currentUser.id,
      authorId: news.authorId,
    })
  ) {
    notFound()
  }

  if (!isRichTextContent(news.content)) {
    throw new Error(`Invalid rich text content for news ${news.id}`)
  }

  const content: RichTextContent = news.content

  const images = await getNewsImages(news.id)

  return (
    <EditNewsView
      news={{
        id: news.id,
        title: news.title,
        slug: news.slug,
        excerpt: news.excerpt,
        content,
        coverImageUrl: news.coverImageUrl,

        status: news.status,
        publishedAt: news.publishedAt,

        createdAt: news.createdAt,
        updatedAt: news.updatedAt,

        author: news.author,

        imageCount: news._count.images,
      }}
      images={images}
      canPublish={hasPermission(currentUser.role, "content.publish")}
    />
  )
}

export default EditNewsPage
