"use client"

import type { Editor } from "@tiptap/core"
import { useEditorState } from "@tiptap/react"
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
  Unlink,
} from "lucide-react"

import { Button } from "@/components/ui/button"

type RichTextEditorToolbarProps = {
  editor: Editor
  disabled?: boolean
}

function RichTextEditorToolbar({ editor, disabled = false }: RichTextEditorToolbarProps) {
  const state = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => ({
      bold: currentEditor.isActive("bold"),
      italic: currentEditor.isActive("italic"),
      heading2: currentEditor.isActive("heading", {
        level: 2,
      }),
      heading3: currentEditor.isActive("heading", {
        level: 3,
      }),
      bulletList: currentEditor.isActive("bulletList"),
      orderedList: currentEditor.isActive("orderedList"),
      blockquote: currentEditor.isActive("blockquote"),
      link: currentEditor.isActive("link"),

      canUndo: currentEditor.can().undo(),
      canRedo: currentEditor.can().redo(),
    }),
  })

  function handleSetLink() {
    const currentHref = editor.getAttributes("link").href as string | undefined

    const href = window.prompt("Masukkan URL", currentHref ?? "https://")

    if (href === null) {
      return
    }

    const normalizedHref = href.trim()

    if (!normalizedHref) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()

      return
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: normalizedHref,
      })
      .run()
  }

  function handleRemoveLink() {
    editor.chain().focus().extendMarkRange("link").unsetLink().run()
  }

  return (
    <div className="flex flex-wrap gap-1 border-b bg-muted/30 p-2">
      <Button
        type="button"
        variant={state.bold ? "secondary" : "ghost"}
        size="icon-sm"
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBold().run()}
        aria-label="Tebal"
        title="Tebal"
      >
        <Bold />
      </Button>

      <Button
        type="button"
        variant={state.italic ? "secondary" : "ghost"}
        size="icon-sm"
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Miring"
        title="Miring"
      >
        <Italic />
      </Button>

      <Button
        type="button"
        variant={state.heading2 ? "secondary" : "ghost"}
        size="icon-sm"
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        aria-label="Heading 2"
        title="Heading 2"
      >
        <Heading2 />
      </Button>

      <Button
        type="button"
        variant={state.heading3 ? "secondary" : "ghost"}
        size="icon-sm"
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        aria-label="Heading 3"
        title="Heading 3"
      >
        <Heading3 />
      </Button>

      <Button
        type="button"
        variant={state.bulletList ? "secondary" : "ghost"}
        size="icon-sm"
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Daftar bullet"
        title="Daftar bullet"
      >
        <List />
      </Button>

      <Button
        type="button"
        variant={state.orderedList ? "secondary" : "ghost"}
        size="icon-sm"
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Daftar bernomor"
        title="Daftar bernomor"
      >
        <ListOrdered />
      </Button>

      <Button
        type="button"
        variant={state.blockquote ? "secondary" : "ghost"}
        size="icon-sm"
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        aria-label="Kutipan"
        title="Kutipan"
      >
        <Quote />
      </Button>

      <Button
        type="button"
        variant={state.link ? "secondary" : "ghost"}
        size="icon-sm"
        disabled={disabled}
        onClick={handleSetLink}
        aria-label="Tambah atau ubah link"
        title="Tambah atau ubah link"
      >
        <Link2 />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={disabled || !state.link}
        onClick={handleRemoveLink}
        aria-label="Hapus link"
        title="Hapus link"
      >
        <Unlink />
      </Button>

      <div aria-hidden="true" className="mx-1 w-px bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={disabled || !state.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
        aria-label="Undo"
        title="Undo"
      >
        <Undo2 />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={disabled || !state.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
        aria-label="Redo"
        title="Redo"
      >
        <Redo2 />
      </Button>
    </div>
  )
}

export { RichTextEditorToolbar }
