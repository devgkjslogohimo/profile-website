import type { ZodIssue } from "zod"

type NewsImageField = "googleDriveUrl" | "altText" | "caption"

type NewsImageFieldErrors = Partial<Record<NewsImageField, string[]>>

type NewsImageActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: NewsImageFieldErrors
  submissionId: number
}

const initialNewsImageActionState: NewsImageActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

const newsImageFields = new Set<NewsImageField>(["googleDriveUrl", "altText", "caption"])

function getNewsImageFieldErrors(issues: ZodIssue[]): NewsImageFieldErrors {
  const fieldErrors: NewsImageFieldErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (typeof field !== "string" || !newsImageFields.has(field as NewsImageField)) {
      continue
    }

    const key = field as NewsImageField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

export { getNewsImageFieldErrors, initialNewsImageActionState }

export type { NewsImageActionState, NewsImageFieldErrors }
