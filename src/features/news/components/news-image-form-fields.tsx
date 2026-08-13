"use client"

import type { UseFormReturn } from "react-hook-form"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { NewsImageFormInput } from "@/features/news/schemas/news-image-schema"

type NewsImageFormFieldsProps = {
  form: UseFormReturn<NewsImageFormInput>
  pending: boolean
}

function getFieldError(message: unknown) {
  if (typeof message !== "string") {
    return undefined
  }

  return [{ message }]
}

function NewsImageFormFields({ form, pending }: NewsImageFormFieldsProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = form

  const googleDriveUrl = watch("googleDriveUrl")
  const altText = watch("altText")
  const caption = watch("caption")

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="googleDriveUrl">Link Foto Google Drive</FieldLabel>

        <Input
          id="googleDriveUrl"
          type="url"
          {...register("googleDriveUrl")}
          placeholder="https://drive.google.com/file/d/..."
          disabled={pending}
          aria-invalid={Boolean(errors.googleDriveUrl)}
        />

        <FieldDescription>Masukkan link file gambar, bukan link folder.</FieldDescription>

        <FieldError errors={getFieldError(errors.googleDriveUrl?.message)} />

        {googleDriveUrl ? (
          <GoogleDriveImage
            url={googleDriveUrl}
            alt={altText || caption || "Preview foto berita"}
            className="max-w-xl"
          />
        ) : null}
      </Field>

      <Field>
        <FieldLabel htmlFor="altText">Alt Text</FieldLabel>

        <Input
          id="altText"
          {...register("altText")}
          placeholder="Contoh: Jemaat mengikuti perayaan HUT gereja"
          disabled={pending}
          aria-invalid={Boolean(errors.altText)}
        />

        <FieldDescription>Opsional tetapi disarankan untuk aksesibilitas dan SEO.</FieldDescription>

        <FieldError errors={getFieldError(errors.altText?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="caption">Caption</FieldLabel>

        <Textarea
          id="caption"
          rows={3}
          {...register("caption")}
          placeholder="Keterangan foto, jika diperlukan."
          disabled={pending}
          aria-invalid={Boolean(errors.caption)}
        />

        <FieldDescription>Opsional. Maksimal 500 karakter.</FieldDescription>

        <FieldError errors={getFieldError(errors.caption?.message)} />
      </Field>
    </FieldGroup>
  )
}

export { NewsImageFormFields }
