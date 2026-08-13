"use client"

import type { UseFormReturn } from "react-hook-form"
import { Controller } from "react-hook-form"

import { RichTextEditor } from "@/components/rich-text-editor/rich-text-editor"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { AnnouncementFormInput } from "@/features/announcements/schemas/announcement-schema"

type AnnouncementFormFieldsProps = {
  form: UseFormReturn<AnnouncementFormInput>
  pending: boolean
}

function getFieldError(message: unknown) {
  if (typeof message !== "string") {
    return undefined
  }

  return [{ message }]
}

function AnnouncementFormFields({ form, pending }: AnnouncementFormFieldsProps) {
  const {
    control,
    register,
    formState: { errors },
  } = form

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="title">Judul Pengumuman</FieldLabel>

        <Input
          id="title"
          {...register("title")}
          placeholder="Contoh: Pengumuman Ibadah Gabungan"
          disabled={pending}
          aria-invalid={Boolean(errors.title)}
        />

        <FieldDescription>Judul digunakan untuk membuat slug halaman pengumuman.</FieldDescription>

        <FieldError errors={getFieldError(errors.title?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="displayUntil">Banner Pengumuman Sampai</FieldLabel>

        <Input
          id="displayUntil"
          type="datetime-local"
          {...register("displayUntil")}
          disabled={pending}
          aria-invalid={Boolean(errors.displayUntil)}
        />

        <FieldDescription>
          Opsional. Isi jika pengumuman ingin ditampilkan sebagai banner di atas navigasi pada
          seluruh halaman publik. Setelah waktu ini banner otomatis tidak lagi tampil, tetapi
          halaman pengumuman tetap tersedia.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.displayUntil?.message)} />
      </Field>

      <Field>
        <FieldLabel>Isi Pengumuman</FieldLabel>

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
          Gunakan Heading 2/3, bold, italic, daftar, kutipan, dan link seperlunya.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.content?.message)} />
      </Field>
    </FieldGroup>
  )
}

export { AnnouncementFormFields }
