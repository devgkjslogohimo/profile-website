"use client"

import type { UseFormReturn } from "react-hook-form"
import { Controller } from "react-hook-form"

import { RichTextEditor } from "@/components/rich-text-editor/rich-text-editor"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { SitePageFormInput } from "@/features/site-pages/schemas/site-page-schema"

type SitePageFormFieldsProps = {
  form: UseFormReturn<SitePageFormInput>
  pending: boolean
}

function getFieldError(message: unknown) {
  if (typeof message !== "string") {
    return undefined
  }

  return [{ message }]
}

function SitePageFormFields({ form, pending }: SitePageFormFieldsProps) {
  const {
    control,
    register,
    formState: { errors },
  } = form

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="title">Judul Halaman</FieldLabel>

        <Input
          id="title"
          {...register("title")}
          placeholder="Contoh: Sejarah GKJ Slogohimo"
          disabled={pending}
          aria-invalid={Boolean(errors.title)}
        />

        <FieldDescription>
          Judul digunakan untuk membuat slug halaman publik. Contoh: Sejarah GKJ Slogohimo akan
          menghasilkan slug sejarah-gkj-slogohimo.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.title?.message)} />
      </Field>

      <Field>
        <FieldLabel>Isi Halaman</FieldLabel>

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
          Isi konten halaman menggunakan editor. Gunakan Heading 2/3, bold, italic, daftar, kutipan,
          dan link seperlunya.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.content?.message)} />
      </Field>
    </FieldGroup>
  )
}

export { SitePageFormFields }
