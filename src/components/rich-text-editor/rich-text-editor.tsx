"use client"

import type { JSONContent } from "@tiptap/core"
import { EditorContent, useEditor } from "@tiptap/react"
import { useEffect } from "react"

import { richTextEditorExtensions } from "@/components/rich-text-editor/rich-text-editor-extensions"
import { RichTextEditorToolbar } from "@/components/rich-text-editor/rich-text-editor-toolbar"
import { emptyRichTextContent } from "@/lib/rich-text"
import { cn } from "@/lib/utils"

type RichTextEditorProps = {
  value?: JSONContent | null
  onChange: (value: JSONContent) => void

  disabled?: boolean
  invalid?: boolean

  minHeightClassName?: string
  placeholder?: string
}

function RichTextEditor({
  value,
  onChange,
  disabled = false,
  invalid = false,
  minHeightClassName = "min-h-72",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: richTextEditorExtensions,
    content: value ?? emptyRichTextContent,

    immediatelyRender: false,

    editable: !disabled,

    editorProps: {
      attributes: {
        class: cn(minHeightClassName, "px-4 py-4 text-sm leading-7 outline-none"),
      },
    },

    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getJSON())
    },
  })

  useEffect(() => {
    if (!editor) {
      return
    }

    editor.setEditable(!disabled)
  }, [disabled, editor])

  useEffect(() => {
    if (!editor) {
      return
    }

    const nextContent = value ?? emptyRichTextContent

    if (JSON.stringify(editor.getJSON()) === JSON.stringify(nextContent)) {
      return
    }

    editor.commands.setContent(nextContent, {
      emitUpdate: false,
    })
  }, [editor, value])

  if (!editor) {
    return <div className={cn(minHeightClassName, "animate-pulse rounded-xl border bg-muted/30")} />
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-background",
        "focus-within:ring-2 focus-within:ring-ring/50",
        invalid && "border-destructive focus-within:ring-destructive/20",
        disabled && "opacity-60"
      )}
    >
      <RichTextEditorToolbar editor={editor} disabled={disabled} />

      <EditorContent
        editor={editor}
        className={[
          "[&_.tiptap_h2]:mt-6",
          "[&_.tiptap_h2]:text-xl",
          "[&_.tiptap_h2]:font-semibold",

          "[&_.tiptap_h3]:mt-5",
          "[&_.tiptap_h3]:text-lg",
          "[&_.tiptap_h3]:font-semibold",

          "[&_.tiptap_p]:my-3",

          "[&_.tiptap_ul]:my-3",
          "[&_.tiptap_ul]:list-disc",
          "[&_.tiptap_ul]:pl-6",

          "[&_.tiptap_ol]:my-3",
          "[&_.tiptap_ol]:list-decimal",
          "[&_.tiptap_ol]:pl-6",

          "[&_.tiptap_blockquote]:my-4",
          "[&_.tiptap_blockquote]:border-l-4",
          "[&_.tiptap_blockquote]:pl-4",
          "[&_.tiptap_blockquote]:italic",

          "[&_.tiptap_a]:underline",
          "[&_.tiptap_a]:underline-offset-4",
        ].join(" ")}
      />
    </div>
  )
}

export { RichTextEditor }
