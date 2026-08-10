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
import { createWorshipService } from "@/features/worship-schedules/actions/create-worship-service"
import {
  initialWorshipServiceActionState,
  type WorshipServiceActionState,
} from "@/features/worship-schedules/lib/service-action-state"

type ChurchLocationOption = {
  id: string
  name: string
  type: "CHURCH" | "PEPANTHAN"
}

type CreateServiceFormProps = {
  worshipScheduleId: string
  locations: ChurchLocationOption[]
  disabled?: boolean
}

type CreateServiceFieldsProps = {
  locations: ChurchLocationOption[]
  formAction: (formData: FormData) => void
  pending: boolean
  disabled: boolean
  fieldErrors: WorshipServiceActionState["fieldErrors"]
}

function CreateServiceFields({
  locations,
  formAction,
  pending,
  disabled,
  fieldErrors,
}: CreateServiceFieldsProps) {
  const [churchLocationId, setChurchLocationId] = useState("")

  function handleLocationChange(value: string | null) {
    setChurchLocationId(value ?? "")
  }

  return (
    <form action={formAction} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Nama ibadah</FieldLabel>

          <Input
            id="name"
            name="name"
            placeholder="Contoh: Ibadah Minggu"
            disabled={disabled || pending}
            aria-invalid={Boolean(fieldErrors.name)}
          />

          <FieldError errors={fieldErrors.name?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="churchLocationId">Lokasi</FieldLabel>

          <Select
            name="churchLocationId"
            value={churchLocationId}
            onValueChange={handleLocationChange}
            disabled={disabled || pending}
            items={locations.map((location) => ({
              value: location.id,
              label: location.name,
            }))}
          >
            <SelectTrigger
              id="churchLocationId"
              aria-invalid={Boolean(fieldErrors.churchLocationId)}
            >
              <SelectValue placeholder="Pilih lokasi ibadah" />
            </SelectTrigger>

            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FieldError
            errors={fieldErrors.churchLocationId?.map((message) => ({
              message,
            }))}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="startTime">Jam mulai</FieldLabel>

          <Input
            id="startTime"
            name="startTime"
            type="time"
            disabled={disabled || pending}
            aria-invalid={Boolean(fieldErrors.startTime)}
          />

          <FieldDescription>Jam menggunakan waktu WIB.</FieldDescription>

          <FieldError errors={fieldErrors.startTime?.map((message) => ({ message }))} />
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={disabled || pending || locations.length === 0}>
        {pending ? "Menyimpan..." : "Tambah Ibadah"}
      </Button>
    </form>
  )
}

function CreateServiceForm({
  worshipScheduleId,
  locations,
  disabled = false,
}: CreateServiceFormProps) {
  const createAction = createWorshipService.bind(null, worshipScheduleId)

  const [state, formAction, pending] = useActionState(
    createAction,
    initialWorshipServiceActionState
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
    <CreateServiceFields
      key={state.submissionId}
      locations={locations}
      formAction={formAction}
      pending={pending}
      disabled={disabled}
      fieldErrors={state.fieldErrors}
    />
  )
}

export { CreateServiceForm }
