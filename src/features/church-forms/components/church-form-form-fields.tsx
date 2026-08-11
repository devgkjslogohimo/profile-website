"use client"

import type { UseFormReturn } from "react-hook-form"

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { ChurchFormFormInput } from "@/features/church-forms/schemas/church-form-schema"

type ChurchFormFormFieldsProps = {
  form: UseFormReturn<ChurchFormFormInput>
  pending: boolean
}

function getFieldError(message: unknown) {
  if (typeof message !== "string") {
    return undefined
  }

  return [{ message }]
}

function ChurchFormFormFields({ form, pending }: ChurchFormFormFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="title">Nama formulir</FieldLabel>

        <Input
          id="title"
          {...register("title")}
          placeholder="Contoh: Formulir Permohonan Baptis"
          disabled={pending}
          aria-invalid={Boolean(errors.title)}
        />

        <FieldDescription>Gunakan nama yang mudah dipahami jemaat.</FieldDescription>

        <FieldError errors={getFieldError(errors.title?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Deskripsi</FieldLabel>

        <textarea
          id="description"
          rows={4}
          {...register("description")}
          placeholder="Jelaskan secara singkat tujuan formulir."
          disabled={pending}
          aria-invalid={Boolean(errors.description)}
          className="flex min-h-28 w-full rounded-xl border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
        />

        <FieldDescription>Opsional. Maksimal 1000 karakter.</FieldDescription>

        <FieldError errors={getFieldError(errors.description?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="googleFormUrl">Link Google Form</FieldLabel>

        <Input
          id="googleFormUrl"
          type="url"
          {...register("googleFormUrl")}
          placeholder="https://forms.gle/... atau https://docs.google.com/forms/..."
          disabled={pending}
          aria-invalid={Boolean(errors.googleFormUrl)}
        />

        <FieldDescription>
          Gunakan link Google Form yang akan dibuka oleh jemaat. Link `forms.gle` maupun
          `docs.google.com/forms` dapat digunakan.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.googleFormUrl?.message)} />
      </Field>
    </FieldGroup>
  )
}

export { ChurchFormFormFields }
