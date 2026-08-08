"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { loginAction, type LoginActionState } from "../actions/login"

const initialState: LoginActionState = {}

function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  return (
    <form action={formAction} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="admin@gkjslogohimo..."
            aria-invalid={Boolean(state.fieldErrors?.email)}
            disabled={isPending}
          />
          {state.fieldErrors?.email ? <FieldError>{state.fieldErrors.email[0]}</FieldError> : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(state.fieldErrors?.password)}
            disabled={isPending}
          />
          {state.fieldErrors?.password ? (
            <FieldError>{state.fieldErrors.password[0]}</FieldError>
          ) : null}
        </Field>
      </FieldGroup>

      {state.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  )
}

export { LoginForm }
