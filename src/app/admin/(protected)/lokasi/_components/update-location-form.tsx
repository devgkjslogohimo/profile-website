"use client"

import Link from "next/link"
import { useActionState, useEffect, useMemo, useState } from "react"

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

import {
  type ChurchLocationActionState,
  initialChurchLocationActionState,
} from "../_lib/action-state"
import { updateChurchLocation } from "../_lib/actions/update-church-location"
import { createChurchLocationSlug } from "../_lib/slug"

type ChurchLocationType = "CHURCH" | "PEPANTHAN"

type UpdateLocationFormProps = {
  location: {
    id: string
    name: string
    type: ChurchLocationType
    googleMapsUrl: string | null
  }
}

type UpdateLocationFieldsProps = {
  location: UpdateLocationFormProps["location"]
  formAction: (formData: FormData) => void
  pending: boolean
  fieldErrors: ChurchLocationActionState["fieldErrors"]
}

function UpdateLocationFields({
  location,
  formAction,
  pending,
  fieldErrors,
}: UpdateLocationFieldsProps) {
  const [name, setName] = useState(location.name)
  const [type, setType] = useState<ChurchLocationType>(location.type)
  const [googleMapsUrl, setGoogleMapsUrl] = useState(location.googleMapsUrl ?? "")

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
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
          />
          <FieldError errors={fieldErrors.name?.map((message) => ({ message }))} />
        </Field>

        <Field>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Input id="slug" value={slug} readOnly />
          <FieldDescription>Slug diperbarui otomatis berdasarkan nama lokasi.</FieldDescription>
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
            Optional. Kosongkan jika lokasi belum memiliki link Google Maps.
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

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Link href="/admin/lokasi" className={buttonVariants({ variant: "outline" })}>
          Batal
        </Link>
      </div>
    </form>
  )
}

function UpdateLocationForm({ location }: UpdateLocationFormProps) {
  const updateAction = updateChurchLocation.bind(null, location.id)

  const [state, formAction, pending] = useActionState(
    updateAction,
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
    <UpdateLocationFields
      location={location}
      formAction={formAction}
      pending={pending}
      fieldErrors={state.fieldErrors}
    />
  )
}

export { UpdateLocationForm }
