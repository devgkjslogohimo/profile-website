import type { ZodIssue } from "zod"

type SitePageField =
  "title" | "content" | "showInNavigation" | "navigationLabel" | "navigationOrder"

type SitePageFieldErrors = Partial<Record<SitePageField, string[]>>

type SitePageActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: SitePageFieldErrors
  submissionId: number
}

const initialSitePageActionState: SitePageActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

const sitePageFields = new Set<SitePageField>([
  "title",
  "content",
  "showInNavigation",
  "navigationLabel",
  "navigationOrder",
])

function getSitePageFieldErrors(issues: ZodIssue[]): SitePageFieldErrors {
  const fieldErrors: SitePageFieldErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (typeof field !== "string") {
      continue
    }

    if (!sitePageFields.has(field as SitePageField)) {
      continue
    }

    const key = field as SitePageField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

export { getSitePageFieldErrors, initialSitePageActionState }

export type { SitePageActionState, SitePageField, SitePageFieldErrors }
