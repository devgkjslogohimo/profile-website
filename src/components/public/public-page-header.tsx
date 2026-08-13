type PublicPageHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
}

function PublicPageHeader({ eyebrow, title, description }: PublicPageHeaderProps) {
  return (
    <header className="max-w-3xl">
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{eyebrow}</p>
      ) : null}

      <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h1>

      {description ? (
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
          {description}
        </p>
      ) : null}
    </header>
  )
}

export { PublicPageHeader }
