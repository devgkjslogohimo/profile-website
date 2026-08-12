"use client"

import { Eye, EyeOff } from "lucide-react"
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
import { toast } from "@/components/ui/toast"
import { publishPawartos } from "@/features/pawartos/actions/publish-pawartos"
import { unpublishPawartos } from "@/features/pawartos/actions/unpublish-pawartos"

type PawartosPublicationButtonProps = {
  id: string
  title: string
  status: "DRAFT" | "PUBLISHED"
}

function PawartosPublicationButton({ id, title, status }: PawartosPublicationButtonProps) {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const isPublished = status === "PUBLISHED"

  function handlePublication() {
    startTransition(async () => {
      const result = isPublished ? await unpublishPawartos(id) : await publishPawartos(id)

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
        render={
          <Button
            type="button"
            variant={isPublished ? "outline" : "default"}
            size="sm"
            disabled={pending}
          />
        }
      >
        {isPublished ? <EyeOff /> : <Eye />}

        {isPublished ? "Batalkan Publikasi" : "Publikasikan"}
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isPublished ? "Batalkan publikasi Pawartos?" : "Publikasikan Pawartos?"}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {isPublished
              ? `${title} akan dikembalikan menjadi Draft dan tidak lagi ditampilkan pada website publik.`
              : `${title} akan berstatus Published dan dapat ditampilkan pada website publik.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Batal</AlertDialogCancel>

          <AlertDialogAction disabled={pending} onClick={handlePublication}>
            {pending ? "Memproses..." : isPublished ? "Batalkan Publikasi" : "Publikasikan"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { PawartosPublicationButton }
