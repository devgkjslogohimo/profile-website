"use client"

import type { UseFormReturn } from "react-hook-form"
import { Controller } from "react-hook-form"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { RichTextEditor } from "@/components/rich-text-editor/rich-text-editor"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { NewsFormInput } from "@/features/news/schemas/news-schema"

type NewsFormFieldsProps = {
  form: UseFormReturn<NewsFormInput>
  pending: boolean
}

function getFieldError(message: unknown) {
  if (typeof message !== "string") {
    return undefined
  }

  return [{ message }]
}

function NewsFormFields({ form, pending }: NewsFormFieldsProps) {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = form

  const title = watch("title")
  const coverImageUrl = watch("coverImageUrl")

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="title">Judul Berita</FieldLabel>

        <Input
          id="title"
          {...register("title")}
          placeholder="Contoh: Perayaan HUT GKJ Slogohimo"
          disabled={pending}
          aria-invalid={Boolean(errors.title)}
        />

        <FieldDescription>Judul digunakan untuk membuat slug halaman berita.</FieldDescription>

        <FieldError errors={getFieldError(errors.title?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="excerpt">Ringkasan</FieldLabel>

        <Textarea
          id="excerpt"
          rows={4}
          {...register("excerpt")}
          placeholder="Tuliskan ringkasan singkat berita yang akan tampil pada daftar berita dan metadata SEO."
          disabled={pending}
          aria-invalid={Boolean(errors.excerpt)}
        />

        <FieldDescription>
          Wajib. 10–500 karakter. Ringkasan ini nantinya dapat digunakan sebagai description SEO.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.excerpt?.message)} />
      </Field>

      <Field>
        <FieldLabel>Isi Berita</FieldLabel>

        <Controller
          control={control}
          name="content"
          render={({ field, fieldState }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              disabled={pending}
              invalid={Boolean(fieldState.error)}
            />
          )}
        />

        <FieldDescription>
          Gunakan Heading 2/3, bold, italic, daftar, kutipan, dan link seperlunya. Gambar
          dokumentasi tidak dimasukkan ke editor; gambar akan dikelola terpisah.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.content?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="coverImageUrl">Cover Berita</FieldLabel>

        <Input
          id="coverImageUrl"
          type="url"
          {...register("coverImageUrl")}
          placeholder="https://drive.google.com/file/d/..."
          disabled={pending}
          aria-invalid={Boolean(errors.coverImageUrl)}
        />

        <FieldDescription>
          Opsional selama Draft. Gunakan link file gambar Google Drive. Cover akan diwajibkan
          sebelum berita dapat dipublikasikan.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.coverImageUrl?.message)} />

        {coverImageUrl ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Preview cover</p>

            <GoogleDriveImage
              url={coverImageUrl}
              alt={title ? `Preview cover ${title}` : "Preview cover berita"}
              className="max-w-2xl"
            />
          </div>
        ) : null}
      </Field>
    </FieldGroup>
  )
}

export { NewsFormFields }
