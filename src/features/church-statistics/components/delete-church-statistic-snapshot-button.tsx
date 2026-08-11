"use client"

import { Trash2 } from "lucide-react"
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
import { deleteChurchStatisticSnapshot } from "@/features/church-statistics/actions/delete-church-statistic-snapshot"

type DeleteChurchStatisticSnapshotButtonProps = {
  id: string
  title: string
}

function DeleteChurchStatisticSnapshotButton({
  id,
  title,
}: DeleteChurchStatisticSnapshotButtonProps) {
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteChurchStatisticSnapshot(id)

      if (!result.success) {
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
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button type="button" variant="destructive" size="sm" disabled={pending} />}
      >
        <Trash2 />
        Hapus
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus snapshot statistik?</AlertDialogTitle>

          <AlertDialogDescription>
            Snapshot {title} akan dihapus secara permanen. Snapshot hanya dapat dihapus jika sudah
            nonaktif dan tidak mempunyai data statistik.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Batal</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={pending}
            className={buttonVariants({
              variant: "destructive",
            })}
          >
            <Trash2 />
            {pending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteChurchStatisticSnapshotButton }
