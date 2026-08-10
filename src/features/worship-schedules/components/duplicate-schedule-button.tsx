"use client"

import { Copy } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { duplicateWorshipSchedule } from "@/features/worship-schedules/actions/duplicate-worship-schedule"

type DuplicateScheduleButtonProps = {
  scheduleId: string
  scheduleLabel: string
}

function DuplicateScheduleButton({ scheduleId, scheduleLabel }: DuplicateScheduleButtonProps) {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [targetDate, setTargetDate] = useState("")
  const [pending, startTransition] = useTransition()

  function handleDuplicate(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()

    if (!targetDate) {
      toast.add({
        title: "Tanggal belum dipilih",
        description: "Pilih tanggal tujuan jadwal terlebih dahulu.",
        type: "error",
      })

      return
    }

    startTransition(async () => {
      const result = await duplicateWorshipSchedule(scheduleId, targetDate)

      if (result.status === "error") {
        toast.add({
          title: "Gagal",
          description: result.message,
          type: "error",
        })

        return
      }

      toast.add({
        title: "Berhasil",
        description: result.message,
        type: "success",
      })

      setOpen(false)
      setTargetDate("")

      router.push(`/admin/jadwal-ibadah/${result.scheduleId}`)
      router.refresh()
    })
  }

  function handleOpenChange(nextOpen: boolean) {
    if (pending) {
      return
    }

    setOpen(nextOpen)

    if (!nextOpen) {
      setTargetDate("")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger render={<Button type="button" variant="outline" disabled={pending} />}>
        <Copy />
        Salin Jadwal
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Salin jadwal ibadah?</AlertDialogTitle>

          <AlertDialogDescription>
            Seluruh ibadah dan petugas dari {scheduleLabel} akan disalin ke tanggal baru.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-2">
          <Field>
            <FieldLabel htmlFor="duplicate-target-date">Tanggal tujuan</FieldLabel>

            <Input
              id="duplicate-target-date"
              type="date"
              value={targetDate}
              disabled={pending}
              onChange={(event) => setTargetDate(event.target.value)}
            />

            <FieldDescription>
              Jadwal hasil salinan akan dibuat sebagai Draft dan dapat diedit sebelum
              dipublikasikan.
            </FieldDescription>
          </Field>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Batal</AlertDialogCancel>

          <AlertDialogAction disabled={!targetDate || pending} onClick={handleDuplicate}>
            {pending ? "Menyalin..." : "Salin Jadwal"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DuplicateScheduleButton }
