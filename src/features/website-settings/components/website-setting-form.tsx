"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Globe2, Mail, MessageCircle, Phone, Share2 } from "lucide-react"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { updateWebsiteSetting } from "@/features/website-settings/actions/update-website-setting"
import { initialWebsiteSettingActionState } from "@/features/website-settings/lib/website-setting-action-state"
import {
  type WebsiteSettingFormInput,
  websiteSettingFormSchema,
} from "@/features/website-settings/schemas/website-setting-schema"

type WebsiteSettingFormProps = {
  setting: {
    siteName: string
    tagline: string | null
    description: string | null
    email: string | null
    phone: string | null
    whatsapp: string | null
    facebookUrl: string | null
    instagramUrl: string | null
    youtubeUrl: string | null
  } | null
}

function getFieldError(message: unknown) {
  if (typeof message !== "string") {
    return undefined
  }

  return [{ message }]
}

function createFormData(values: WebsiteSettingFormInput) {
  const formData = new FormData()

  formData.set("siteName", values.siteName)
  formData.set("tagline", values.tagline)
  formData.set("description", values.description)
  formData.set("email", values.email)
  formData.set("phone", values.phone)
  formData.set("whatsapp", values.whatsapp)
  formData.set("facebookUrl", values.facebookUrl)
  formData.set("instagramUrl", values.instagramUrl)
  formData.set("youtubeUrl", values.youtubeUrl)

  return formData
}

function WebsiteSettingForm({ setting }: WebsiteSettingFormProps) {
  const form = useForm<WebsiteSettingFormInput>({
    resolver: zodResolver(websiteSettingFormSchema),
    defaultValues: {
      siteName: setting?.siteName ?? "GKJ Slogohimo",
      tagline: setting?.tagline ?? "",
      description: setting?.description ?? "",
      email: setting?.email ?? "",
      phone: setting?.phone ?? "",
      whatsapp: setting?.whatsapp ?? "",
      facebookUrl: setting?.facebookUrl ?? "",
      instagramUrl: setting?.instagramUrl ?? "",
      youtubeUrl: setting?.youtubeUrl ?? "",
    },
  })

  const [state, dispatchAction, pending] = useActionState(
    updateWebsiteSetting,
    initialWebsiteSettingActionState
  )

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

      setError(field as keyof WebsiteSettingFormInput, {
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe2 className="size-5" />
            Identitas Website
          </CardTitle>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="siteName">Nama website</FieldLabel>

              <Input
                id="siteName"
                {...register("siteName")}
                placeholder="Nama website"
                disabled={pending}
                aria-invalid={Boolean(errors.siteName)}
              />

              <FieldDescription>Nama utama yang digunakan pada identitas website.</FieldDescription>

              <FieldError errors={getFieldError(errors.siteName?.message)} />
            </Field>

            <Field>
              <FieldLabel htmlFor="tagline">Tagline</FieldLabel>

              <Input
                id="tagline"
                {...register("tagline")}
                placeholder="Tagline singkat website"
                disabled={pending}
                aria-invalid={Boolean(errors.tagline)}
              />

              <FieldDescription>
                Opsional. Gunakan kalimat singkat yang mewakili gereja.
              </FieldDescription>

              <FieldError errors={getFieldError(errors.tagline?.message)} />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Deskripsi</FieldLabel>

              <Textarea
                id="description"
                rows={5}
                {...register("description")}
                placeholder="Deskripsi singkat mengenai gereja..."
                disabled={pending}
                aria-invalid={Boolean(errors.description)}
              />

              <FieldDescription>Deskripsi umum website. Maksimal 1000 karakter.</FieldDescription>

              <FieldError errors={getFieldError(errors.description?.message)} />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="size-5" />
            Kontak
          </CardTitle>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">
                <Mail className="size-4" />
                Email
              </FieldLabel>

              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="contoh@email.com"
                disabled={pending}
                aria-invalid={Boolean(errors.email)}
              />

              <FieldError errors={getFieldError(errors.email?.message)} />
            </Field>

            <Field>
              <FieldLabel htmlFor="phone">
                <Phone className="size-4" />
                Telepon
              </FieldLabel>

              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="Contoh: +62 273 123456"
                disabled={pending}
                aria-invalid={Boolean(errors.phone)}
              />

              <FieldDescription>
                Opsional. Nomor telepon utama yang dapat dihubungi.
              </FieldDescription>

              <FieldError errors={getFieldError(errors.phone?.message)} />
            </Field>

            <Field>
              <FieldLabel htmlFor="whatsapp">
                <MessageCircle className="size-4" />
                WhatsApp
              </FieldLabel>

              <Input
                id="whatsapp"
                type="tel"
                {...register("whatsapp")}
                placeholder="Contoh: +62 812 3456 7890"
                disabled={pending}
                aria-invalid={Boolean(errors.whatsapp)}
              />

              <FieldDescription>Masukkan nomor WhatsApp, bukan link wa.me.</FieldDescription>

              <FieldError errors={getFieldError(errors.whatsapp?.message)} />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="size-5" />
            Media Sosial
          </CardTitle>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="facebookUrl">Facebook</FieldLabel>

              <Input
                id="facebookUrl"
                type="url"
                {...register("facebookUrl")}
                placeholder="https://facebook.com/..."
                disabled={pending}
                aria-invalid={Boolean(errors.facebookUrl)}
              />

              <FieldError errors={getFieldError(errors.facebookUrl?.message)} />
            </Field>

            <Field>
              <FieldLabel htmlFor="instagramUrl">Instagram</FieldLabel>

              <Input
                id="instagramUrl"
                type="url"
                {...register("instagramUrl")}
                placeholder="https://instagram.com/..."
                disabled={pending}
                aria-invalid={Boolean(errors.instagramUrl)}
              />

              <FieldError errors={getFieldError(errors.instagramUrl?.message)} />
            </Field>

            <Field>
              <FieldLabel htmlFor="youtubeUrl">YouTube</FieldLabel>

              <Input
                id="youtubeUrl"
                type="url"
                {...register("youtubeUrl")}
                placeholder="https://youtube.com/..."
                disabled={pending}
                aria-invalid={Boolean(errors.youtubeUrl)}
              />

              <FieldError errors={getFieldError(errors.youtubeUrl?.message)} />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  )
}

export { WebsiteSettingForm }
