"use client"

import { useActionState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { createWorshipServiceRole } from "@/features/worship-service-roles/actions/create-worship-service-role"
import {
  initialWorshipServiceRoleActionState,
  type WorshipServiceRoleActionState,
} from "@/features/worship-service-roles/lib/action-state"

type CreateRoleFieldsProps = {
  formAction: (formData: FormData) => void
  pending: boolean
  fieldErrors: WorshipServiceRoleActionState["fieldErrors"]
}

function CreateRoleFields({ formAction, pending, fieldErrors }: CreateRoleFieldsProps) {
  return (
    <form action={formAction} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Nama peran</FieldLabel>

          <Input
            id="name"
            name="name"
            placeholder="Contoh: Liturgos"
            aria-invalid={Boolean(fieldErrors.name)}
          />

          <FieldDescription>
            Nama peran yang dapat dipilih saat menentukan petugas pada jadwal ibadah.
          </FieldDescription>

          <FieldError errors={fieldErrors.name?.map((message) => ({ message }))} />
        </Field>
      </FieldGroup>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Urutan peran ditentukan otomatis berdasarkan peran terakhir.
        </p>

        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Tambah Peran"}
        </Button>
      </div>
    </form>
  )
}

function CreateRoleForm() {
  const [state, formAction, pending] = useActionState(
    createWorshipServiceRole,
    initialWorshipServiceRoleActionState
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
    <CreateRoleFields
      key={state.submissionId}
      formAction={formAction}
      pending={pending}
      fieldErrors={state.fieldErrors}
    />
  )
}

export { CreateRoleForm }
