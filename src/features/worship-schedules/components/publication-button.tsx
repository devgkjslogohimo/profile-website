"use client"

import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { publishWorshipSchedule } from "@/features/worship-schedules/actions/publish-worship-schedule"
import { unpublishWorshipSchedule } from "@/features/worship-schedules/actions/unpublish-worship-schedule"
import { initialWorshipSchedulePublicationActionState } from "@/features/worship-schedules/lib/publication-action-state"

type PublicationButtonProps = {
  id: string
  isPublished: boolean
}

function PublicationButton({ id, isPublished }: PublicationButtonProps) {
  const router = useRouter()

  const action = isPublished
    ? unpublishWorshipSchedule.bind(null, id)
    : publishWorshipSchedule.bind(null, id)

  const [state, formAction, pending] = useActionState(
    action,
    initialWorshipSchedulePublicationActionState
  )

  useEffect(() => {
    if (state.status === "success") {
      toast.add({
        title: "Berhasil",
        description: state.message,
        type: "success",
      })

      router.refresh()
    }

    if (state.status === "error") {
      toast.add({
        title: "Gagal",
        description: state.message,
        type: "error",
      })
    }
  }, [router, state])

  return (
    <form action={formAction}>
      <Button type="submit" variant={isPublished ? "outline" : "default"} disabled={pending}>
        {pending ? "Memproses..." : isPublished ? "Batalkan Publikasi" : "Publikasikan"}
      </Button>
    </form>
  )
}

export { PublicationButton }
