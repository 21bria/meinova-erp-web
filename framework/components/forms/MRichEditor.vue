<script setup lang="ts">
import { EditorContent } from "@tiptap/vue-3"

import { useRichEditor } from "@framework"

import MFieldLabel from "./MFieldLabel.vue"
import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"
import MRichEditorToolbar from "./MRichEditorToolbar.vue"

const props = defineProps<{
  modelValue?: string | null
  label?: string
  placeholder?: string
  hint?: string | null
  error?: string | null
  required?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

const { editor } = useRichEditor(
  () => props.modelValue,
  () => props.placeholder,
  () => props.disabled,
  value => emit("update:modelValue", value),
)
</script>

<template>
  <div class="grid gap-2">
    <MFieldLabel :label="label" :required="required" />

    <div class="
    overflow-hidden
    rounded-md
    border
    border-input
    bg-background
    transition-colors
    focus-within:border-ring
    focus-within:ring-2
    focus-within:ring-ring/20
  ">
      <MRichEditorToolbar :editor="editor" :disabled="disabled" />

      <EditorContent v-if="editor" :editor="editor" class="min-h-[180px]" />
    </div>

    <MFieldHint :text="hint" />
    <MFieldError :error="error" />
  </div>
</template>

<style scoped>
:deep(.tiptap) {
  min-height: 180px;
  padding: 12px 16px;
  outline: none;
}

:deep(.tiptap p.is-editor-empty:first-child::before) {
  color: hsl(var(--muted-foreground));
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

:deep(.tiptap h1) {
  margin: 1rem 0 0.5rem;
  font-size: 1.75rem;
  font-weight: 700;
}

:deep(.tiptap h2) {
  margin: 1rem 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}

:deep(.tiptap h3) {
  margin: 1rem 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

:deep(.tiptap ul) {
  list-style: disc;
  padding-left: 1.5rem;
}

:deep(.tiptap ol) {
  list-style: decimal;
  padding-left: 1.5rem;
}

:deep(.tiptap blockquote) {
  margin: 0.75rem 0;
  border-left: 3px solid hsl(var(--border));
  padding-left: 1rem;
  color: hsl(var(--muted-foreground));
}

:deep(.tiptap pre) {
  overflow-x: auto;
  border-radius: 0.375rem;
  background: hsl(var(--muted));
  padding: 0.75rem 1rem;
}

/*
  Gambar. Tangkapan layar lazimnya jauh lebih lebar daripada kolom
  editornya — tanpa batas ini, satu screenshot 2000px mendorong
  seluruh editor melebar dan formulirnya bisa digulir ke samping.
*/
:deep(.tiptap img) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0.75rem 0;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
}

:deep(.tiptap img.ProseMirror-selectednode) {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/*
  Video sematan. Tanpa tinggi eksplisit, iframe bawaan browser
  setinggi 150px — videonya masuk tapi terlihat seperti pita hitam,
  dan penulisnya menyangka sematannya gagal.
*/
:deep(.tiptap iframe) {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
  margin: 0.75rem 0;
  border-radius: 0.375rem;
}

:deep(.tiptap iframe.ProseMirror-selectednode) {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
</style>