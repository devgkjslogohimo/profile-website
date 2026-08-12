"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { updateUser } from "@/features/users/actions/update-user"
import { UserFormFields } from "@/features/users/components/user-form-fields"
import { initialUserUpdateActionState } from "@/features/users/lib/user-action-state"
import type { UserRoleValue } from "@/features/users/lib/user-role"
import {
  type UserUpdateFormInput,
  userUpdateFormSchema,
} from "@/features/users/schemas/user-schema"

type UserEditFormProps = {
  user: {
    id: string
    name: string
    email: string
    role: UserRoleValue
  }
  isCurrentUser: boolean
}

function createFormData(values: UserUpdateFormInput) {
  const formData = new FormData()

  formData.set("name", values.name)
  formData.set("email", values.email)
  formData.set("role", values.role)

  return formData
}

function UserEditForm({ user, isCurrentUser }: UserEditFormProps) {
  const form = useForm<UserUpdateFormInput>({
    resolver: zodResolver(userUpdateFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })

  const updateAction = updateUser.bind(null, user.id)

  const [state, dispatchAction, pending] = useActionState(
    updateAction,
    initialUserUpdateActionState
  )

  const { clearErrors, handleSubmit, setError } = form

  useEffect(() => {
    if (state.status === "success") {
      toast.add({
        title: "Berhasil",
        description: state.message,
        type: "success",
      })

      return
    }

    if (state.status !== "error") {
      return
    }

    const serverFieldErrors = Object.entries(state.fieldErrors)

    if (serverFieldErrors.length === 0) {
      toast.add({
        title: "Gagal",
        description: state.message,
        type: "error",
      })

      return
    }

    for (const [field, messages] of serverFieldErrors) {
      const message = messages?.[0]

      if (!message) {
        continue
      }

      setError(field as keyof UserUpdateFormInput, {
        type: "server",
        message,
      })
    }
  }, [setError, state])

  const onSubmit = handleSubmit((values) => {
    clearErrors()

    startTransition(() => {
      dispatchAction(createFormData(values))
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <UserFormFields mode="edit" form={form} pending={pending} roleDisabled={isCurrentUser} />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Link
          href="/admin/pengguna"
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

export { UserEditForm }
