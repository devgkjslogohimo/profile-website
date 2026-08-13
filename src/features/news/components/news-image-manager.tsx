import { ImageIcon, Pencil } from "lucide-react"
import Link from "next/link"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NewsImageCreateForm } from "@/features/news/components/news-image-create-form"

import { DeleteNewsImageButton } from "./delete-news-image-button"
import { NewsAdminLightboxProvider, NewsAdminLightboxTrigger } from "./news-admin-lightbox"
import { ReorderNewsImageButtons } from "./reorder-news-image-buttons"

type NewsImageItem = {
  id: string
  googleDriveUrl: string
  altText: string | null
  caption: string | null
  sortOrder: number
}

type NewsImageManagerProps = {
  newsId: string
  images: NewsImageItem[]
}

function NewsImageManager({ newsId, images }: NewsImageManagerProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Foto Dokumentasi</CardTitle>

          <p className="text-sm text-muted-foreground">
            Tambahkan beberapa foto kegiatan yang berkaitan dengan berita ini.
          </p>
        </CardHeader>

        <CardContent>
          <NewsImageCreateForm newsId={newsId} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Foto Dokumentasi</CardTitle>

          <p className="text-sm text-muted-foreground">{images.length} foto tersimpan.</p>
        </CardHeader>

        <CardContent>
          {images.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <ImageIcon className="mx-auto size-6 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">Belum ada foto dokumentasi</p>
            </div>
          ) : (
            <NewsAdminLightboxProvider images={images}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((image, index) => {
                  const label = image.caption || image.altText || `Foto ${index + 1}`

                  return (
                    <div key={image.id} className="overflow-hidden rounded-xl border">
                      <NewsAdminLightboxTrigger imageId={image.id} label={label}>
                        <GoogleDriveImage
                          url={image.googleDriveUrl}
                          alt={image.altText || image.caption || `Foto berita ${index + 1}`}
                          eager={index === 0}
                        />
                      </NewsAdminLightboxTrigger>

                      <div className="space-y-4 p-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Urutan {index + 1}</p>

                          {image.caption ? (
                            <p className="mt-1 text-sm">{image.caption}</p>
                          ) : (
                            <p className="mt-1 text-sm text-muted-foreground">Tanpa caption</p>
                          )}

                          {image.altText ? (
                            <p className="mt-2 text-xs text-muted-foreground">
                              Alt: {image.altText}
                            </p>
                          ) : (
                            <p className="mt-2 text-xs text-muted-foreground italic">
                              Belum ada alt text.
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                          <ReorderNewsImageButtons
                            id={image.id}
                            label={label}
                            canMoveUp={index > 0}
                            canMoveDown={index < images.length - 1}
                          />

                          <Link
                            href={`/admin/berita/${newsId}/foto/${image.id}/edit`}
                            className={buttonVariants({
                              variant: "outline",
                              size: "sm",
                            })}
                          >
                            <Pencil />
                            Edit
                          </Link>

                          <DeleteNewsImageButton id={image.id} label={label} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </NewsAdminLightboxProvider>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export { NewsImageManager }
