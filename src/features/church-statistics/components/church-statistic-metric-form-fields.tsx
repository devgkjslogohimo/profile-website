"use client"

import type { UseFormReturn } from "react-hook-form"

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { ChurchStatisticMetricFormInput } from "@/features/church-statistics/schemas/church-statistic-metric-schema"

type ChurchStatisticMetricFormFieldsProps = {
  form: UseFormReturn<ChurchStatisticMetricFormInput>
  pending: boolean
}

function getFieldError(message: unknown) {
  if (typeof message !== "string") {
    return undefined
  }

  return [{ message }]
}

function ChurchStatisticMetricFormFields({ form, pending }: ChurchStatisticMetricFormFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="category">Kategori</FieldLabel>

        <Input
          id="category"
          {...register("category")}
          placeholder="Contoh: Keanggotaan"
          disabled={pending}
          aria-invalid={Boolean(errors.category)}
        />

        <FieldDescription>
          Data dengan kategori yang sama akan ditampilkan dalam satu kelompok.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.category?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="label">Nama statistik</FieldLabel>

        <Input
          id="label"
          {...register("label")}
          placeholder="Contoh: Total Jemaat"
          disabled={pending}
          aria-invalid={Boolean(errors.label)}
        />

        <FieldError errors={getFieldError(errors.label?.message)} />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="value">Nilai</FieldLabel>

          <Input
            id="value"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            {...register("value")}
            placeholder="Contoh: 1250"
            disabled={pending}
            aria-invalid={Boolean(errors.value)}
          />

          <FieldDescription>Gunakan bilangan bulat nol atau lebih besar.</FieldDescription>

          <FieldError errors={getFieldError(errors.value?.message)} />
        </Field>

        <Field>
          <FieldLabel htmlFor="unit">Satuan</FieldLabel>

          <Input
            id="unit"
            {...register("unit")}
            placeholder="Contoh: orang, KK"
            disabled={pending}
            aria-invalid={Boolean(errors.unit)}
          />

          <FieldDescription>Opsional.</FieldDescription>

          <FieldError errors={getFieldError(errors.unit?.message)} />
        </Field>
      </div>
    </FieldGroup>
  )
}

export { ChurchStatisticMetricFormFields }
