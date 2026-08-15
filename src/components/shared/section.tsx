import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

type SectionProps = ComponentProps<"section"> & {
  spacing?: "default" | "page"
}

function Section({ className, spacing = "default", ...props }: SectionProps) {
  return (
    <section
      data-slot="section"
      className={cn(
        spacing === "page"
          ? "pt-10 pb-16 md:pt-12 md:pb-20 lg:pt-14 lg:pb-24"
          : "py-16 md:py-20 lg:py-24",
        className
      )}
      {...props}
    />
  )
}

export { Section }
