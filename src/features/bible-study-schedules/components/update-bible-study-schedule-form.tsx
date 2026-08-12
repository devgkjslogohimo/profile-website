"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { updateBibleStudySchedule } from "@/features/bible-study-schedules/actions/update-bible-study-schedule"
import { BibleStudyScheduleFormFields } from "@/features/bible-study-schedules/components/bible-study-schedule-form-fields"
import { initialBibleStudyScheduleActionState } from "@/features/bible-study-schedules/lib/action-state"
import type { BibleStudyDayOfWeek } from "@/features/bible-study-schedules/lib/day-of-week"
import {
  type BibleStudyScheduleFormInput,
  bibleStudyScheduleFormSchema,
} from "@/features/bible-study-schedules/schemas/bible-study-schedule-schema"

type UpdateBibleStudyScheduleFormProps = {
  schedule: {
    id: string
    groupName: string
    dayOfWeek: BibleStudyDayOfWeek
    startTime: string
    location: string | null
    leaderName: string | null
    notes: string | null
  }
}

function createFormData(values: BibleStudyScheduleFormInput) {
  const formData = new FormData()

  formData.set("groupName", values.groupName)
  formData.set("dayOfWeek", values.dayOfWeek)
  formData.set("startTime", values.startTime)
  formData.set("location", values.location)
  formData.set("leaderName", values.leaderName)
  formData.set("notes", values.notes)

  return formData
}

function UpdateBibleStudyScheduleForm({ schedule }: UpdateBibleStudyScheduleFormProps) {
  const form = useForm<BibleStudyScheduleFormInput>({
    resolver: zodResolver(bibleStudyScheduleFormSchema),
    defaultValues: {
      groupName: schedule.groupName,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      location: schedule.location ?? "",
      leaderName: schedule.leaderName ?? "",
      notes: schedule.notes ?? "",
    },
  })

  const updateAction = updateBibleStudySchedule.bind(null, schedule.id)

  const [state, dispatchAction, pending] = useActionState(
    updateAction,
    initialBibleStudyScheduleActionState
  )

  const { clearErrors, handleSubmit, setError } = form

  useEffect(() => {
    if (state.status === "success") {
      toast.add({
        title: "Berhasil",
        description: state.message,
        type: "success",
      })

      return
    }

    if (state.status !== "error") {
      return
    }

    const serverFieldErrors = Object.entries(state.fieldErrors)

    if (serverFieldErrors.length === 0) {
      toast.add({
        title: "Gagal",
        description: state.message,
        type: "error",
      })

      return
    }

    for (const [field, messages] of serverFieldErrors) {
      const message = messages?.[0]

      if (!message) {
        continue
      }

      setError(field as keyof BibleStudyScheduleFormInput, {
        type: "server",
        message,
      })
    }
  }, [setError, state])

  const onSubmit = handleSubmit((values) => {
    clearErrors()

    startTransition(() => {
      dispatchAction(createFormData(values))
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <BibleStudyScheduleFormFields form={form} pending={pending} />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Link
          href="/admin/jadwal-pa"
          className={buttonVariants({
            variant: "outline",
          })}
        >
          Batal
        </Link>
      </div>
    </form>
  )
}

export { UpdateBibleStudyScheduleForm }
