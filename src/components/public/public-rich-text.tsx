import type { ReactNode } from "react"

import type { RichTextContent } from "@/lib/rich-text"

type PublicRichTextProps = {
  content: RichTextContent
}

type RichTextNode = NonNullable<RichTextContent["content"]>[number]

function getSafeHref(value: unknown): string | null {
  if (typeof value !== "string") {
    return null
  }

  const href = value.trim()

  if (!href) {
    return null
  }

  if (href.startsWith("/") || href.startsWith("#")) {
    return href
  }

  try {
    const url = new URL(href)

    if (
      url.protocol === "http:" ||
      url.protocol === "https:" ||
      url.protocol === "mailto:" ||
      url.protocol === "tel:"
    ) {
      return href
    }
  } catch {
    return null
  }

  return null
}

function renderTextMarks(node: RichTextNode, key: string): ReactNode {
  let result: ReactNode = node.text ?? ""

  for (const [index, mark] of (node.marks ?? []).entries()) {
    const markKey = `${key}-mark-${index}`

    if (mark.type === "bold") {
      result = <strong key={markKey}>{result}</strong>

      continue
    }

    if (mark.type === "italic") {
      result = <em key={markKey}>{result}</em>

      continue
    }

    if (mark.type === "link") {
      const href = getSafeHref(mark.attrs?.href)

      if (!href) {
        continue
      }

      const external = href.startsWith("http://") || href.startsWith("https://")

      result = (
        <a
          key={markKey}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
        >
          {result}
        </a>
      )
    }
  }

  return result
}

function renderNodes(nodes: RichTextNode[] | undefined, parentKey: string): ReactNode {
  if (!nodes) {
    return null
  }

  return nodes.map((node, index) => {
    const key = `${parentKey}-${index}`

    if (node.type === "text") {
      return renderTextMarks(node, key)
    }

    const children = renderNodes(node.content, key)

    switch (node.type) {
      case "paragraph":
        return (
          <p key={key} className="leading-8 text-foreground/85">
            {children}
          </p>
        )

      case "heading": {
        const level = node.attrs?.level

        if (level === 3) {
          return (
            <h3
              key={key}
              className="mt-8 font-heading text-xl font-semibold tracking-tight first:mt-0 md:text-2xl"
            >
              {children}
            </h3>
          )
        }

        return (
          <h2
            key={key}
            className="mt-10 font-heading text-2xl font-semibold tracking-tight first:mt-0 md:text-3xl"
          >
            {children}
          </h2>
        )
      }

      case "bulletList":
        return (
          <ul key={key} className="list-disc space-y-2 pl-6 leading-7">
            {children}
          </ul>
        )

      case "orderedList":
        return (
          <ol key={key} className="list-decimal space-y-2 pl-6 leading-7">
            {children}
          </ol>
        )

      case "listItem":
        return <li key={key}>{children}</li>

      case "blockquote":
        return (
          <blockquote
            key={key}
            className="border-l-4 border-primary/30 pl-5 font-heading text-lg leading-8 text-muted-foreground italic"
          >
            {children}
          </blockquote>
        )

      default:
        return <span key={key}>{children}</span>
    }
  })
}

function PublicRichText({ content }: PublicRichTextProps) {
  return <div className="space-y-5">{renderNodes(content.content, "rich-text")}</div>
}

export { PublicRichText }
