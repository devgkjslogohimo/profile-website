"use client"

import type { UseFormReturn } from "react-hook-form"

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { ChurchStatisticSnapshotFormInput } from "@/features/church-statistics/schemas/church-statistic-snapshot-schema"

type ChurchStatisticSnapshotFormFieldsProps = {
  form: UseFormReturn<ChurchStatisticSnapshotFormInput>
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

function ChurchStatisticSnapshotFormFields({
  form,
  pending,
  editMode = false,
}: ChurchStatisticSnapshotFormFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="title">Judul statistik</FieldLabel>

        <Input
          id="title"
          {...register("title")}
          placeholder="Contoh: Statistik Jemaat 2026"
          disabled={pending}
          aria-invalid={Boolean(errors.title)}
        />

        <FieldDescription>
          {editMode
            ? "Judul dapat diubah tanpa memengaruhi data statistik di dalam snapshot."
            : "Gunakan judul yang mudah menunjukkan waktu atau konteks data."}
        </FieldDescription>

        <FieldError errors={getFieldError(errors.title?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="asOfDate">Tanggal statistik</FieldLabel>

        <Input
          id="asOfDate"
          type="date"
          {...register("asOfDate")}
          disabled={pending}
          aria-invalid={Boolean(errors.asOfDate)}
        />

        <FieldDescription>Tanggal posisi data statistik, bukan periode pelayanan.</FieldDescription>

        <FieldError errors={getFieldError(errors.asOfDate?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="notes">Catatan</FieldLabel>

        <textarea
          id="notes"
          rows={5}
          {...register("notes")}
          placeholder="Contoh: Data jemaat per akhir tahun 2026."
          disabled={pending}
          aria-invalid={Boolean(errors.notes)}
          className="flex min-h-32 w-full rounded-xl border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
        />

        <FieldDescription>Opsional. Maksimal 2000 karakter.</FieldDescription>

        <FieldError errors={getFieldError(errors.notes?.message)} />
      </Field>
    </FieldGroup>
  )
}

export { ChurchStatisticSnapshotFormFields }
