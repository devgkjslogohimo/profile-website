import { ArrowRight, Clock3, MapPin } from "lucide-react"
import type { Metadata } from "next"

import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { SectionHeader } from "@/components/shared/section-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Design System",
}

const colors = [
  { name: "Background", className: "bg-background" },
  { name: "Primary", className: "bg-primary" },
  { name: "Secondary", className: "bg-secondary" },
  { name: "Accent", className: "bg-accent" },
  { name: "Muted", className: "bg-muted" },
  { name: "Destructive", className: "bg-destructive" },
]

export default function DesignSystemPage() {
  return (
    <main>
      <Section>
        <Container>
          <Badge variant="secondary">FOUNDATION V1</Badge>

          <h1 className="mt-5 max-w-4xl font-heading text-4xl leading-tight font-medium tracking-tight md:text-6xl">
            GKJ Slogohimo Design System
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Preview sementara untuk memvalidasi warna, typography, spacing, dan primitive shadcn
            sebelum pembangunan halaman publik dimulai.
          </p>
        </Container>
      </Section>

      <Separator />

      <Section>
        <Container>
          <SectionHeader
            eyebrow="COLORS"
            title="Semantic Colors"
            description="Warna aplikasi menggunakan semantic token agar konsisten di seluruh public website dan admin."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {colors.map((color) => (
              <div key={color.name} className="overflow-hidden rounded-xl border bg-card">
                <div className={`h-28 ${color.className}`} />
                <div className="p-4">
                  <p className="font-medium">{color.name}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-muted/50">
        <Container>
          <SectionHeader
            eyebrow="TYPOGRAPHY"
            title="Geist + Lora"
            description="Geist digunakan untuk interface dan body, sedangkan Lora memberikan karakter editorial pada heading utama."
          />

          <div className="mt-10 space-y-8">
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Editorial / Lora</p>
              <p className="font-heading text-4xl leading-tight md:text-5xl">
                Bertumbuh dalam Iman. Hidup dalam Kasih.
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-muted-foreground">Interface / Geist</p>
              <p className="max-w-3xl text-lg leading-8">
                GKJ Slogohimo hadir sebagai ruang persekutuan, pelayanan, dan pertumbuhan bersama
                bagi seluruh jemaat.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader eyebrow="BUTTONS" title="Actions" />

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg">
              Jadwal Ibadah
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button variant="secondary">Pawartos Minggu Ini</Button>
            <Button variant="outline">Lihat Semua Berita</Button>
            <Button variant="ghost">Lihat lokasi</Button>
            <Button variant="link">Baca selengkapnya</Button>
          </div>
        </Container>
      </Section>

      <Section className="bg-secondary/40">
        <Container>
          <SectionHeader eyebrow="BADGES" title="Labels" />

          <div className="mt-8 flex flex-wrap gap-3">
            <Badge>Gereja Induk</Badge>
            <Badge variant="secondary">Pepanthan</Badge>
            <Badge variant="outline">Agenda</Badge>
            <Badge variant="destructive">Penting</Badge>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            eyebrow="CARDS"
            title="Domain Card Foundation"
            description="Card shadcn tetap generik. WorshipCard, PawartosCard, NewsCard, dan ChurchCard akan dibangun di atas primitive ini."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Badge className="mb-2 w-fit">Gereja Induk</Badge>
                <CardTitle className="text-lg">GKJ Slogohimo</CardTitle>
                <CardDescription>Ibadah Minggu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock3 className="size-4 text-primary" />
                  <span>07.00 WIB</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-4" />
                  <span>Slogohimo, Wonogiri</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="px-0">
                  Lihat lokasi
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <Badge variant="secondary" className="mb-2 w-fit">
                  Pawartos
                </Badge>
                <CardTitle className="text-lg">Minggu Kedua Agustus 2026</CardTitle>
                <CardDescription>Minggu, 9 Agustus 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-muted-foreground">
                  Informasi pelayanan, agenda, dan kehidupan pasamuwan untuk minggu ini.
                </p>
              </CardContent>
              <CardFooter>
                <Button>Baca Pawartos</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <Badge variant="outline" className="mb-2 w-fit">
                  Berita
                </Badge>
                <CardTitle className="text-lg">Kehidupan dan pelayanan jemaat</CardTitle>
                <CardDescription>Contoh news card</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-muted-foreground">
                  Card ini menjadi referensi awal sebelum komponen berita final dibangun.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="px-0">
                  Baca berita
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Container>
      </Section>
    </main>
  )
}
