import StarterKit from "@tiptap/starter-kit"

const richTextEditorExtensions = [
  StarterKit.configure({
    heading: {
      levels: [2, 3],
    },

    code: false,
    codeBlock: false,
    hardBreak: false,
    horizontalRule: false,
    strike: false,
    underline: false,

    link: {
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      defaultProtocol: "https",
      HTMLAttributes: {
        target: "_blank",
        rel: "noopener noreferrer",
      },
    },
  }),
]

export { richTextEditorExtensions }
