<script setup lang="ts">
import { Input } from "@/components/ui/input"
import MFieldLabel from "./MFieldLabel.vue"
import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"

const props = defineProps<{
  modelValue?: string | null
  label?: string
  error?: string | null
  hint?: string | null
  required?: boolean
  disabled?: boolean
}>()

defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

/**
 * Django mengirim `07:00:00`; `<input type="time">` bawaannya berlangkah
 * satu menit, jadi nilai berdetik bukan-nol ditolaknya dan kotaknya
 * tampil kosong — sama merugikannya dengan datetime, karena kosong
 * terbaca seperti belum diisi. Dipotong ke `HH:mm`.
 */
function toInputValue(value?: string | null): string {
  if (!value)
    return ""

  const match = String(value).match(/^(\d{2}:\d{2})/)

  return match?.[1] ?? ""
}
</script>

<template>
  <div class="grid gap-2">
    <MFieldLabel :label="label" :required="required" />
    <Input
      type="time"
      :model-value="toInputValue(props.modelValue)"
      :disabled="disabled"
      @update:model-value="(v) => $emit('update:modelValue', String(v ?? ''))"
    />
    <MFieldHint :text="hint" />
    <MFieldError :error="error" />
  </div>
</template>
