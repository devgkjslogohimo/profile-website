"use client"

import { useActionState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { updateWorshipSchedule } from "@/features/worship-schedules/actions/update-worship-schedule"
import {
  initialWorshipScheduleActionState,
  type WorshipScheduleActionState,
} from "@/features/worship-schedules/lib/schedule-action-state"

type UpdateScheduleFormProps = {
  schedule: {
    id: string
    date: string
    isPublished: boolean
  }
}

type UpdateScheduleFieldsProps = {
  schedule: UpdateScheduleFormProps["schedule"]
  formAction: (formData: FormData) => void
  pending: boolean
  fieldErrors: WorshipScheduleActionState["fieldErrors"]
}

function UpdateScheduleFields({
  schedule,
  formAction,
  pending,
  fieldErrors,
}: UpdateScheduleFieldsProps) {
  return (
    <form action={formAction} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="date">Tanggal jadwal</FieldLabel>

          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={schedule.date}
            disabled={schedule.isPublished || pending}
            aria-invalid={Boolean(fieldErrors.date)}
          />

          <FieldDescription>
            {schedule.isPublished
              ? "Batalkan publikasi terlebih dahulu untuk mengubah tanggal."
              : "Jam setiap ibadah akan dipindahkan ke tanggal baru secara otomatis."}
          </FieldDescription>

          <FieldError errors={fieldErrors.date?.map((message) => ({ message }))} />
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={schedule.isPublished || pending}>
        {pending ? "Menyimpan..." : "Simpan Tanggal"}
      </Button>
    </form>
  )
}

function UpdateScheduleForm({ schedule }: UpdateScheduleFormProps) {
  const updateAction = updateWorshipSchedule.bind(null, schedule.id)

  const [state, formAction, pending] = useActionState(
    updateAction,
    initialWorshipScheduleActionState
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
    <UpdateScheduleFields
      schedule={schedule}
      formAction={formAction}
      pending={pending}
      fieldErrors={state.fieldErrors}
    />
  )
}

export { UpdateScheduleForm }
