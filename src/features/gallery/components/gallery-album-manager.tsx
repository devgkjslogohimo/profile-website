import { ExternalLink, Images } from "lucide-react"
import Link from "next/link"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteGalleryAlbumButton } from "@/features/gallery/components/delete-gallery-album-button"
import { GalleryAlbumCreateForm } from "@/features/gallery/components/gallery-album-create-form"
import { ReorderGalleryAlbumButtons } from "@/features/gallery/components/reorder-gallery-album-buttons"
import { ToggleGalleryAlbumStatus } from "@/features/gallery/components/toggle-gallery-album-status"

type GalleryAlbumListItem = {
  id: string
  title: string
  slug: string
  description: string | null
  eventDate: Date | null
  coverImageUrl: string | null
  googleDriveUrl: string | null
  sortOrder: number
  isActive: boolean
  _count: {
    images: number
  }
  images: {
    id: string
    imageUrl: string
    caption: string | null
    altText: string | null
  }[]
}

type GalleryAlbumManagerProps = {
  albums: GalleryAlbumListItem[]
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

function GalleryAlbumManager({ albums }: GalleryAlbumManagerProps) {
  const activeCount = albums.filter((album) => album.isActive).length
  const inactiveCount = albums.length - activeCount

  const totalImages = albums.reduce((total, album) => total + album._count.images, 0)

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Media</p>

        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Galeri
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Kelola album dokumentasi dan foto pilihan yang ditampilkan di website GKJ Slogohimo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Album</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2">
              <Images className="size-5 text-muted-foreground" />

              <p className="text-2xl font-semibold">{albums.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Foto Pilihan
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{totalImages}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status Konten
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm font-medium">{activeCount} aktif</p>

            <p className="mt-1 text-xs text-muted-foreground">{inactiveCount} nonaktif</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <details>
            <summary className="cursor-pointer list-none font-medium [&::-webkit-details-marker]:hidden">
              + Tambah Album
            </summary>

            <div className="mt-6 border-t pt-6">
              <GalleryAlbumCreateForm />
            </div>
          </details>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-xl font-semibold">Daftar Album</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Urutan album dapat disesuaikan menggunakan tombol naik dan turun.
          </p>
        </div>

        {albums.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-sm font-medium">Belum ada album galeri</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Tambahkan album menggunakan formulir di atas.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {albums.map((album, index) => {
              const fallbackImage = album.images[0] ?? null

              const effectiveCoverUrl = album.coverImageUrl ?? fallbackImage?.imageUrl ?? null

              const effectiveCoverAlt =
                fallbackImage?.altText || fallbackImage?.caption || `Cover album ${album.title}`

              return (
                <Card key={album.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <CardTitle className="wrap-break-word">{album.title}</CardTitle>

                        <p className="mt-1 text-xs text-muted-foreground">/{album.slug}</p>
                      </div>

                      <Badge variant={album.isActive ? "secondary" : "outline"}>
                        {album.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <GoogleDriveImage
                      url={effectiveCoverUrl}
                      alt={effectiveCoverAlt}
                      eager={index === 0}
                    />

                    <div className="grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          Tanggal Kegiatan
                        </p>

                        <p className="mt-1 font-medium">
                          {album.eventDate
                            ? dateFormatter.format(album.eventDate)
                            : "Tidak ditentukan"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          Foto Pilihan
                        </p>

                        <p className="mt-1 font-medium">{album._count.images} foto</p>
                      </div>
                    </div>

                    {album.description ? (
                      <p className="text-sm text-muted-foreground">{album.description}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Belum ada deskripsi.</p>
                    )}

                    {album.coverImageUrl ? (
                      <p className="text-xs text-muted-foreground">Menggunakan cover khusus.</p>
                    ) : fallbackImage ? (
                      <p className="text-xs text-muted-foreground">
                        Cover menggunakan foto aktif pertama.
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Belum ada cover album.</p>
                    )}

                    {album.googleDriveUrl ? (
                      <Link
                        href={album.googleDriveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        <ExternalLink />
                        Buka Dokumentasi Lengkap
                      </Link>
                    ) : null}

                    <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                      <ReorderGalleryAlbumButtons
                        id={album.id}
                        title={album.title}
                        canMoveUp={index > 0}
                        canMoveDown={index < albums.length - 1}
                      />

                      <ToggleGalleryAlbumStatus
                        id={album.id}
                        title={album.title}
                        isActive={album.isActive}
                      />

                      <Link
                        href={`/admin/galeri/${album.id}`}
                        className={buttonVariants({
                          size: "sm",
                        })}
                      >
                        <Images />
                        Kelola Foto
                      </Link>

                      <Link
                        href={`/admin/galeri/${album.id}/edit`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        Edit
                      </Link>

                      {!album.isActive && album._count.images === 0 ? (
                        <DeleteGalleryAlbumButton id={album.id} title={album.title} />
                      ) : null}
                    </div>

                    {!album.isActive && album._count.images > 0 ? (
                      <p className="text-xs text-muted-foreground">
                        Album tidak dapat dihapus karena masih memiliki foto.
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export { GalleryAlbumManager }
