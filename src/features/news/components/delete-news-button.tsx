"use client"

import { Trash2 } from "lucide-react"
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
import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { deleteNews } from "@/features/news/actions/delete-news"

type DeleteNewsButtonProps = {
  id: string
  title: string
  imageCount?: number
  redirectAfterDelete?: boolean
}

function DeleteNewsButton({
  id,
  title,
  imageCount = 0,
  redirectAfterDelete = false,
}: DeleteNewsButtonProps) {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteNews(id)

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

      if (redirectAfterDelete) {
        router.push("/admin/berita")
        router.refresh()

        return
      }

      router.refresh()
    })
  }

  function handleOpenChange(nextOpen: boolean) {
    if (pending) {
      return
    }

    setOpen(nextOpen)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        render={<Button type="button" variant="destructive" size="sm" disabled={pending} />}
      >
        <Trash2 />
        Hapus
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus berita?</AlertDialogTitle>

          <AlertDialogDescription>
            {imageCount > 0
              ? `${title} beserta ${imageCount} foto dokumentasi akan dihapus permanen dari sistem. File asli di Google Drive tidak akan dihapus.`
              : `${title} akan dihapus permanen dari sistem. Tindakan ini tidak dapat dibatalkan.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Batal</AlertDialogCancel>

          <AlertDialogAction
            className={buttonVariants({
              variant: "destructive",
            })}
            disabled={pending}
            onClick={handleDelete}
          >
            {pending ? "Menghapus..." : "Hapus Berita"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteNewsButton }
