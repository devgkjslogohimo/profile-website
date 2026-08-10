"use client"

import { useActionState, useEffect, useState } from "react"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { createChurchMinistry } from "@/features/church-ministries/actions/create-church-ministry"
import {
  type ChurchMinistryActionState,
  initialChurchMinistryActionState,
} from "@/features/church-ministries/lib/action-state"

type CreateChurchMinistryFieldsProps = {
  formAction: (formData: FormData) => void
  pending: boolean
  fieldErrors: ChurchMinistryActionState["fieldErrors"]
}

function CreateChurchMinistryFields({
  formAction,
  pending,
  fieldErrors,
}: CreateChurchMinistryFieldsProps) {
  const [name, setName] = useState("")
  const [summary, setSummary] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  return (
    <form action={formAction} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Nama pelayanan</FieldLabel>

          <Input
            id="name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Contoh: Komisi Media"
            disabled={pending}
            aria-invalid={Boolean(fieldErrors.name)}
          />

          <FieldDescription>Slug akan dibuat otomatis dari nama pelayanan.</FieldDescription>

          <FieldError
            errors={fieldErrors.name?.map((message) => ({
              message,
            }))}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="summary">Ringkasan</FieldLabel>

          <textarea
            id="summary"
            name="summary"
            rows={3}
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            placeholder="Ringkasan singkat mengenai pelayanan ini."
            disabled={pending}
            aria-invalid={Boolean(fieldErrors.summary)}
            className="flex min-h-24 w-full rounded-xl border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
          />

          <FieldDescription>Opsional. Maksimal 300 karakter.</FieldDescription>

          <FieldError
            errors={fieldErrors.summary?.map((message) => ({
              message,
            }))}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Deskripsi lengkap</FieldLabel>

          <textarea
            id="description"
            name="description"
            rows={8}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Jelaskan tujuan, kegiatan, dan informasi lain mengenai pelayanan."
            disabled={pending}
            aria-invalid={Boolean(fieldErrors.description)}
            className="flex min-h-40 w-full rounded-xl border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
          />

          <FieldDescription>Opsional. Maksimal 5000 karakter.</FieldDescription>

          <FieldError
            errors={fieldErrors.description?.map((message) => ({
              message,
            }))}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="imageUrl">Link gambar</FieldLabel>

          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="https://drive.google.com/..."
            disabled={pending}
            aria-invalid={Boolean(fieldErrors.imageUrl)}
          />

          <FieldDescription>
            Opsional. Masukkan link gambar dari Google Drive atau URL HTTPS lainnya.
          </FieldDescription>

          <FieldError
            errors={fieldErrors.imageUrl?.map((message) => ({
              message,
            }))}
          />

          {imageUrl ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Preview gambar</p>

              <GoogleDriveImage
                url={imageUrl}
                alt="Preview gambar pelayanan"
                className="max-w-xl"
              />
            </div>
          ) : null}
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Tambah Pelayanan"}
      </Button>
    </form>
  )
}

function CreateChurchMinistryForm() {
  const [state, formAction, pending] = useActionState(
    createChurchMinistry,
    initialChurchMinistryActionState
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
    <CreateChurchMinistryFields
      key={state.submissionId}
      formAction={formAction}
      pending={pending}
      fieldErrors={state.fieldErrors}
    />
  )
}

export { CreateChurchMinistryForm }
