import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NewsEditForm } from "@/features/news/components/news-edit-form"
import type { RichTextContent } from "@/lib/rich-text"

import { DeleteNewsButton } from "./delete-news-button"
import { NewsImageManager } from "./news-image-manager"
import { NewsPublicationButton } from "./news-publication-button"

type EditNewsViewProps = {
  news: {
    id: string
    title: string
    slug: string
    excerpt: string
    content: RichTextContent
    coverImageUrl: string | null

    status: "DRAFT" | "PUBLISHED"
    publishedAt: Date | null

    createdAt: Date
    updatedAt: Date

    author: {
      id: string
      name: string
      email: string
    }

    imageCount: number
  }
  images: {
    id: string
    googleDriveUrl: string
    altText: string | null
    caption: string | null
    sortOrder: number
  }[]
  canPublish: boolean
}

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
})

function formatDateTime(date: Date | null) {
  if (!date) {
    return "Belum tersedia"
  }

  return `${dateTimeFormatter.format(date)} WIB`
}

function EditNewsView({ news, images, canPublish }: EditNewsViewProps) {
  return (
    <main className="space-y-6">
      <div>
        <Link
          href="/admin/berita"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
          })}
        >
          <ArrowLeft />
          Kembali
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Konten</p>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
                Edit Berita
              </h1>

              <Badge variant={news.status === "PUBLISHED" ? "secondary" : "outline"}>
                {news.status === "PUBLISHED" ? "Published" : "Draft"}
              </Badge>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">{news.title}</p>
          </div>

          {canPublish ? (
            <NewsPublicationButton id={news.id} title={news.title} status={news.status} />
          ) : null}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Berita</CardTitle>
        </CardHeader>

        <CardContent>
          <NewsEditForm
            news={{
              id: news.id,
              title: news.title,
              excerpt: news.excerpt,
              content: news.content,
              coverImageUrl: news.coverImageUrl,
            }}
          />
        </CardContent>
      </Card>

      <NewsImageManager newsId={news.id} images={images} />

      <Card>
        <CardHeader>
          <CardTitle>Informasi Sistem</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Penulis</p>

            <p className="mt-1 font-medium">{news.author.name}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Slug</p>

            <p className="mt-1 font-medium break-all">{news.slug}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Status</p>

            <p className="mt-1 font-medium">
              {news.status === "PUBLISHED" ? "Published" : "Draft"}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Dipublikasikan</p>

            <p className="mt-1 font-medium">{formatDateTime(news.publishedAt)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Dibuat</p>

            <p className="mt-1 font-medium">{formatDateTime(news.createdAt)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Diperbarui</p>

            <p className="mt-1 font-medium">{formatDateTime(news.updatedAt)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hapus Berita</CardTitle>

          <p className="text-sm text-muted-foreground">
            {news.status === "DRAFT"
              ? "Hapus berita dan seluruh record foto dokumentasinya secara permanen dari sistem."
              : "Berita yang sudah dipublikasikan harus dikembalikan menjadi Draft sebelum dapat dihapus."}
          </p>
        </CardHeader>

        <CardContent>
          {news.status === "DRAFT" ? (
            <DeleteNewsButton
              id={news.id}
              title={news.title}
              imageCount={images.length}
              redirectAfterDelete
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Batalkan publikasi terlebih dahulu untuk mengaktifkan operasi hapus.
            </p>
          )}
        </CardContent>
      </Card>

      {news.status === "DRAFT" && !news.coverImageUrl ? (
        <p className="text-sm text-muted-foreground">
          Berita ini masih Draft dan belum memiliki cover. Tambahkan cover sebelum melakukan
          publikasi.
        </p>
      ) : null}

      {news.status === "PUBLISHED" ? (
        <p className="text-xs text-muted-foreground">
          Berita sudah dipublikasikan. Perubahan judul tidak akan mengubah slug agar URL publik
          tetap stabil.
        </p>
      ) : null}
    </main>
  )
}

export { EditNewsView }
