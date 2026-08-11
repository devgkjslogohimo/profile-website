"use client"

import { type UseFormReturn, useWatch } from "react-hook-form"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { ChurchPastorFormInput } from "@/features/church-pastors/schemas/church-pastor-schema"

type ChurchPastorFormFieldsProps = {
  form: UseFormReturn<ChurchPastorFormInput>
  pending: boolean
  editMode?: boolean
}

function getFieldError(message: unknown) {
  if (typeof message !== "string") {
    return undefined
  }

  return [
    {
      message,
    },
  ]
}

function ChurchPastorFormFields({ form, pending, editMode = false }: ChurchPastorFormFieldsProps) {
  const fullName = useWatch({
    control: form.control,
    name: "fullName",
  })

  const photoUrl = useWatch({
    control: form.control,
    name: "photoUrl",
  })

  const {
    register,
    formState: { errors },
  } = form

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="fullName">Nama pendeta</FieldLabel>

        <Input
          id="fullName"
          {...register("fullName")}
          placeholder="Contoh: Pdt. Nama Pendeta"
          disabled={pending}
          aria-invalid={Boolean(errors.fullName)}
        />

        <FieldDescription>
          {editMode
            ? "Mengubah nama juga akan memperbarui slug secara otomatis."
            : "Slug akan dibuat otomatis dari nama pendeta."}
        </FieldDescription>

        <FieldError errors={getFieldError(errors.fullName?.message)} />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="periodStart">Periode mulai</FieldLabel>

          <Input
            id="periodStart"
            type="date"
            {...register("periodStart")}
            disabled={pending}
            aria-invalid={Boolean(errors.periodStart)}
          />

          <FieldDescription>Tanggal mulai periode pelayanan pendeta.</FieldDescription>

          <FieldError errors={getFieldError(errors.periodStart?.message)} />
        </Field>

        <Field>
          <FieldLabel htmlFor="periodEnd">Periode selesai</FieldLabel>

          <Input
            id="periodEnd"
            type="date"
            {...register("periodEnd")}
            disabled={pending}
            aria-invalid={Boolean(errors.periodEnd)}
          />

          <FieldDescription>
            Opsional. Kosongkan jika masih melayani sampai sekarang.
          </FieldDescription>

          <FieldError errors={getFieldError(errors.periodEnd?.message)} />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="summary">Ringkasan</FieldLabel>

        <textarea
          id="summary"
          rows={3}
          {...register("summary")}
          placeholder="Ringkasan singkat mengenai pendeta."
          disabled={pending}
          aria-invalid={Boolean(errors.summary)}
          className="flex min-h-24 w-full rounded-xl border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
        />

        <FieldDescription>Opsional. Maksimal 300 karakter.</FieldDescription>

        <FieldError errors={getFieldError(errors.summary?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="biography">Biografi</FieldLabel>

        <textarea
          id="biography"
          rows={8}
          {...register("biography")}
          placeholder="Riwayat pelayanan, pendidikan, atau informasi lain mengenai pendeta."
          disabled={pending}
          aria-invalid={Boolean(errors.biography)}
          className="flex min-h-40 w-full rounded-xl border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
        />

        <FieldDescription>Opsional. Maksimal 5000 karakter.</FieldDescription>

        <FieldError errors={getFieldError(errors.biography?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="photoUrl">Link foto</FieldLabel>

        <Input
          id="photoUrl"
          type="url"
          {...register("photoUrl")}
          placeholder="https://drive.google.com/..."
          disabled={pending}
          aria-invalid={Boolean(errors.photoUrl)}
        />

        <FieldDescription>
          Opsional. Gunakan link file Google Drive dan pastikan akses file diatur ke &quot;Siapa
          saja yang memiliki link&quot;.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.photoUrl?.message)} />

        {photoUrl ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Preview foto</p>

            <GoogleDriveImage
              url={photoUrl}
              alt={fullName ? `Preview foto ${fullName}` : "Preview foto pendeta"}
              className="max-w-xl"
            />
          </div>
        ) : null}
      </Field>
    </FieldGroup>
  )
}

export { ChurchPastorFormFields }
