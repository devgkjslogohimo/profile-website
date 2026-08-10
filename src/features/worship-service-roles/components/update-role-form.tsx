"use client"

import Link from "next/link"
import { useActionState, useEffect, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { updateWorshipServiceRole } from "@/features/worship-service-roles/actions/update-worship-service-role"
import {
  initialWorshipServiceRoleActionState,
  type WorshipServiceRoleActionState,
} from "@/features/worship-service-roles/lib/action-state"

type UpdateRoleFormProps = {
  role: {
    id: string
    name: string
  }
}

type UpdateRoleFieldsProps = {
  role: UpdateRoleFormProps["role"]
  formAction: (formData: FormData) => void
  pending: boolean
  fieldErrors: WorshipServiceRoleActionState["fieldErrors"]
}

function UpdateRoleFields({ role, formAction, pending, fieldErrors }: UpdateRoleFieldsProps) {
  const [name, setName] = useState(role.name)

  return (
    <form action={formAction} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Nama peran</FieldLabel>

          <Input
            id="name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
          />

          <FieldDescription>
            Perubahan nama akan digunakan pada pilihan peran petugas berikutnya.
          </FieldDescription>

          <FieldError errors={fieldErrors.name?.map((message) => ({ message }))} />
        </Field>
      </FieldGroup>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Link href="/admin/peran-petugas-ibadah" className={buttonVariants({ variant: "outline" })}>
          Batal
        </Link>
      </div>
    </form>
  )
}

function UpdateRoleForm({ role }: UpdateRoleFormProps) {
  const updateAction = updateWorshipServiceRole.bind(null, role.id)

  const [state, formAction, pending] = useActionState(
    updateAction,
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
    <UpdateRoleFields
      role={role}
      formAction={formAction}
      pending={pending}
      fieldErrors={state.fieldErrors}
    />
  )
}

export { UpdateRoleForm }
