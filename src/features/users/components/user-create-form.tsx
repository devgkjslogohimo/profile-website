"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { createUser } from "@/features/users/actions/create-user"
import { UserFormFields } from "@/features/users/components/user-form-fields"
import { initialUserCreateActionState } from "@/features/users/lib/user-action-state"
import {
  type UserCreateFormInput,
  userCreateFormSchema,
} from "@/features/users/schemas/user-schema"

const defaultValues: UserCreateFormInput = {
  name: "",
  email: "",
  role: "CONTRIBUTOR",
  password: "",
  confirmPassword: "",
}

function createFormData(values: UserCreateFormInput) {
  const formData = new FormData()

  formData.set("name", values.name)
  formData.set("email", values.email)
  formData.set("role", values.role)
  formData.set("password", values.password)
  formData.set("confirmPassword", values.confirmPassword)

  return formData
}

function UserCreateForm() {
  const form = useForm<UserCreateFormInput>({
    resolver: zodResolver(userCreateFormSchema),
    defaultValues,
  })

  const [state, dispatchAction, pending] = useActionState(createUser, initialUserCreateActionState)

  const { clearErrors, handleSubmit, reset, setError } = form

  useEffect(() => {
    if (state.status === "success") {
      toast.add({
        title: "Berhasil",
        description: state.message,
        type: "success",
      })

      reset(defaultValues)

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

      setError(field as keyof UserCreateFormInput, {
        type: "server",
        message,
      })
    }
  }, [reset, setError, state])

  const onSubmit = handleSubmit((values) => {
    clearErrors()

    startTransition(() => {
      dispatchAction(createFormData(values))
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <UserFormFields mode="create" form={form} pending={pending} />

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Tambah Pengguna"}
      </Button>
    </form>
  )
}

export { UserCreateForm }
