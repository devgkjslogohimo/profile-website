import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChurchFormEditForm } from "@/features/church-forms/components/church-form-edit-form"

type EditChurchFormViewProps = {
  churchForm: {
    id: string
    title: string
    description: string | null
    googleFormUrl: string
    sortOrder: number
    isActive: boolean
  }
}

function EditChurchFormView({ churchForm }: EditChurchFormViewProps) {
  return (
    <main className="space-y-6">
      <div>
        <Link
          href="/admin/pengajuan"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
          })}
        >
          <ArrowLeft />
          Kembali
        </Link>

        <p className="mt-4 text-sm text-muted-foreground">Formulir</p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
            Edit Formulir
          </h1>

          <Badge variant={churchForm.isActive ? "secondary" : "outline"}>
            {churchForm.isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">{churchForm.title}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Formulir</CardTitle>
        </CardHeader>

        <CardContent>
          <ChurchFormEditForm
            churchForm={{
              id: churchForm.id,
              title: churchForm.title,
              description: churchForm.description,
              googleFormUrl: churchForm.googleFormUrl,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Sistem</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 text-sm sm:grid-cols-3">
          <div>
            <p className="text-muted-foreground">Status</p>

            <p className="mt-1 font-medium">{churchForm.isActive ? "Aktif" : "Nonaktif"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Urutan</p>

            <p className="mt-1 font-medium">{churchForm.sortOrder}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Google Form</p>

            <Link
              href={churchForm.googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline"
            >
              Buka formulir
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export { EditChurchFormView }
