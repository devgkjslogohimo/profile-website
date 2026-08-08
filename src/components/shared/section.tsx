import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

function Section({ className, ...props }: ComponentProps<"section">) {
  return (
    <section data-slot="section" className={cn("py-16 md:py-20 lg:py-24", className)} {...props} />
  )
}

export { Section }
