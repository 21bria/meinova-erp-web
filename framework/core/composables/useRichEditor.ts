import { watch, type MaybeRefOrGetter, toValue } from "vue"
import { useEditor } from "@tiptap/vue-3"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"

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