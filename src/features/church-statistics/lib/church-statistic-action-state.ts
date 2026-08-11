import type { ZodIssue } from "zod"

type ChurchStatisticSnapshotField = "title" | "asOfDate" | "notes"

type ChurchStatisticMetricField = "category" | "label" | "value" | "unit"

type ChurchStatisticSnapshotFieldErrors = Partial<Record<ChurchStatisticSnapshotField, string[]>>

type ChurchStatisticMetricFieldErrors = Partial<Record<ChurchStatisticMetricField, string[]>>

type ChurchStatisticSnapshotActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: ChurchStatisticSnapshotFieldErrors
  submissionId: number
}

type ChurchStatisticMetricActionState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors: ChurchStatisticMetricFieldErrors
  submissionId: number
}

const initialChurchStatisticSnapshotActionState: ChurchStatisticSnapshotActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

const initialChurchStatisticMetricActionState: ChurchStatisticMetricActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  submissionId: 0,
}

const snapshotFields = new Set<ChurchStatisticSnapshotField>(["title", "asOfDate", "notes"])

const metricFields = new Set<ChurchStatisticMetricField>(["category", "label", "value", "unit"])

function getChurchStatisticSnapshotFieldErrors(
  issues: ZodIssue[]
): ChurchStatisticSnapshotFieldErrors {
  const fieldErrors: ChurchStatisticSnapshotFieldErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (typeof field !== "string" || !snapshotFields.has(field as ChurchStatisticSnapshotField)) {
      continue
    }

    const key = field as ChurchStatisticSnapshotField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

function getChurchStatisticMetricFieldErrors(issues: ZodIssue[]): ChurchStatisticMetricFieldErrors {
  const fieldErrors: ChurchStatisticMetricFieldErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]

    if (typeof field !== "string" || !metricFields.has(field as ChurchStatisticMetricField)) {
      continue
    }

    const key = field as ChurchStatisticMetricField

    fieldErrors[key] ??= []
    fieldErrors[key]?.push(issue.message)
  }

  return fieldErrors
}

export {
  getChurchStatisticMetricFieldErrors,
  getChurchStatisticSnapshotFieldErrors,
  initialChurchStatisticMetricActionState,
  initialChurchStatisticSnapshotActionState,
}

export type {
  ChurchStatisticMetricActionState,
  ChurchStatisticMetricFieldErrors,
  ChurchStatisticSnapshotActionState,
  ChurchStatisticSnapshotFieldErrors,
}
