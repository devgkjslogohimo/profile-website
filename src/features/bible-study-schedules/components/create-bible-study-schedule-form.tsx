"use client"

import { useActionState, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
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
import { createBibleStudySchedule } from "@/features/bible-study-schedules/actions/create-bible-study-schedule"
import {
  type BibleStudyScheduleActionState,
  initialBibleStudyScheduleActionState,
} from "@/features/bible-study-schedules/lib/action-state"

const dayOptions = [
  { value: "MONDAY", label: "Senin" },
  { value: "TUESDAY", label: "Selasa" },
  { value: "WEDNESDAY", label: "Rabu" },
  { value: "THURSDAY", label: "Kamis" },
  { value: "FRIDAY", label: "Jumat" },
  { value: "SATURDAY", label: "Sabtu" },
  { value: "SUNDAY", label: "Minggu" },
] as const

type CreateBibleStudyScheduleFieldsProps = {
  formAction: (formData: FormData) => void
  pending: boolean
  fieldErrors: BibleStudyScheduleActionState["fieldErrors"]
}

function CreateBibleStudyScheduleFields({
  formAction,
  pending,
  fieldErrors,
}: CreateBibleStudyScheduleFieldsProps) {
  const [dayOfWeek, setDayOfWeek] = useState("")

  function handleDayChange(value: string | null) {
    setDayOfWeek(value ?? "")
  }

  return (
    <form action={formAction} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="groupName">Nama kelompok</FieldLabel>

          <Input
            id="groupName"
            name="groupName"
            placeholder="Contoh: Kelompok Slogohimo 1"
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
            placeholder="Contoh: Rumah Bp. ..."
            disabled={pending}
            aria-invalid={Boolean(fieldErrors.location)}
          />

          <FieldDescription>
            Opsional. Lokasi dapat berupa rumah jemaat atau tempat lainnya.
          </FieldDescription>

          <FieldError errors={fieldErrors.location?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="leaderName">Pemimpin PA</FieldLabel>

          <Input
            id="leaderName"
            name="leaderName"
            placeholder="Nama pemimpin"
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
            placeholder="Catatan tambahan jika diperlukan"
            disabled={pending}
            aria-invalid={Boolean(fieldErrors.notes)}
          />

          <FieldError errors={fieldErrors.notes?.map((message) => ({ message }))} />
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Tambah Jadwal PA"}
      </Button>
    </form>
  )
}

function CreateBibleStudyScheduleForm() {
  const [state, formAction, pending] = useActionState(
    createBibleStudySchedule,
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
    <CreateBibleStudyScheduleFields
      key={state.submissionId}
      formAction={formAction}
      pending={pending}
      fieldErrors={state.fieldErrors}
    />
  )
}

export { CreateBibleStudyScheduleForm }
