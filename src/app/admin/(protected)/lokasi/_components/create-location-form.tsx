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

import {
  type ChurchLocationActionState,
  initialChurchLocationActionState,
} from "../_lib/action-state"
import { createChurchLocation } from "../_lib/actions/create-church-location"
import { createChurchLocationSlug } from "../_lib/slug"

type ChurchLocationType = "CHURCH" | "PEPANTHAN"

type CreateLocationFieldsProps = {
  formAction: (formData: FormData) => void
  pending: boolean
  fieldErrors: ChurchLocationActionState["fieldErrors"]
}

function CreateLocationFields({ formAction, pending, fieldErrors }: CreateLocationFieldsProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<ChurchLocationType>("PEPANTHAN")
  const [googleMapsUrl, setGoogleMapsUrl] = useState("")

  const slug = useMemo(() => createChurchLocationSlug(name), [name])

  function handleTypeChange(value: string | null) {
    if (value === "CHURCH" || value === "PEPANTHAN") {
      setType(value)
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Nama lokasi</FieldLabel>
          <Input
            id="name"
            name="name"
            placeholder="Contoh: Pepanthan Ngadirojo"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
          />
          <FieldError errors={fieldErrors.name?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Input id="slug" value={slug} readOnly placeholder="dibuat-otomatis-dari-nama" />
          <FieldDescription>
            Dibuat otomatis dari nama lokasi dan tidak perlu diisi manual.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="googleMapsUrl">Link Google Maps</FieldLabel>
          <Input
            id="googleMapsUrl"
            name="googleMapsUrl"
            type="url"
            placeholder="https://maps.app.goo.gl/..."
            value={googleMapsUrl}
            onChange={(event) => setGoogleMapsUrl(event.target.value)}
            aria-invalid={Boolean(fieldErrors.googleMapsUrl)}
          />
          <FieldDescription>
            Optional. Tempel link share Google Maps lokasi gereja atau pepanthan.
          </FieldDescription>
          <FieldError errors={fieldErrors.googleMapsUrl?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="type">Jenis lokasi</FieldLabel>

          <Select name="type" value={type} onValueChange={handleTypeChange}>
            <SelectTrigger id="type" aria-invalid={Boolean(fieldErrors.type)}>
              <SelectValue placeholder="Pilih jenis lokasi" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="CHURCH">Gereja</SelectItem>
              <SelectItem value="PEPANTHAN">Pepanthan</SelectItem>
            </SelectContent>
          </Select>

          <FieldError errors={fieldErrors.type?.map((message) => ({ message }))} />
        </Field>
      </FieldGroup>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Urutan tampilan ditentukan otomatis berdasarkan lokasi terakhir.
        </p>

        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Tambah Lokasi"}
        </Button>
      </div>
    </form>
  )
}

function CreateLocationForm() {
  const [state, formAction, pending] = useActionState(
    createChurchLocation,
    initialChurchLocationActionState
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
    <CreateLocationFields
      key={state.submissionId}
      formAction={formAction}
      pending={pending}
      fieldErrors={state.fieldErrors}
    />
  )
}

export { CreateLocationForm }
