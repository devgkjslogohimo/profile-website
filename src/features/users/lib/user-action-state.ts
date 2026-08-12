import type { ZodIssue } from "zod"

type UserCreateField = "name" | "email" | "role" | "password" | "confirmPassword"

type UserCreateFieldErrors = Partial<Record<UserCreateField, string[]>>

type UserCreateActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: UserCreateFieldErrors
  submissionId: number
}

const initialUserCreateActionState: UserCreateActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

const userCreateFields = new Set<UserCreateField>([
  "name",
  "email",
  "role",
  "password",
  "confirmPassword",
])

function getUserCreateFieldErrors(issues: ZodIssue[]): UserCreateFieldErrors {
  const fieldErrors: UserCreateFieldErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (typeof field !== "string") {
      continue
    }

    if (!userCreateFields.has(field as UserCreateField)) {
      continue
    }

    const key = field as UserCreateField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

type UserUpdateField = "name" | "email" | "role"

type UserUpdateFieldErrors = Partial<Record<UserUpdateField, string[]>>

type UserUpdateActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: UserUpdateFieldErrors
  submissionId: number
}

const initialUserUpdateActionState: UserUpdateActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

const userUpdateFields = new Set<UserUpdateField>(["name", "email", "role"])

function getUserUpdateFieldErrors(issues: ZodIssue[]): UserUpdateFieldErrors {
  const fieldErrors: UserUpdateFieldErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (typeof field !== "string") {
      continue
    }

    if (!userUpdateFields.has(field as UserUpdateField)) {
      continue
    }

    const key = field as UserUpdateField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

export {
  getUserCreateFieldErrors,
  getUserUpdateFieldErrors,
  initialUserCreateActionState,
  initialUserUpdateActionState,
}

export type {
  UserCreateActionState,
  UserCreateFieldErrors,
  UserUpdateActionState,
  UserUpdateFieldErrors,
}
