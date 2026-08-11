"use client"

import { type UseFormReturn, useWatch } from "react-hook-form"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { GalleryAlbumFormInput } from "@/features/gallery/schemas/gallery-album-schema"

type GalleryAlbumFormFieldsProps = {
  form: UseFormReturn<GalleryAlbumFormInput>
  pending: boolean
  editMode?: boolean
}

function getFieldError(message: unknown) {
  if (typeof message !== "string") {
    return undefined
  }

  return [{ message }]
}

function GalleryAlbumFormFields({ form, pending, editMode = false }: GalleryAlbumFormFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form

  const title = useWatch({
    control: form.control,
    name: "title",
  })

  const coverImageUrl = useWatch({
    control: form.control,
    name: "coverImageUrl",
  })

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="title">Judul album</FieldLabel>

        <Input
          id="title"
          {...register("title")}
          placeholder="Contoh: Perayaan Natal 2026"
          disabled={pending}
          aria-invalid={Boolean(errors.title)}
        />

        <FieldDescription>
          {editMode
            ? "Mengubah judul juga akan memperbarui slug secara otomatis."
            : "Slug album akan dibuat otomatis dari judul."}
        </FieldDescription>

        <FieldError errors={getFieldError(errors.title?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="eventDate">Tanggal kegiatan</FieldLabel>

        <Input
          id="eventDate"
          type="date"
          {...register("eventDate")}
          disabled={pending}
          aria-invalid={Boolean(errors.eventDate)}
        />

        <FieldDescription>
          Opsional. Isi jika album berkaitan dengan tanggal kegiatan tertentu.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.eventDate?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Deskripsi</FieldLabel>

        <textarea
          id="description"
          rows={5}
          {...register("description")}
          placeholder="Deskripsi singkat mengenai kegiatan atau dokumentasi album."
          disabled={pending}
          aria-invalid={Boolean(errors.description)}
          className="flex min-h-32 w-full rounded-xl border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
        />

        <FieldDescription>Opsional. Maksimal 2000 karakter.</FieldDescription>

        <FieldError errors={getFieldError(errors.description?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="coverImageUrl">Link cover album</FieldLabel>

        <Input
          id="coverImageUrl"
          type="url"
          {...register("coverImageUrl")}
          placeholder="https://drive.google.com/file/d/..."
          disabled={pending}
          aria-invalid={Boolean(errors.coverImageUrl)}
        />

        <FieldDescription>
          Opsional. Gunakan link file gambar Google Drive. Jika dikosongkan, foto aktif pertama
          dalam album akan digunakan sebagai cover.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.coverImageUrl?.message)} />

        {coverImageUrl ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {editMode ? "Preview cover terbaru" : "Preview cover"}
            </p>

            <GoogleDriveImage
              url={coverImageUrl}
              alt={title ? `Preview cover ${title}` : "Preview cover album"}
              className="max-w-xl"
            />
          </div>
        ) : null}
      </Field>

      <Field>
        <FieldLabel htmlFor="googleDriveUrl">Link dokumentasi lengkap</FieldLabel>

        <Input
          id="googleDriveUrl"
          type="url"
          {...register("googleDriveUrl")}
          placeholder="https://drive.google.com/drive/folders/..."
          disabled={pending}
          aria-invalid={Boolean(errors.googleDriveUrl)}
        />

        <FieldDescription>
          Opsional. Gunakan link folder Google Drive yang berisi seluruh dokumentasi. Link ini
          nantinya digunakan untuk tombol &quot;Lihat Semua Foto&quot;.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.googleDriveUrl?.message)} />
      </Field>
    </FieldGroup>
  )
}

export { GalleryAlbumFormFields }
