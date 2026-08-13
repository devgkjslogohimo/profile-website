import type { ZodIssue } from "zod"

type NewsField = "title" | "excerpt" | "content" | "coverImageUrl"

type NewsFieldErrors = Partial<Record<NewsField, string[]>>

type NewsActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: NewsFieldErrors
  submissionId: number
}

const initialNewsActionState: NewsActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

const newsFields = new Set<NewsField>(["title", "excerpt", "content", "coverImageUrl"])

function getNewsFieldErrors(issues: ZodIssue[]): NewsFieldErrors {
  const fieldErrors: NewsFieldErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (typeof field !== "string") {
      continue
    }

    if (!newsFields.has(field as NewsField)) {
      continue
    }

    const key = field as NewsField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

export { getNewsFieldErrors, initialNewsActionState }

export type { NewsActionState, NewsField, NewsFieldErrors }
