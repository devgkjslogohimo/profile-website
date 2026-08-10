"use client"

import Link from "next/link"
import { useActionState, useEffect, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { updateBibleStudySchedule } from "@/features/bible-study-schedules/actions/update-bible-study-schedule"
import {
  type BibleStudyScheduleActionState,
  initialBibleStudyScheduleActionState,
} from "@/features/bible-study-schedules/lib/action-state"
import type { BibleStudyDayOfWeek } from "@/features/bible-study-schedules/lib/day-of-week"

const dayOptions = [
  { value: "MONDAY", label: "Senin" },
  { value: "TUESDAY", label: "Selasa" },
  { value: "WEDNESDAY", label: "Rabu" },
  { value: "THURSDAY", label: "Kamis" },
  { value: "FRIDAY", label: "Jumat" },
  { value: "SATURDAY", label: "Sabtu" },
  { value: "SUNDAY", label: "Minggu" },
] as const

type UpdateBibleStudyScheduleFormProps = {
  schedule: {
    id: string
    groupName: string
    dayOfWeek: BibleStudyDayOfWeek
    startTime: string
    location: string | null
    leaderName: string | null
    notes: string | null
  }
}

type UpdateBibleStudyScheduleFieldsProps = {
  schedule: UpdateBibleStudyScheduleFormProps["schedule"]
  formAction: (formData: FormData) => void
  pending: boolean
  fieldErrors: BibleStudyScheduleActionState["fieldErrors"]
}

function UpdateBibleStudyScheduleFields({
  schedule,
  formAction,
  pending,
  fieldErrors,
}: UpdateBibleStudyScheduleFieldsProps) {
  const [dayOfWeek, setDayOfWeek] = useState(schedule.dayOfWeek)

  function handleDayChange(value: string | null) {
    if (
      value === "MONDAY" ||
      value === "TUESDAY" ||
      value === "WEDNESDAY" ||
      value === "THURSDAY" ||
      value === "FRIDAY" ||
      value === "SATURDAY" ||
      value === "SUNDAY"
    ) {
      setDayOfWeek(value)
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="groupName">Nama kelompok</FieldLabel>

          <Input
            id="groupName"
            name="groupName"
            defaultValue={schedule.groupName}
            disabled={pending}
            aria-invalid={Boolean(fieldErrors.groupName)}
          />

          <FieldError errors={fieldErrors.groupName?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="dayOfWeek">Hari</FieldLabel>

          <Select
            name="dayOfWeek"
            value={dayOfWeek}
            onValueChange={handleDayChange}
            disabled={pending}
            items={dayOptions}
          >
            <SelectTrigger id="dayOfWeek" aria-invalid={Boolean(fieldErrors.dayOfWeek)}>
              <SelectValue placeholder="Pilih hari" />
            </SelectTrigger>

            <SelectContent>
              {dayOptions.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FieldError errors={fieldErrors.dayOfWeek?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="startTime">Jam mulai</FieldLabel>

          <Input
            id="startTime"
            name="startTime"
            type="time"
            defaultValue={schedule.startTime}
            disabled={pending}
            aria-invalid={Boolean(fieldErrors.startTime)}
          />

          <FieldDescription>Jam menggunakan waktu WIB.</FieldDescription>

          <FieldError errors={fieldErrors.startTime?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="location">Lokasi</FieldLabel>

          <Input
            id="location"
            name="location"
            defaultValue={schedule.location ?? ""}
            disabled={pending}
            aria-invalid={Boolean(fieldErrors.location)}
          />

          <FieldDescription>
            Opsional. Bisa berupa rumah jemaat atau lokasi lainnya.
          </FieldDescription>

          <FieldError errors={fieldErrors.location?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="leaderName">Pemimpin PA</FieldLabel>

          <Input
            id="leaderName"
            name="leaderName"
            defaultValue={schedule.leaderName ?? ""}
            disabled={pending}
            aria-invalid={Boolean(fieldErrors.leaderName)}
          />

          <FieldError errors={fieldErrors.leaderName?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="notes">Catatan</FieldLabel>

          <Input
            id="notes"
            name="notes"
            defaultValue={schedule.notes ?? ""}
            disabled={pending}
            aria-invalid={Boolean(fieldErrors.notes)}
          />

          <FieldError errors={fieldErrors.notes?.map((message) => ({ message }))} />
        </Field>
      </FieldGroup>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Link href="/admin/jadwal-pa" className={buttonVariants({ variant: "outline" })}>
          Batal
        </Link>
      </div>
    </form>
  )
}

function UpdateBibleStudyScheduleForm({ schedule }: UpdateBibleStudyScheduleFormProps) {
  const updateAction = updateBibleStudySchedule.bind(null, schedule.id)

  const [state, formAction, pending] = useActionState(
    updateAction,
    initialBibleStudyScheduleActionState
  )

  useEffect(() => {
    if (state.status === "success") {
      toast.add({
        title: "Berhasil",
        description: state.message,
        type: "success",
      })
    }

    if (state.status === "error" && Object.keys(state.fieldErrors).length === 0) {
      toast.add({
        title: "Gagal",
        description: state.message,
        type: "error",
      })
    }
  }, [state])

  return (
    <UpdateBibleStudyScheduleFields
      schedule={schedule}
      formAction={formAction}
      pending={pending}
      fieldErrors={state.fieldErrors}
    />
  )
}

export { UpdateBibleStudyScheduleForm }
