"use client"

import { useActionState, useEffect, useMemo, useState } from "react"

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
import { updateWorshipService } from "@/features/worship-schedules/actions/update-worship-service"
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

type UpdateServiceFormProps = {
  service: {
    id: string
    name: string
    churchLocationId: string
    churchLocation: {
      id: string
      name: string
      type: "CHURCH" | "PEPANTHAN"
      isActive: boolean
    }
    startTime: string
    languageOverride: WorshipLanguage | null
  }
  locations: ChurchLocationOption[]
  disabled?: boolean
  automaticLanguage: WorshipLanguage
}

type UpdateServiceFieldsProps = {
  service: UpdateServiceFormProps["service"]
  locations: ChurchLocationOption[]
  formAction: (formData: FormData) => void
  pending: boolean
  disabled: boolean
  fieldErrors: WorshipServiceActionState["fieldErrors"]
  automaticLanguage: WorshipLanguage
}

function UpdateServiceFields({
  service,
  locations,
  formAction,
  pending,
  disabled,
  fieldErrors,
  automaticLanguage,
}: UpdateServiceFieldsProps) {
  const [churchLocationId, setChurchLocationId] = useState(service.churchLocationId)

  const [language, setLanguage] = useState<WorshipLanguageInput>(service.languageOverride ?? "AUTO")

  const locationOptions = useMemo(() => {
    if (locations.some((location) => location.id === service.churchLocation.id)) {
      return locations
    }

    return [
      ...locations,
      {
        id: service.churchLocation.id,
        name: `${service.churchLocation.name} (Nonaktif)`,
        type: service.churchLocation.type,
      },
    ]
  }, [locations, service.churchLocation])

  function handleLocationChange(value: string | null) {
    setChurchLocationId(value ?? "")
  }

  return (
    <form action={formAction} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`name-${service.id}`}>Nama ibadah</FieldLabel>

          <Input
            id={`name-${service.id}`}
            name="name"
            defaultValue={service.name}
            disabled={disabled || pending}
            aria-invalid={Boolean(fieldErrors.name)}
          />

          <FieldError errors={fieldErrors.name?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor={`location-${service.id}`}>Lokasi</FieldLabel>

          <Select
            name="churchLocationId"
            value={churchLocationId}
            onValueChange={handleLocationChange}
            disabled={disabled || pending}
            items={locationOptions.map((location) => ({
              value: location.id,
              label: location.name,
            }))}
          >
            <SelectTrigger
              id={`location-${service.id}`}
              aria-invalid={Boolean(fieldErrors.churchLocationId)}
            >
              <SelectValue placeholder="Pilih lokasi ibadah" />
            </SelectTrigger>

            <SelectContent>
              {locationOptions.map((location) => (
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
          <FieldLabel htmlFor={`time-${service.id}`}>Jam mulai</FieldLabel>

          <Input
            id={`time-${service.id}`}
            name="startTime"
            type="time"
            defaultValue={service.startTime}
            disabled={disabled || pending}
            aria-invalid={Boolean(fieldErrors.startTime)}
          />

          <FieldError errors={fieldErrors.startTime?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor={`language-${service.id}`}>Bahasa Ibadah</FieldLabel>

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
            <SelectTrigger
              id={`language-${service.id}`}
              aria-invalid={Boolean(fieldErrors.language)}
            >
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
            Mode Otomatis saat ini menghasilkan {getWorshipLanguageLabel(automaticLanguage)}.
          </FieldDescription>

          <FieldError
            errors={fieldErrors.language?.map((message) => ({
              message,
            }))}
          />
        </Field>
      </FieldGroup>

      <Button type="submit" size="sm" disabled={disabled || pending}>
        {pending ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  )
}

function UpdateServiceForm({
  service,
  locations,
  disabled = false,
  automaticLanguage,
}: UpdateServiceFormProps) {
  const updateAction = updateWorshipService.bind(null, service.id)

  const [state, formAction, pending] = useActionState(
    updateAction,
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
    <UpdateServiceFields
      service={service}
      locations={locations}
      formAction={formAction}
      pending={pending}
      disabled={disabled}
      fieldErrors={state.fieldErrors}
      automaticLanguage={automaticLanguage}
    />
  )
}

export { UpdateServiceForm }
