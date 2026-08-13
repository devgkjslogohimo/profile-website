import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HeroSlideSlotForm } from "@/features/hero-slides/components/hero-slide-slot-form"

type HeroSlideSettingsProps = {
  slides: {
    id: string
    slot: number
    imageUrl: string
    altText: string
    isActive: boolean
  }[]
}

const slots = [1, 2, 3] as const

function HeroSlideSettings({ slides }: HeroSlideSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Slider</CardTitle>

        <p className="text-sm text-muted-foreground">
          Kelola maksimal tiga foto yang akan tampil bergantian pada bagian Hero halaman utama.
        </p>
      </CardHeader>

      <CardContent className="grid gap-5 lg:grid-cols-3">
        {slots.map((slot) => {
          const slide = slides.find((item) => item.slot === slot) ?? null

          return (
            <HeroSlideSlotForm
              key={slot}
              slot={slot}
              slide={
                slide
                  ? {
                      imageUrl: slide.imageUrl,
                      altText: slide.altText,
                      isActive: slide.isActive,
                    }
                  : null
              }
            />
          )
        })}
      </CardContent>
    </Card>
  )
}

export { HeroSlideSettings }
