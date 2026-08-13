import type { ZodIssue } from "zod"

type HeroSlideField = "imageUrl" | "altText"

type HeroSlideFieldErrors = Partial<Record<HeroSlideField, string[]>>

type HeroSlideActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: HeroSlideFieldErrors
  submissionId: number
}

const initialHeroSlideActionState: HeroSlideActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

const heroSlideFields = new Set<HeroSlideField>(["imageUrl", "altText"])

function getHeroSlideFieldErrors(issues: ZodIssue[]): HeroSlideFieldErrors {
  const fieldErrors: HeroSlideFieldErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (typeof field !== "string" || !heroSlideFields.has(field as HeroSlideField)) {
      continue
    }

    const key = field as HeroSlideField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

export { getHeroSlideFieldErrors, initialHeroSlideActionState }

export type { HeroSlideActionState, HeroSlideFieldErrors }
