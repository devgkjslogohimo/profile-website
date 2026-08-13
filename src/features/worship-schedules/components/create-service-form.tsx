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

import {
  getWorshipLanguageLabel,
  WorshipLanguage,
  WorshipLanguageInput,
} from "../lib/worship-language"

type ChurchLocationOption = {
  id: string
  name: string
  type: "CHURCH" | "PEPANTHAN"
}

type CreateServiceFormProps = {
  worshipScheduleId: string
  locations: ChurchLocationOption[]
  automaticLanguage: WorshipLanguage
  disabled?: boolean
}

type CreateServiceFieldsProps = {
  locations: ChurchLocationOption[]
  automaticLanguage: WorshipLanguage
  formAction: (formData: FormData) => void
  pending: boolean
  disabled: boolean
  fieldErrors: WorshipServiceActionState["fieldErrors"]
}

function CreateServiceFields({
  locations,
  automaticLanguage,
  formAction,
  pending,
  disabled,
  fieldErrors,
}: CreateServiceFieldsProps) {
  const [churchLocationId, setChurchLocationId] = useState("")
  const [language, setLanguage] = useState<WorshipLanguageInput>("AUTO")

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

        <Field>
          <FieldLabel htmlFor="language">Bahasa Ibadah</FieldLabel>

          <Select
            name="language"
            value={language}
            onValueChange={(value) => setLanguage((value ?? "AUTO") as WorshipLanguageInput)}
            disabled={disabled || pending}
            items={[
              {
                value: "AUTO",
                label: `Otomatis (${getWorshipLanguageLabel(automaticLanguage)})`,
              },
              {
                value: "JAVANESE",
                label: "Bahasa Jawa",
              },
              {
                value: "INDONESIAN",
                label: "Bahasa Indonesia",
              },
            ]}
          >
            <SelectTrigger id="language" aria-invalid={Boolean(fieldErrors.language)}>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="AUTO">
                Otomatis ({getWorshipLanguageLabel(automaticLanguage)})
              </SelectItem>

              <SelectItem value="JAVANESE">Bahasa Jawa</SelectItem>

              <SelectItem value="INDONESIAN">Bahasa Indonesia</SelectItem>
            </SelectContent>
          </Select>

          <FieldDescription>
            Otomatis mengikuti minggu ganjil/genap. Pilih bahasa manual hanya jika ada pengecualian.
          </FieldDescription>

          <FieldError
            errors={fieldErrors.language?.map((message) => ({
              message,
            }))}
          />
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
  automaticLanguage,
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
      automaticLanguage={automaticLanguage}
      formAction={formAction}
      pending={pending}
      disabled={disabled}
      fieldErrors={state.fieldErrors}
    />
  )
}

export { CreateServiceForm }
