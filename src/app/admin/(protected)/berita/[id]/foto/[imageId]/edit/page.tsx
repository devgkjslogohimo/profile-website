import { notFound } from "next/navigation"

import { requirePermission } from "@/dal/auth"
import { EditNewsImageView } from "@/features/news/components/edit-news-image-view"
import { canEditNews } from "@/features/news/lib/news-permissions"
import { getNewsImageById } from "@/features/news/queries/get-news-image-by-id"

type EditNewsImagePageProps = {
  params: Promise<{
    id: string
    imageId: string
  }>
}

async function EditNewsImagePage({ params }: EditNewsImagePageProps) {
  const currentUser = await requirePermission("content.edit.own")

  const { id, imageId } = await params

  const image = await getNewsImageById(imageId)

  if (!image || image.newsId !== id) {
    notFound()
  }

  if (
    !canEditNews({
      role: currentUser.role,
      userId: currentUser.id,
      authorId: image.news.authorId,
    })
  ) {
    notFound()
  }

  return (
    <EditNewsImageView
      image={{
        id: image.id,
        newsId: image.newsId,
        googleDriveUrl: image.googleDriveUrl,
        altText: image.altText,
        caption: image.caption,
        sortOrder: image.sortOrder,

        news: {
          title: image.news.title,
        },
      }}
    />
  )
}

export default EditNewsImagePage
