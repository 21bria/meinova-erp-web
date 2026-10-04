<script setup lang="ts">
import MLookupSelect from "../lookup/MLookupSelect.vue"

import MFieldLabel from "./MFieldLabel.vue"
import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"

withDefaults(
  defineProps<{
    modelValue?: number | null
    label?: string
    endpoint: string
    placeholder?: string
    error?: string | null
    hint?: string | null
    required?: boolean
    disabled?: boolean
    labelKey?: string
    valueKey?: string
    selectedLabel?: string | null
    depends?: Record<string, any>
  }>(),
  {
    modelValue: null,
    label: "",
    placeholder: "",
    error: null,
    hint: null,
    required: false,
    disabled: false,
    labelKey: undefined,
    valueKey: undefined,
    selectedLabel: null,
    depends: () => ({}),
  },
)

const emit = defineEmits<{
  "update:modelValue": [
    value: number | null,
  ]

  select: [
    item: Record<string, any> | null,
  ]
}>()

/*
 * `MLookupSelect` bisa bermode centang-banyak dan mengembalikan array.
 * Field ini **selalu** pilih-satu — `multiple` tidak pernah dioper —
 * jadi arraynya disempitkan di sini. Diambil elemen pertama, bukan
 * dibuang jadi null: kalau suatu saat ada yang menyalakan mode centang
 * dari luar, kehilangan nilainya diam-diam jauh lebih sulit dilacak
 * daripada nilai yang terpotong.
 */
function onUpdate(value: number | number[] | null) {
  if (Array.isArray(value)) {
    emit("update:modelValue", value.length ? Number(value[0]) : null)
    return
  }

  emit("update:modelValue", value)
}
</script>

<template>
  <div class="grid gap-2">
    <MFieldLabel
      :label="label"
      :required="required"
    />

    <MLookupSelect
      :model-value="modelValue"
      :label="label ?? ''"
      :endpoint="endpoint"
      :depends="depends"
      :label-key="labelKey"
      :value-key="valueKey"
      :selected-label="selectedLabel"
      :placeholder="placeholder"
      :disabled="disabled"
      variant="field"
      @update:model-value="onUpdate"
      @select="
        emit(
          'select',
          $event,
        )
      "
    />

    <MFieldHint :text="hint" />
    <MFieldError :error="error" />
  </div>
</template>