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
import { createWorshipServiceAssignment } from "@/features/worship-schedules/actions/create-worship-service-assignment"
import {
  initialWorshipServiceAssignmentActionState,
  type WorshipServiceAssignmentActionState,
} from "@/features/worship-schedules/lib/assignment-action-state"

type WorshipServiceRoleOption = {
  id: string
  name: string
  sortOrder: number
}

type CreateAssignmentFormProps = {
  worshipServiceId: string
  roles: WorshipServiceRoleOption[]
  disabled?: boolean
}

type CreateAssignmentFieldsProps = {
  roles: WorshipServiceRoleOption[]
  formAction: (formData: FormData) => void
  pending: boolean
  disabled: boolean
  fieldErrors: WorshipServiceAssignmentActionState["fieldErrors"]
}

function CreateAssignmentFields({
  roles,
  formAction,
  pending,
  disabled,
  fieldErrors,
}: CreateAssignmentFieldsProps) {
  const [worshipServiceRoleId, setWorshipServiceRoleId] = useState("")

  function handleRoleChange(value: string | null) {
    setWorshipServiceRoleId(value ?? "")
  }

  return (
    <form action={formAction} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="worshipServiceRoleId">Peran petugas</FieldLabel>

          <Select
            name="worshipServiceRoleId"
            value={worshipServiceRoleId}
            onValueChange={handleRoleChange}
            disabled={disabled || pending}
            items={roles.map((role) => ({
              value: role.id,
              label: role.name,
            }))}
          >
            <SelectTrigger
              id="worshipServiceRoleId"
              aria-invalid={Boolean(fieldErrors.worshipServiceRoleId)}
            >
              <SelectValue placeholder="Pilih peran petugas" />
            </SelectTrigger>

            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FieldError
            errors={fieldErrors.worshipServiceRoleId?.map((message) => ({
              message,
            }))}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="personName">Nama petugas</FieldLabel>

          <Input
            id="personName"
            name="personName"
            placeholder="Contoh: Pdt. Nama Petugas"
            disabled={disabled || pending}
            aria-invalid={Boolean(fieldErrors.personName)}
          />

          <FieldDescription>
            Nama petugas disimpan sebagai teks dan tidak menggunakan master orang.
          </FieldDescription>

          <FieldError errors={fieldErrors.personName?.map((message) => ({ message }))} />
        </Field>
      </FieldGroup>

      <Button type="submit" size="sm" disabled={disabled || pending || roles.length === 0}>
        {pending ? "Menyimpan..." : "Tambah Petugas"}
      </Button>
    </form>
  )
}

function CreateAssignmentForm({
  worshipServiceId,
  roles,
  disabled = false,
}: CreateAssignmentFormProps) {
  const createAction = createWorshipServiceAssignment.bind(null, worshipServiceId)

  const [state, formAction, pending] = useActionState(
    createAction,
    initialWorshipServiceAssignmentActionState
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
    <CreateAssignmentFields
      key={state.submissionId}
      roles={roles}
      formAction={formAction}
      pending={pending}
      disabled={disabled}
      fieldErrors={state.fieldErrors}
    />
  )
}

export { CreateAssignmentForm }
