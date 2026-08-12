"use client"

import { Controller, type UseFormReturn } from "react-hook-form"

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  type BibleStudyDayOfWeek,
  dayOfWeekLabels,
} from "@/features/bible-study-schedules/lib/day-of-week"
import type { BibleStudyScheduleFormInput } from "@/features/bible-study-schedules/schemas/bible-study-schedule-schema"

type BibleStudyScheduleFormFieldsProps = {
  form: UseFormReturn<BibleStudyScheduleFormInput>
  pending: boolean
}

const dayValues: BibleStudyDayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]

function isBibleStudyDayOfWeek(value: string | null): value is BibleStudyDayOfWeek {
  return dayValues.some((day) => day === value)
}

function getFieldError(message: unknown) {
  if (typeof message !== "string") {
    return undefined
  }

  return [{ message }]
}

function BibleStudyScheduleFormFields({ form, pending }: BibleStudyScheduleFormFieldsProps) {
  const {
    control,
    register,
    formState: { errors },
  } = form

  return (
    <FieldGroup>
      <div className="grid gap-5 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="groupName">Nama kelompok</FieldLabel>

          <Input
            id="groupName"
            {...register("groupName")}
            placeholder="Contoh: PA Slogohimo"
            disabled={pending}
            aria-invalid={Boolean(errors.groupName)}
          />

          <FieldDescription>Nama kelompok atau wilayah pelaksanaan PA.</FieldDescription>

          <FieldError errors={getFieldError(errors.groupName?.message)} />
        </Field>

        <Field>
          <FieldLabel htmlFor="dayOfWeek">Hari</FieldLabel>

          <Controller
            control={control}
            name="dayOfWeek"
            render={({ field }) => (
              <Select
                value={field.value ?? null}
                onValueChange={(value) => {
                  if (!isBibleStudyDayOfWeek(value)) {
                    return
                  }

                  field.onChange(value)
                }}
                disabled={pending}
              >
                <SelectTrigger
                  id="dayOfWeek"
                  className="w-full"
                  aria-invalid={Boolean(errors.dayOfWeek)}
                >
                  <SelectValue placeholder="Pilih hari" />
                </SelectTrigger>

                <SelectContent>
                  {dayValues.map((day) => (
                    <SelectItem key={day} value={day}>
                      {dayOfWeekLabels[day]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <FieldDescription>Pilih hari pelaksanaan PA.</FieldDescription>

          <FieldError errors={getFieldError(errors.dayOfWeek?.message)} />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="startTime">Jam mulai</FieldLabel>

          <Input
            id="startTime"
            type="time"
            {...register("startTime")}
            disabled={pending}
            aria-invalid={Boolean(errors.startTime)}
          />

          <FieldDescription>Gunakan waktu mulai kegiatan PA.</FieldDescription>

          <FieldError errors={getFieldError(errors.startTime?.message)} />
        </Field>

        <Field>
          <FieldLabel htmlFor="location">Lokasi</FieldLabel>

          <Input
            id="location"
            {...register("location")}
            placeholder="Contoh: GKJ Slogohimo atau rumah jemaat"
            disabled={pending}
            aria-invalid={Boolean(errors.location)}
          />

          <FieldDescription>
            Opsional. Lokasi dapat berupa gereja, pepanthan, atau tempat lainnya.
          </FieldDescription>

          <FieldError errors={getFieldError(errors.location?.message)} />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="leaderName">Pemimpin</FieldLabel>

        <Input
          id="leaderName"
          {...register("leaderName")}
          placeholder="Nama pemimpin PA"
          disabled={pending}
          aria-invalid={Boolean(errors.leaderName)}
        />

        <FieldDescription>Opsional. Nama pemimpin atau penanggung jawab PA.</FieldDescription>

        <FieldError errors={getFieldError(errors.leaderName?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="notes">Catatan</FieldLabel>

        <Textarea
          id="notes"
          rows={4}
          {...register("notes")}
          placeholder="Catatan tambahan mengenai jadwal PA..."
          disabled={pending}
          aria-invalid={Boolean(errors.notes)}
        />

        <FieldDescription>Opsional. Maksimal 1000 karakter.</FieldDescription>

        <FieldError errors={getFieldError(errors.notes?.message)} />
      </Field>
    </FieldGroup>
  )
}

export { BibleStudyScheduleFormFields }
