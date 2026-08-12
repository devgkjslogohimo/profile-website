"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { KeyRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { resetUserPassword } from "@/features/users/actions/reset-user-password"
import { initialResetPasswordActionState } from "@/features/users/lib/reset-password-action-state"
import {
  type ResetUserPasswordInput,
  resetUserPasswordSchema,
} from "@/features/users/schemas/reset-user-password-schema"

type ResetUserPasswordButtonProps = {
  id: string
  name: string
  isCurrentUser: boolean
}

const defaultValues: ResetUserPasswordInput = {
  password: "",
  confirmPassword: "",
}

function createFormData(values: ResetUserPasswordInput) {
  const formData = new FormData()

  formData.set("password", values.password)
  formData.set("confirmPassword", values.confirmPassword)

  return formData
}

function getFieldError(message: unknown) {
  if (typeof message !== "string") {
    return undefined
  }

  return [{ message }]
}

function ResetUserPasswordButton({ id, name, isCurrentUser }: ResetUserPasswordButtonProps) {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const form = useForm<ResetUserPasswordInput>({
    resolver: zodResolver(resetUserPasswordSchema),
    defaultValues,
  })

  const {
    clearErrors,
    handleSubmit,
    register,
    reset,
    setError,
    formState: { errors },
  } = form

  function handleOpenChange(nextOpen: boolean) {
    if (pending) {
      return
    }

    setOpen(nextOpen)

    if (!nextOpen) {
      clearErrors()
      reset(defaultValues)
    }
  }

  const onSubmit = handleSubmit((values) => {
    clearErrors()

    startTransition(async () => {
      const result = await resetUserPassword(
        id,
        initialResetPasswordActionState,
        createFormData(values)
      )

      if (result.status === "success") {
        toast.add({
          title: "Berhasil",
          description: result.message,
          type: "success",
        })

        reset(defaultValues)
        setOpen(false)
        router.refresh()

        return
      }

      const serverFieldErrors = Object.entries(result.fieldErrors)

      if (serverFieldErrors.length === 0) {
        toast.add({
          title: "Gagal",
          description: result.message,
          type: "error",
        })

        return
      }

      for (const [field, messages] of serverFieldErrors) {
        const message = messages?.[0]

        if (!message) {
          continue
        }

        setError(field as keyof ResetUserPasswordInput, {
          type: "server",
          message,
        })
      }
    })
  })

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger render={<Button type="button" variant="outline" size="sm" />}>
        <KeyRound />
        Reset Password
      </AlertDialogTrigger>

      <AlertDialogContent>
        <form onSubmit={onSubmit} noValidate>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isCurrentUser ? "Ubah password akun anda?" : `Reset password ${name}?`}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {isCurrentUser
                ? "Password akun yang sedang digunakan akan diganti. Setelah berhasil, anda harus login kembali."
                : "Password lama tidak dapat digunakan lagi dan seluruh sesi aktif pengguna ini akan dicabut."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`password-${id}`}>Password baru</FieldLabel>

                <Input
                  id={`password-${id}`}
                  type="password"
                  {...register("password")}
                  autoComplete="new-password"
                  disabled={pending}
                  aria-invalid={Boolean(errors.password)}
                />

                <FieldDescription>Minimal 12 karakter.</FieldDescription>

                <FieldError errors={getFieldError(errors.password?.message)} />
              </Field>

              <Field>
                <FieldLabel htmlFor={`confirm-password-${id}`}>Konfirmasi password</FieldLabel>

                <Input
                  id={`confirm-password-${id}`}
                  type="password"
                  {...register("confirmPassword")}
                  autoComplete="new-password"
                  disabled={pending}
                  aria-invalid={Boolean(errors.confirmPassword)}
                />

                <FieldError errors={getFieldError(errors.confirmPassword?.message)} />
              </Field>
            </FieldGroup>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Batal</AlertDialogCancel>

            <AlertDialogAction type="submit" disabled={pending}>
              {pending ? "Memproses..." : "Reset Password"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { ResetUserPasswordButton }
