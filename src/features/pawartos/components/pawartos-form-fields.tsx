"use client"

import type { UseFormReturn } from "react-hook-form"

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { PawartosFormInput } from "@/features/pawartos/schemas/pawartos-schema"

type PawartosFormFieldsProps = {
  form: UseFormReturn<PawartosFormInput>
  pending: boolean
}

function getFieldError(message: unknown) {
  if (typeof message !== "string") {
    return undefined
  }

  return [{ message }]
}

function PawartosFormFields({ form, pending }: PawartosFormFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="title">Judul Pawartos</FieldLabel>

        <Input
          id="title"
          {...register("title")}
          placeholder="Contoh: Pawartos Minggu, 16 Agustus 2026"
          disabled={pending}
          aria-invalid={Boolean(errors.title)}
        />

        <FieldDescription>
          Judul akan digunakan untuk membuat slug halaman Pawartos.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.title?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="publicationDate">Tanggal Pawartos</FieldLabel>

        <Input
          id="publicationDate"
          type="date"
          {...register("publicationDate")}
          disabled={pending}
          aria-invalid={Boolean(errors.publicationDate)}
        />

        <FieldDescription>Gunakan tanggal edisi Pawartos.</FieldDescription>

        <FieldError errors={getFieldError(errors.publicationDate?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Deskripsi Singkat</FieldLabel>

        <Textarea
          id="description"
          rows={4}
          {...register("description")}
          placeholder="Ringkasan singkat isi Pawartos untuk pengunjung dan mesin pencari."
          disabled={pending}
          aria-invalid={Boolean(errors.description)}
        />

        <FieldDescription>
          Opsional. Maksimal 1000 karakter. Deskripsi ini nantinya menjadi teks HTML pada halaman
          publik dan dapat digunakan sebagai dasar metadata SEO.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.description?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="googleDriveUrl">Link PDF Google Drive</FieldLabel>

        <Input
          id="googleDriveUrl"
          type="url"
          {...register("googleDriveUrl")}
          placeholder="https://drive.google.com/file/d/..."
          disabled={pending}
          aria-invalid={Boolean(errors.googleDriveUrl)}
        />

        <FieldDescription>
          Wajib. Masukkan link file PDF dari Google Drive, bukan link folder. Pastikan akses file
          diatur menjadi &quot;Anyone with the link — Viewer&quot; agar nantinya dapat dibaca dari
          website publik.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.googleDriveUrl?.message)} />
      </Field>
    </FieldGroup>
  )
}

export { PawartosFormFields }
