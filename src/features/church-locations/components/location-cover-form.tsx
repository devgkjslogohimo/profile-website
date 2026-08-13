"use client"

import { useRouter } from "next/navigation"
import { useActionState, useEffect, useState } from "react"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { saveLocationCover } from "@/features/church-locations/actions/save-location-cover"
import { initialLocationCoverActionState } from "@/features/church-locations/lib/location-media-action-state"

type LocationCoverFormProps = {
  location: {
    id: string
    name: string
    coverImageUrl: string | null
    coverAltText: string | null
  }
}

function LocationCoverForm({ location }: LocationCoverFormProps) {
  const router = useRouter()

  const [imageUrl, setImageUrl] = useState(location.coverImageUrl ?? "")

  const saveAction = saveLocationCover.bind(null, location.id)

  const [state, formAction, pending] = useActionState(saveAction, initialLocationCoverActionState)

  useEffect(() => {
    if (state.status === "success") {
      toast.add({
        title: "Berhasil",
        description: state.message,
        type: "success",
      })

      router.refresh()

      return
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
    <form action={formAction} className="space-y-6">
      <GoogleDriveImage
        url={imageUrl || null}
        alt={location.coverAltText ?? `Foto utama ${location.name}`}
        className="max-w-2xl"
      />

      <Field>
        <FieldLabel htmlFor="coverImageUrl">Link Foto Google Drive</FieldLabel>

        <Input
          id="coverImageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://drive.google.com/file/d/..."
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          aria-invalid={Boolean(state.fieldErrors.imageUrl)}
        />

        <FieldDescription>
          Cover digunakan sebagai foto utama lokasi. Alt Text dibuat otomatis. Kosongkan link dan
          simpan untuk menghapus cover.
        </FieldDescription>

        <FieldError
          errors={state.fieldErrors.imageUrl?.map((message) => ({
            message,
          }))}
        />
      </Field>

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Simpan Cover"}
      </Button>
    </form>
  )
}

export { LocationCoverForm }
