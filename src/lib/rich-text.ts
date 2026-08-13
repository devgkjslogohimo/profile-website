import type { JSONContent } from "@tiptap/core"

const emptyRichTextContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
}

function hasTextContent(node: JSONContent): boolean {
  if (typeof node.text === "string" && node.text.trim().length > 0) {
    return true
  }

  return node.content?.some((child) => hasTextContent(child)) ?? false
}

function isRichTextEmpty(content: JSONContent | null | undefined) {
  if (!content) {
    return true
  }

  return !hasTextContent(content)
}

function isRichTextContent(value: unknown): value is JSONContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false
  }

  const document = value as Record<string, unknown>

  if (document.type !== "doc") {
    return false
  }

  if (document.content !== undefined && !Array.isArray(document.content)) {
    return false
  }

  return true
}

export { emptyRichTextContent, isRichTextContent, isRichTextEmpty }

export type { JSONContent as RichTextContent }
