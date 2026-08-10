"use client"

import Link from "next/link"
import { useActionState, useEffect, useState } from "react"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Button, buttonVariants } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { updateChurchMinistry } from "@/features/church-ministries/actions/update-church-ministry"
import {
  type ChurchMinistryActionState,
  initialChurchMinistryActionState,
} from "@/features/church-ministries/lib/action-state"

type UpdateChurchMinistryFormProps = {
  ministry: {
    id: string
    name: string
    slug: string
    summary: string | null
    description: string | null
    imageUrl: string | null
  }
}

type UpdateChurchMinistryFieldsProps = {
  ministry: UpdateChurchMinistryFormProps["ministry"]
  formAction: (formData: FormData) => void
  pending: boolean
  fieldErrors: ChurchMinistryActionState["fieldErrors"]
}

function UpdateChurchMinistryFields({
  ministry,
  formAction,
  pending,
  fieldErrors,
}: UpdateChurchMinistryFieldsProps) {
  const [name, setName] = useState(ministry.name)
  const [summary, setSummary] = useState(ministry.summary ?? "")
  const [description, setDescription] = useState(ministry.description ?? "")
  const [imageUrl, setImageUrl] = useState(ministry.imageUrl ?? "")

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
            disabled={pending}
            aria-invalid={Boolean(fieldErrors.name)}
          />

          <FieldDescription>
            Mengubah nama juga akan memperbarui slug secara otomatis.
          </FieldDescription>

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
            disabled={pending}
            aria-invalid={Boolean(fieldErrors.description)}
            className="flex min-h-40 w-full rounded-xl border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
          />

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
            Gunakan link file Google Drive. Pastikan akses file diatur ke &quot;Siapa saja yang
            memiliki link&quot;.
          </FieldDescription>

          <FieldError
            errors={fieldErrors.imageUrl?.map((message) => ({
              message,
            }))}
          />

          {imageUrl ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Preview gambar</p>

              <GoogleDriveImage url={imageUrl} alt={`Preview ${name}`} className="max-w-xl" />
            </div>
          ) : null}
        </Field>
      </FieldGroup>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Link
          href="/admin/pelayanan"
          className={buttonVariants({
            variant: "outline",
          })}
        >
          Batal
        </Link>
      </div>
    </form>
  )
}

function UpdateChurchMinistryForm({ ministry }: UpdateChurchMinistryFormProps) {
  const updateAction = updateChurchMinistry.bind(null, ministry.id)

  const [state, formAction, pending] = useActionState(
    updateAction,
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
    <UpdateChurchMinistryFields
      ministry={ministry}
      formAction={formAction}
      pending={pending}
      fieldErrors={state.fieldErrors}
    />
  )
}

export { UpdateChurchMinistryForm }
