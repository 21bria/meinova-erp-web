<script setup lang="ts">
import { Input } from "@/components/ui/input"
import MFieldLabel from "./MFieldLabel.vue"
import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"

const props = withDefaults(defineProps<{
  modelValue?: number | null
  label?: string
  currency?: string
  error?: string | null
  hint?: string | null
  required?: boolean
  disabled?: boolean
}>(), {
  currency: "IDR",
})

const emit = defineEmits<{
  (e: "update:modelValue", value: number | null): void
}>()

const display = computed(() =>
  props.modelValue == null
    ? ""
    : new Intl.NumberFormat("id-ID").format(props.modelValue),
)

function update(v: string) {
  const cleaned = v.replace(/[^\d.-]/g, "")
  emit("update:modelValue", cleaned ? Number(cleaned) : null)
}
</script>

<template>
  <div class="grid gap-2">
    <MFieldLabel :label="label" :required="required" />
    <div class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground">{{ currency }}</span>
      <Input :model-value="display" :disabled="disabled" @update:model-value="(v) => update(String(v ?? ''))" />
    </div>
    <MFieldHint :text="hint" />
    <MFieldError :error="error" />
  </div>
</template>