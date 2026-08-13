import type { IconType } from "react-icons"

type PublicEmptyStateProps = {
  icon: IconType
  title: string
  description: string
}

function PublicEmptyState({ icon: Icon, title, description }: PublicEmptyStateProps) {
  return (
    <div className="mt-10 rounded-2xl border border-dashed bg-muted/20 px-6 py-12 text-center md:px-10">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon aria-hidden="true" className="size-5" />
      </div>

      <h2 className="mt-5 font-heading text-xl font-medium">{title}</h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  )
}

export { PublicEmptyState }
