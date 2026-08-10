"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

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
import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { deleteBibleStudySchedule } from "@/features/bible-study-schedules/actions/delete-bible-study-schedule"

type DeleteBibleStudyScheduleButtonProps = {
  id: string
  groupName: string
}

function DeleteBibleStudyScheduleButton({ id, groupName }: DeleteBibleStudyScheduleButtonProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteBibleStudySchedule(id)

      if (result.status === "success") {
        toast.add({
          title: "Berhasil",
          description: result.message,
          type: "success",
        })

        router.refresh()
        return
      }

      toast.add({
        title: "Gagal",
        description: result.message,
        type: "error",
      })
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" size="sm" disabled={pending} />}>
        <Trash2 />
        Hapus
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Jadwal PA?</AlertDialogTitle>

          <AlertDialogDescription>
            {groupName} akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>

          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleDelete}
          >
            Hapus Permanen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteBibleStudyScheduleButton }
