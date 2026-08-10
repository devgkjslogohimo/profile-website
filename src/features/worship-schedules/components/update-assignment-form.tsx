"use client"

import { useActionState, useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { updateWorshipServiceAssignment } from "@/features/worship-schedules/actions/update-worship-service-assignment"
import {
  initialWorshipServiceAssignmentActionState,
  type WorshipServiceAssignmentActionState,
} from "@/features/worship-schedules/lib/assignment-action-state"

type WorshipServiceRoleOption = {
  id: string
  name: string
  sortOrder: number
}

type UpdateAssignmentFormProps = {
  assignment: {
    id: string
    personName: string
    worshipServiceRoleId: string
    worshipServiceRole: {
      id: string
      name: string
      sortOrder: number
      isActive: boolean
    }
  }
  roles: WorshipServiceRoleOption[]
  disabled?: boolean
}

type UpdateAssignmentFieldsProps = {
  assignment: UpdateAssignmentFormProps["assignment"]
  roles: WorshipServiceRoleOption[]
  formAction: (formData: FormData) => void
  pending: boolean
  disabled: boolean
  fieldErrors: WorshipServiceAssignmentActionState["fieldErrors"]
}

function UpdateAssignmentFields({
  assignment,
  roles,
  formAction,
  pending,
  disabled,
  fieldErrors,
}: UpdateAssignmentFieldsProps) {
  const [worshipServiceRoleId, setWorshipServiceRoleId] = useState(assignment.worshipServiceRoleId)

  const roleOptions = useMemo(() => {
    if (roles.some((role) => role.id === assignment.worshipServiceRole.id)) {
      return roles
    }

    return [
      ...roles,
      {
        id: assignment.worshipServiceRole.id,
        name: `${assignment.worshipServiceRole.name} (Nonaktif)`,
        sortOrder: assignment.worshipServiceRole.sortOrder,
      },
    ]
  }, [assignment.worshipServiceRole, roles])

  function handleRoleChange(value: string | null) {
    setWorshipServiceRoleId(value ?? "")
  }

  return (
    <form action={formAction} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`assignment-role-${assignment.id}`}>Peran petugas</FieldLabel>

          <Select
            name="worshipServiceRoleId"
            value={worshipServiceRoleId}
            onValueChange={handleRoleChange}
            disabled={disabled || pending}
            items={roleOptions.map((role) => ({
              value: role.id,
              label: role.name,
            }))}
          >
            <SelectTrigger
              id={`assignment-role-${assignment.id}`}
              aria-invalid={Boolean(fieldErrors.worshipServiceRoleId)}
            >
              <SelectValue placeholder="Pilih peran petugas" />
            </SelectTrigger>

            <SelectContent>
              {roleOptions.map((role) => (
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
          <FieldLabel htmlFor={`assignment-name-${assignment.id}`}>Nama petugas</FieldLabel>

          <Input
            id={`assignment-name-${assignment.id}`}
            name="personName"
            defaultValue={assignment.personName}
            disabled={disabled || pending}
            aria-invalid={Boolean(fieldErrors.personName)}
          />

          <FieldError errors={fieldErrors.personName?.map((message) => ({ message }))} />
        </Field>
      </FieldGroup>

      <Button type="submit" size="sm" disabled={disabled || pending}>
        {pending ? "Menyimpan..." : "Simpan Petugas"}
      </Button>
    </form>
  )
}

function UpdateAssignmentForm({ assignment, roles, disabled = false }: UpdateAssignmentFormProps) {
  const updateAction = updateWorshipServiceAssignment.bind(null, assignment.id)

  const [state, formAction, pending] = useActionState(
    updateAction,
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
    <UpdateAssignmentFields
      assignment={assignment}
      roles={roles}
      formAction={formAction}
      pending={pending}
      disabled={disabled}
      fieldErrors={state.fieldErrors}
    />
  )
}

export { UpdateAssignmentForm }
