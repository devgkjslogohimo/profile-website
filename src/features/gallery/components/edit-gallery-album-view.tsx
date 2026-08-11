import { ArrowLeft, ExternalLink, Images } from "lucide-react"
import Link from "next/link"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GalleryAlbumEditForm } from "@/features/gallery/components/gallery-album-edit-form"

type EditGalleryAlbumViewProps = {
  album: {
    id: string
    title: string
    slug: string
    description: string | null
    eventDate: string | null
    coverImageUrl: string | null
    fallbackCoverImageUrl: string | null
    googleDriveUrl: string | null
    isActive: boolean
    imageCount: number
  }
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00.000Z`))
}

function EditGalleryAlbumView({ album }: EditGalleryAlbumViewProps) {
  const effectiveCoverUrl = album.coverImageUrl ?? album.fallbackCoverImageUrl

  return (
    <main className="space-y-6">
      <div>
        <Link
          href="/admin/galeri"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
          })}
        >
          <ArrowLeft />
          Kembali
        </Link>

        <p className="mt-4 text-sm text-muted-foreground">Galeri</p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
            Edit Album
          </h1>

          <Badge variant={album.isActive ? "secondary" : "outline"}>
            {album.isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">{album.title}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preview Cover</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <GoogleDriveImage
            url={effectiveCoverUrl}
            alt={`Cover ${album.title}`}
            className="max-w-2xl"
            eager
          />

          {album.coverImageUrl ? (
            <p className="text-sm text-muted-foreground">Menggunakan cover khusus album.</p>
          ) : album.fallbackCoverImageUrl ? (
            <p className="text-sm text-muted-foreground">
              Cover khusus belum diisi. Preview menggunakan foto aktif pertama dalam album.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Belum tersedia cover maupun foto aktif.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Album</CardTitle>
        </CardHeader>

        <CardContent>
          <GalleryAlbumEditForm
            album={{
              id: album.id,
              title: album.title,
              description: album.description,
              eventDate: album.eventDate,
              coverImageUrl: album.coverImageUrl,
              googleDriveUrl: album.googleDriveUrl,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Sistem</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Slug</p>

            <p className="mt-1 font-medium break-all">/{album.slug}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Status</p>

            <p className="mt-1 font-medium">{album.isActive ? "Aktif" : "Nonaktif"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Tanggal Kegiatan</p>

            <p className="mt-1 font-medium">
              {album.eventDate ? formatDate(album.eventDate) : "Tidak ditentukan"}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Jumlah Foto</p>

            <div className="mt-1 flex items-center gap-2 font-medium">
              <Images className="size-4" />
              {album.imageCount}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground">Dokumentasi Lengkap</p>

            {album.googleDriveUrl ? (
              <Link
                href={album.googleDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline"
              >
                Buka Google Drive
                <ExternalLink className="size-3.5" />
              </Link>
            ) : (
              <p className="mt-1 font-medium">Belum tersedia</p>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export { EditGalleryAlbumView }
