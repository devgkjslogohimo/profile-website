import type { ReactNode } from "react"

type PublicDetailHeaderProps = {
  eyebrow: string
  title: string
  description?: string | null
  meta?: ReactNode
}

function PublicDetailHeader({ eyebrow, title, description, meta }: PublicDetailHeaderProps) {
  return (
    <header className="max-w-4xl">
      <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{eyebrow}</p>

      <h1 className="mt-3 font-heading text-3xl leading-tight font-semibold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h1>

      {description ? (
        <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
          {description}
        </p>
      ) : null}

      {meta ? (
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {meta}
        </div>
      ) : null}
    </header>
  )
}

export { PublicDetailHeader }
