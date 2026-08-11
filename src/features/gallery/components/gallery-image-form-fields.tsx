"use client"

import { type UseFormReturn, useWatch } from "react-hook-form"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { GalleryImageFormInput } from "@/features/gallery/schemas/gallery-image-schema"

type GalleryImageFormFieldsProps = {
  form: UseFormReturn<GalleryImageFormInput>
  pending: boolean
  editMode?: boolean
}

function getFieldError(message: unknown) {
  if (typeof message !== "string") {
    return undefined
  }

  return [{ message }]
}

function GalleryImageFormFields({ form, pending, editMode = false }: GalleryImageFormFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form

  const imageUrl = useWatch({
    control: form.control,
    name: "imageUrl",
  })

  const caption = useWatch({
    control: form.control,
    name: "caption",
  })

  const altText = useWatch({
    control: form.control,
    name: "altText",
  })

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="imageUrl">Link foto</FieldLabel>

        <Input
          id="imageUrl"
          type="url"
          {...register("imageUrl")}
          placeholder="https://drive.google.com/file/d/..."
          disabled={pending}
          aria-invalid={Boolean(errors.imageUrl)}
        />

        <FieldDescription>
          Gunakan link file gambar Google Drive dan pastikan akses file dapat dilihat oleh siapa
          saja yang memiliki link.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.imageUrl?.message)} />

        {imageUrl ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {editMode ? "Preview foto terbaru" : "Preview foto"}
            </p>

            <GoogleDriveImage
              url={imageUrl}
              alt={
                altText ||
                caption ||
                (editMode ? "Preview foto galeri terbaru" : "Preview foto galeri")
              }
              className="max-w-xl"
            />
          </div>
        ) : null}
      </Field>

      <Field>
        <FieldLabel htmlFor="caption">Caption</FieldLabel>

        <textarea
          id="caption"
          rows={3}
          {...register("caption")}
          placeholder="Contoh: Perayaan Natal GKJ Slogohimo 2026."
          disabled={pending}
          aria-invalid={Boolean(errors.caption)}
          className="flex min-h-24 w-full rounded-xl border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
        />

        <FieldDescription>Opsional. Maksimal 500 karakter.</FieldDescription>

        <FieldError errors={getFieldError(errors.caption?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="altText">Alt text</FieldLabel>

        <Input
          id="altText"
          {...register("altText")}
          placeholder="Contoh: Jemaat mengikuti ibadah Natal"
          disabled={pending}
          aria-invalid={Boolean(errors.altText)}
        />

        <FieldDescription>
          Opsional. Jelaskan isi foto secara singkat untuk aksesibilitas dan SEO.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.altText?.message)} />
      </Field>
    </FieldGroup>
  )
}

export { GalleryImageFormFields }
