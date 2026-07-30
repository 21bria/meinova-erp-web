<script setup lang="ts">
import { computed } from "vue"
import type { Editor } from "@tiptap/vue-3"

import {
  Bold,
  Code2,
  Eraser,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-vue-next"

const props = defineProps<{
  editor?: Editor
  disabled?: boolean
}>()

function buttonClass(active = false) {
  return [
    "inline-flex size-8 items-center justify-center rounded-md",
    "transition-colors hover:bg-muted",
    "disabled:pointer-events-none disabled:opacity-40",
    active
      ? "bg-muted text-foreground"
      : "text-muted-foreground",
  ]
}

const heading = computed(() => {
  const editor = props.editor

  if (!editor)
    return "paragraph"

  if (editor.isActive("heading", { level: 1 }))
    return "h1"

  if (editor.isActive("heading", { level: 2 }))
    return "h2"

  if (editor.isActive("heading", { level: 3 }))
    return "h3"

  return "paragraph"
})

function setHeading(event: Event) {
  const editor = props.editor

  if (!editor)
    return

  const target = event.target as HTMLSelectElement
  const value = target.value

  if (value === "paragraph") {
    editor
      .chain()
      .focus()
      .setParagraph()
      .run()

    return
  }

  const level = Number(
    value.replace("h", ""),
  ) as 1 | 2 | 3

  editor
    .chain()
    .focus()
    .toggleHeading({ level })
    .run()
}
</script>

<template>
  <div v-if="editor" class="flex flex-wrap items-center gap-1 border-b bg-muted/30 p-2">
    <button type="button" :class="buttonClass()" :disabled="disabled
      || !editor.can().chain().focus().undo().run()
      " title="Undo" @click="editor.chain().focus().undo().run()">
      <Undo2 class="size-4" />
    </button>

    <button type="button" :class="buttonClass()" :disabled="disabled
      || !editor.can().chain().focus().redo().run()
      " title="Redo" @click="editor.chain().focus().redo().run()">
      <Redo2 class="size-4" />
    </button>

    <div class="mx-1 h-5 w-px bg-border" />

    <select class="
        h-8 rounded-md border border-input
        bg-background px-2 text-sm outline-none
        disabled:cursor-not-allowed disabled:opacity-50
      " :disabled="disabled" :value="heading" @change="setHeading">
      <option value="paragraph">
        Paragraph
      </option>

      <option value="h1">
        Heading 1
      </option>

      <option value="h2">
        Heading 2
      </option>

      <option value="h3">
        Heading 3
      </option>
    </select>

    <div class="mx-1 h-5 w-px bg-border" />

    <button type="button" :class="buttonClass(editor.isActive('bold'))" :disabled="disabled" title="Bold"
      @click="editor.chain().focus().toggleBold().run()">
      <Bold class="size-4" />
    </button>

    <button type="button" :class="buttonClass(editor.isActive('italic'))" :disabled="disabled" title="Italic"
      @click="editor.chain().focus().toggleItalic().run()">
      <Italic class="size-4" />
    </button>

    <button type="button" :class="buttonClass(editor.isActive('underline'))" :disabled="disabled" title="Underline"
      @click="editor.chain().focus().toggleUnderline().run()">
      <Underline class="size-4" />
    </button>

    <button type="button" :class="buttonClass(editor.isActive('strike'))" :disabled="disabled" title="Strikethrough"
      @click="editor.chain().focus().toggleStrike().run()">
      <Strikethrough class="size-4" />
    </button>

    <div class="mx-1 h-5 w-px bg-border" />

    <button type="button" :class="buttonClass(editor.isActive('bulletList'))" :disabled="disabled" title="Bullet list"
      @click="
        editor
          .chain()
          .focus()
          .toggleBulletList()
          .run()
        ">
      <List class="size-4" />
    </button>

    <button type="button" :class="buttonClass(editor.isActive('orderedList'))" :disabled="disabled"
      title="Numbered list" @click="
        editor
          .chain()
          .focus()
          .toggleOrderedList()
          .run()
        ">
      <ListOrdered class="size-4" />
    </button>

    <button type="button" :class="buttonClass(editor.isActive('blockquote'))" :disabled="disabled" title="Quote" @click="
      editor
        .chain()
        .focus()
        .toggleBlockquote()
        .run()
      ">
      <Quote class="size-4" />
    </button>

    <button type="button" :class="buttonClass(editor.isActive('codeBlock'))" :disabled="disabled" title="Code block"
      @click="
        editor
          .chain()
          .focus()
          .toggleCodeBlock()
          .run()
        ">
      <Code2 class="size-4" />
    </button>

    <div class="mx-1 h-5 w-px bg-border" />

    <button type="button" :class="buttonClass()" :disabled="disabled" title="Clear formatting" @click="
      editor
        .chain()
        .focus()
        .clearNodes()
        .unsetAllMarks()
        .run()
      ">
      <Eraser class="size-4" />
    </button>
  </div>
</template>