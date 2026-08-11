import { ArrowLeft, ExternalLink, ImageIcon, Pencil } from "lucide-react"
import Link from "next/link"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteGalleryImageButton } from "@/features/gallery/components/delete-gallery-image-button"
import { GalleryImageCreateForm } from "@/features/gallery/components/gallery-image-create-form"
import { ReorderGalleryImageButtons } from "@/features/gallery/components/reorder-gallery-image-buttons"
import { ToggleGalleryImageStatus } from "@/features/gallery/components/toggle-gallery-image-status"

import { GalleryAdminLightboxProvider, GalleryAdminLightboxTrigger } from "./gallery-admin-lightbox"

type GalleryAlbum = {
  id: string
  title: string
  slug: string
  description: string | null
  eventDate: Date | null
  googleDriveUrl: string | null
  isActive: boolean
}

type GalleryImage = {
  id: string
  albumId: string
  imageUrl: string
  caption: string | null
  altText: string | null
  sortOrder: number
  isActive: boolean
}

type GalleryImageManagerProps = {
  album: GalleryAlbum
  images: GalleryImage[]
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

function GalleryImageManager({ album, images }: GalleryImageManagerProps) {
  const activeCount = images.filter((image) => image.isActive).length
  const inactiveCount = images.length - activeCount

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
            {album.title}
          </h1>

          <Badge variant={album.isActive ? "secondary" : "outline"}>
            {album.isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          Kelola foto pilihan yang akan ditampilkan pada album ini.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/admin/galeri/${album.id}/edit`}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
            })}
          >
            <Pencil />
            Edit Album
          </Link>

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
              Dokumentasi Lengkap
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Foto</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2">
              <ImageIcon className="size-5 text-muted-foreground" />

              <p className="text-2xl font-semibold">{images.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Foto Aktif</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{activeCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Foto Nonaktif
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{inactiveCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="grid gap-4 pt-6 text-sm sm:grid-cols-3">
          <div>
            <p className="text-muted-foreground">Slug</p>
            <p className="mt-1 font-medium break-all">/{album.slug}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Tanggal Kegiatan</p>

            <p className="mt-1 font-medium">
              {album.eventDate ? dateFormatter.format(album.eventDate) : "Tidak ditentukan"}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Deskripsi</p>

            <p className="mt-1 font-medium">{album.description || "Belum tersedia"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <details>
            <summary className="cursor-pointer list-none font-medium [&::-webkit-details-marker]:hidden">
              + Tambah Foto
            </summary>

            <div className="mt-6 border-t pt-6">
              <GalleryImageCreateForm albumId={album.id} />
            </div>
          </details>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-xl font-semibold">Foto Pilihan</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Klik foto untuk melihat ukuran besar. Urutan foto dapat disesuaikan menggunakan tombol
            naik dan turun. Foto aktif pertama juga menjadi fallback cover jika album tidak memiliki
            cover khusus.
          </p>
        </div>

        {images.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-sm font-medium">Belum ada foto</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Tambahkan foto pilihan menggunakan formulir di atas.
              </p>
            </CardContent>
          </Card>
        ) : (
          <GalleryAdminLightboxProvider images={images}>
            <div className="grid gap-4 md:grid-cols-2">
              {images.map((image, index) => {
                const label = image.caption || `Foto ${index + 1}`

                return (
                  <Card key={image.id}>
                    <CardContent className="space-y-4 pt-6">
                      <GalleryAdminLightboxTrigger imageId={image.id} label={label}>
                        <GoogleDriveImage
                          url={image.imageUrl}
                          alt={image.altText || image.caption || album.title}
                          eager={index === 0}
                        />
                      </GalleryAdminLightboxTrigger>

                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-medium">{image.caption || "Tanpa caption"}</p>

                          {image.altText ? (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Alt: {image.altText}
                            </p>
                          ) : (
                            <p className="mt-1 text-xs text-muted-foreground italic">
                              Belum ada alt text.
                            </p>
                          )}
                        </div>

                        <Badge variant={image.isActive ? "secondary" : "outline"}>
                          {image.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                        <ReorderGalleryImageButtons
                          id={image.id}
                          label={label}
                          canMoveUp={index > 0}
                          canMoveDown={index < images.length - 1}
                        />

                        <ToggleGalleryImageStatus
                          id={image.id}
                          label={label}
                          isActive={image.isActive}
                        />

                        <Link
                          href={`/admin/galeri/${album.id}/foto/${image.id}/edit`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                          })}
                        >
                          Edit
                        </Link>

                        {!image.isActive ? (
                          <DeleteGalleryImageButton id={image.id} label={label} />
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </GalleryAdminLightboxProvider>
        )}
      </div>
    </main>
  )
}

export { GalleryImageManager }
