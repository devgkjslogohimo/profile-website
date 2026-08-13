"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { startTransition, useActionState, useEffect } from "react"
import { useForm, type UseFormReturn, useWatch } from "react-hook-form"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { saveHeroSlideSlot } from "@/features/hero-slides/actions/save-hero-slide-slot"
import { initialHeroSlideActionState } from "@/features/hero-slides/lib/hero-slide-action-state"
import {
  type HeroSlideFormInput,
  heroSlideFormSchema,
} from "@/features/hero-slides/schemas/hero-slide-schema"

type HeroSlideSlotFormProps = {
  slot: number

  slide: {
    imageUrl: string
    altText: string
    isActive: boolean
  } | null
}

function getFieldError(message: unknown) {
  if (typeof message !== "string") {
    return undefined
  }

  return [{ message }]
}

function createFormData(values: HeroSlideFormInput) {
  const formData = new FormData()

  formData.set("imageUrl", values.imageUrl)
  formData.set("altText", values.altText)
  formData.set("isActive", values.isActive ? "true" : "false")

  return formData
}

function HeroSlidePreview({ form }: { form: UseFormReturn<HeroSlideFormInput> }) {
  const imageUrl = useWatch({
    control: form.control,
    name: "imageUrl",
  })

  if (!imageUrl) {
    return null
  }

  return <GoogleDriveImage url={imageUrl} alt="Preview foto hero" />
}

function HeroSlideSlotForm({ slot, slide }: HeroSlideSlotFormProps) {
  const form = useForm<HeroSlideFormInput>({
    resolver: zodResolver(heroSlideFormSchema),

    defaultValues: {
      imageUrl: slide?.imageUrl ?? "",
      altText: slide?.altText ?? "",
      isActive: slide?.isActive ?? true,
    },
  })

  const saveAction = saveHeroSlideSlot.bind(null, slot)

  const [state, dispatchAction, pending] = useActionState(saveAction, initialHeroSlideActionState)

  const {
    clearErrors,
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = form

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

      setError(field as keyof HeroSlideFormInput, {
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
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-xl border p-4">
      <div>
        <p className="font-medium">Slide {slot}</p>

        <p className="mt-1 text-xs text-muted-foreground">Urutan tampil ke-{slot}.</p>
      </div>

      <HeroSlidePreview form={form} />

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`hero-image-${slot}`}>Link Foto Google Drive</FieldLabel>

          <Input
            id={`hero-image-${slot}`}
            {...register("imageUrl")}
            placeholder="https://drive.google.com/file/d/..."
            disabled={pending}
            aria-invalid={Boolean(errors.imageUrl)}
          />

          <FieldDescription>
            Kosongkan link lalu simpan untuk menghapus foto dari slot ini.
          </FieldDescription>

          <FieldError errors={getFieldError(errors.imageUrl?.message)} />
        </Field>

        <Field>
          <FieldLabel htmlFor={`hero-alt-${slot}`}>Alt Text</FieldLabel>

          <Input
            id={`hero-alt-${slot}`}
            {...register("altText")}
            placeholder="Contoh: Gedung GKJ Slogohimo"
            disabled={pending}
            aria-invalid={Boolean(errors.altText)}
          />

          <FieldDescription>Jelaskan isi foto secara singkat untuk aksesibilitas.</FieldDescription>

          <FieldError errors={getFieldError(errors.altText?.message)} />
        </Field>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" {...register("isActive")} disabled={pending} className="size-4" />

          <span>Tampilkan slide ini di website</span>
        </label>
      </FieldGroup>

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : `Simpan Slide ${slot}`}
      </Button>
    </form>
  )
}

export { HeroSlideSlotForm }
