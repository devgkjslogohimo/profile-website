"use client"

import { Controller, type UseFormRegisterReturn, type UseFormReturn } from "react-hook-form"

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  isUserRole,
  userRoleLabels,
  type UserRoleValue,
  userRoleValues,
} from "@/features/users/lib/user-role"
import type { UserCreateFormInput, UserUpdateFormInput } from "@/features/users/schemas/user-schema"

type UserFormFieldsProps =
  | {
      mode: "create"
      form: UseFormReturn<UserCreateFormInput>
      pending: boolean
    }
  | {
      mode: "edit"
      form: UseFormReturn<UserUpdateFormInput>
      pending: boolean
      roleDisabled?: boolean
    }

type UserIdentityFieldsProps = {
  nameRegistration: UseFormRegisterReturn<"name">
  emailRegistration: UseFormRegisterReturn<"email">
  roleValue: UserRoleValue
  onRoleChange: (role: UserRoleValue) => void
  nameError?: string
  emailError?: string
  roleError?: string
  pending: boolean
  roleDisabled?: boolean
}

function getFieldError(message: unknown) {
  if (typeof message !== "string") {
    return undefined
  }

  return [{ message }]
}

function UserIdentityFields({
  nameRegistration,
  emailRegistration,
  roleValue,
  onRoleChange,
  nameError,
  emailError,
  roleError,
  pending,
  roleDisabled = false,
}: UserIdentityFieldsProps) {
  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="name">Nama</FieldLabel>

          <Input
            id="name"
            {...nameRegistration}
            placeholder="Nama lengkap pengguna"
            autoComplete="name"
            disabled={pending}
            aria-invalid={Boolean(nameError)}
          />

          <FieldError errors={getFieldError(nameError)} />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>

          <Input
            id="email"
            type="email"
            {...emailRegistration}
            placeholder="nama@example.com"
            autoComplete="email"
            disabled={pending}
            aria-invalid={Boolean(emailError)}
          />

          <FieldDescription>
            Email digunakan sebagai identitas login dan harus unik.
          </FieldDescription>

          <FieldError errors={getFieldError(emailError)} />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="role">Peran</FieldLabel>

        <Select
          value={roleValue}
          onValueChange={(value) => {
            if (!isUserRole(value)) {
              return
            }

            onRoleChange(value)
          }}
          disabled={pending || roleDisabled}
        >
          <SelectTrigger id="role" className="w-full" aria-invalid={Boolean(roleError)}>
            <SelectValue placeholder="Pilih peran" />
          </SelectTrigger>

          <SelectContent>
            {userRoleValues.map((role) => (
              <SelectItem key={role} value={role}>
                {userRoleLabels[role]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {roleDisabled ? (
          <FieldDescription>Peran akun yang sedang digunakan tidak dapat diubah.</FieldDescription>
        ) : (
          <FieldDescription>
            Hak akses pengguna ditentukan oleh permission matrix pada server.
          </FieldDescription>
        )}

        <FieldError errors={getFieldError(roleError)} />
      </Field>
    </>
  )
}

function CreateUserFormFields({
  form,
  pending,
}: {
  form: UseFormReturn<UserCreateFormInput>
  pending: boolean
}) {
  const {
    control,
    register,
    formState: { errors },
  } = form

  return (
    <FieldGroup>
      <Controller
        control={control}
        name="role"
        render={({ field }) => (
          <UserIdentityFields
            nameRegistration={register("name")}
            emailRegistration={register("email")}
            roleValue={field.value}
            onRoleChange={field.onChange}
            nameError={errors.name?.message}
            emailError={errors.email?.message}
            roleError={errors.role?.message}
            pending={pending}
          />
        )}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>

          <Input
            id="password"
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
          <FieldLabel htmlFor="confirmPassword">Konfirmasi password</FieldLabel>

          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            autoComplete="new-password"
            disabled={pending}
            aria-invalid={Boolean(errors.confirmPassword)}
          />

          <FieldError errors={getFieldError(errors.confirmPassword?.message)} />
        </Field>
      </div>
    </FieldGroup>
  )
}

function EditUserFormFields({
  form,
  pending,
  roleDisabled,
}: {
  form: UseFormReturn<UserUpdateFormInput>
  pending: boolean
  roleDisabled: boolean
}) {
  const {
    control,
    register,
    formState: { errors },
  } = form

  return (
    <FieldGroup>
      <Controller
        control={control}
        name="role"
        render={({ field }) => (
          <UserIdentityFields
            nameRegistration={register("name")}
            emailRegistration={register("email")}
            roleValue={field.value}
            onRoleChange={field.onChange}
            nameError={errors.name?.message}
            emailError={errors.email?.message}
            roleError={errors.role?.message}
            pending={pending}
            roleDisabled={roleDisabled}
          />
        )}
      />
    </FieldGroup>
  )
}

function UserFormFields(props: UserFormFieldsProps) {
  if (props.mode === "create") {
    return <CreateUserFormFields form={props.form} pending={props.pending} />
  }

  return (
    <EditUserFormFields
      form={props.form}
      pending={props.pending}
      roleDisabled={props.roleDisabled ?? false}
    />
  )
}

export { UserFormFields }
