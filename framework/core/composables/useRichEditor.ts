import { watch, type MaybeRefOrGetter, toValue } from "vue"
import { useEditor } from "@tiptap/vue-3"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { ImageBlock } from "../editor/imageBlock"
import { YoutubeEmbed } from "../editor/youtubeEmbed"

export function useRichEditor(
  content: MaybeRefOrGetter<string | null | undefined>,
  placeholder: MaybeRefOrGetter<string | undefined>,
  disabled: MaybeRefOrGetter<boolean | undefined>,
  onUpdate: (html: string) => void,
) {
  const editor = useEditor({
    content: toValue(content) ?? "",
    editable: !toValue(disabled),

    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: () => toValue(placeholder) ?? "Write content...",
      }),

      // Tanpa node ini, `<iframe>` yang datang dari isi artikel
      // dibuang TipTap saat `setContent` — jadi membuka artikel
      // bervideo lalu menekan Save akan **menghapus videonya**, tanpa
      // satu pun pesan. Tag yang tidak dikenal skema editor memang
      // tidak diteruskan.
      YoutubeEmbed,

      // Alasan yang sama persis untuk gambar. `@tiptap/extension-image`
      // sudah lama terpasang di `package.json` tapi tidak pernah
      // diimpor di mana pun, jadi editor tidak bisa menyisipkan gambar
      // **dan** membuang gambar yang sudah ada di artikel begitu
      // seseorang menekan Save.
      //
      // `inline: false` — gambar adalah blok tersendiri, bukan
      // sesuatu yang menyelip di tengah kalimat. Untuk panduan berupa
      // langkah, tangkapan layar memang duduk di antara paragraf.
      ImageBlock.configure({
        inline: false,
        allowBase64: false,
      }),
    ],

    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-40 px-3 py-2 focus:outline-none",
      },
    },

    onUpdate: ({ editor }) => {
      onUpdate(editor.isEmpty ? "" : editor.getHTML())
    },
  })

  watch(
    () => toValue(content),
    (value) => {
      if (!editor.value)
        return

      const nextValue = value ?? ""
      const currentValue = editor.value.isEmpty
        ? ""
        : editor.value.getHTML()

      if (nextValue !== currentValue) {
        editor.value.commands.setContent(nextValue, {
          emitUpdate: false,
        })
      }
    },
  )

  watch(
    () => toValue(disabled),
    (value) => {
      editor.value?.setEditable(!value)
    },
    {
      immediate: true,
    },
  )

  return {
    editor,
  }
}