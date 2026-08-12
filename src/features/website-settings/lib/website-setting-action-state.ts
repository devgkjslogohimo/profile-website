import type { ZodIssue } from "zod"

type WebsiteSettingField =
  | "siteName"
  | "tagline"
  | "description"
  | "email"
  | "phone"
  | "whatsapp"
  | "facebookUrl"
  | "instagramUrl"
  | "youtubeUrl"

type WebsiteSettingFieldErrors = Partial<Record<WebsiteSettingField, string[]>>

type WebsiteSettingActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: WebsiteSettingFieldErrors
  submissionId: number
}

const initialWebsiteSettingActionState: WebsiteSettingActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

const websiteSettingFields = new Set<WebsiteSettingField>([
  "siteName",
  "tagline",
  "description",
  "email",
  "phone",
  "whatsapp",
  "facebookUrl",
  "instagramUrl",
  "youtubeUrl",
])

function getWebsiteSettingFieldErrors(issues: ZodIssue[]): WebsiteSettingFieldErrors {
  const fieldErrors: WebsiteSettingFieldErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (typeof field !== "string" || !websiteSettingFields.has(field as WebsiteSettingField)) {
      continue
    }

    const key = field as WebsiteSettingField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

export { getWebsiteSettingFieldErrors, initialWebsiteSettingActionState }

export type { WebsiteSettingActionState, WebsiteSettingFieldErrors }
