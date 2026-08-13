"use client"

import { Controller, type UseFormReturn } from "react-hook-form"

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
    watch,
    formState: { errors },
  } = form

  const showInNavigation = watch("showInNavigation")

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

        <FieldDescription>Judul digunakan untuk membuat alamat publik halaman.</FieldDescription>

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
          Gunakan Heading 2/3, bold, italic, daftar, kutipan, dan link seperlunya.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.content?.message)} />
      </Field>

      <div className="rounded-xl border p-5">
        <label htmlFor="showInNavigation" className="flex cursor-pointer items-start gap-3">
          <input
            id="showInNavigation"
            type="checkbox"
            {...register("showInNavigation")}
            disabled={pending}
            className="mt-1 size-4 shrink-0 rounded border-border accent-primary"
          />

          <span>
            <span className="block text-sm font-medium">Tampilkan di navigasi website</span>

            <span className="mt-1 block text-sm leading-6 text-muted-foreground">
              Aktifkan jika halaman ini ingin muncul pada menu website publik.
            </span>
          </span>
        </label>
      </div>

      {showInNavigation ? (
        <div className="grid gap-5 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="navigationLabel">Label Menu</FieldLabel>

            <Input
              id="navigationLabel"
              {...register("navigationLabel")}
              placeholder="Contoh: Sejarah"
              disabled={pending}
              aria-invalid={Boolean(errors.navigationLabel)}
            />

            <FieldDescription>Nama pendek yang akan tampil pada navigasi.</FieldDescription>

            <FieldError errors={getFieldError(errors.navigationLabel?.message)} />
          </Field>

          <Field>
            <FieldLabel htmlFor="navigationOrder">Urutan Menu</FieldLabel>

            <Input
              id="navigationOrder"
              type="number"
              min={0}
              max={9999}
              step={1}
              {...register("navigationOrder", {
                setValueAs: (value) => (value === "" ? 0 : Number(value)),
              })}
              disabled={pending}
              aria-invalid={Boolean(errors.navigationOrder)}
            />

            <FieldDescription>
              Angka lebih kecil ditampilkan lebih dahulu. Contoh: 10, 20, 30.
            </FieldDescription>

            <FieldError errors={getFieldError(errors.navigationOrder?.message)} />
          </Field>
        </div>
      ) : null}
    </FieldGroup>
  )
}

export { SitePageFormFields }
