import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NewsImageEditForm } from "@/features/news/components/news-image-edit-form"

type EditNewsImageViewProps = {
  image: {
    id: string
    newsId: string
    googleDriveUrl: string
    altText: string | null
    caption: string | null
    sortOrder: number

    news: {
      title: string
    }
  }
}

function EditNewsImageView({ image }: EditNewsImageViewProps) {
  return (
    <main className="space-y-6">
      <div>
        <Link
          href={`/admin/berita/${image.newsId}/edit`}
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
          })}
        >
          <ArrowLeft />
          Kembali
        </Link>

        <p className="mt-4 text-sm text-muted-foreground">Berita</p>

        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Edit Foto Dokumentasi
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">{image.news.title}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Foto</CardTitle>
        </CardHeader>

        <CardContent>
          <NewsImageEditForm
            image={{
              id: image.id,
              newsId: image.newsId,
              googleDriveUrl: image.googleDriveUrl,
              altText: image.altText,
              caption: image.caption,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Sistem</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">Urutan foto</p>

          <p className="mt-1 font-medium">{image.sortOrder + 1}</p>
        </CardContent>
      </Card>
    </main>
  )
}

export { EditNewsImageView }
