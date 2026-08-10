"use client"

import { useActionState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { createWorshipSchedule } from "@/features/worship-schedules/actions/create-worship-schedule"
import {
  initialWorshipScheduleActionState,
  type WorshipScheduleActionState,
} from "@/features/worship-schedules/lib/schedule-action-state"

type CreateScheduleFieldsProps = {
  formAction: (formData: FormData) => void
  pending: boolean
  fieldErrors: WorshipScheduleActionState["fieldErrors"]
}

function CreateScheduleFields({ formAction, pending, fieldErrors }: CreateScheduleFieldsProps) {
  return (
    <form action={formAction} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="date">Tanggal jadwal</FieldLabel>

          <Input id="date" name="date" type="date" aria-invalid={Boolean(fieldErrors.date)} />

          <FieldDescription>Satu tanggal hanya memiliki satu paket jadwal ibadah.</FieldDescription>

          <FieldError errors={fieldErrors.date?.map((message) => ({ message }))} />
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Tambah Jadwal"}
      </Button>
    </form>
  )
}

function CreateScheduleForm() {
  const [state, formAction, pending] = useActionState(
    createWorshipSchedule,
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
    <CreateScheduleFields
      key={state.submissionId}
      formAction={formAction}
      pending={pending}
      fieldErrors={state.fieldErrors}
    />
  )
}

export { CreateScheduleForm }
