import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="container"
      className={cn("mx-auto w-full max-w-7xl px-5 md:px-8 xl:px-10", className)}
      {...props}
    />
  )
}

export { Container }
