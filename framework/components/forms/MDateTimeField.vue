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
 * `<input type="datetime-local">` hanya menerima `YYYY-MM-DDTHH:mm`.
 *
 * Serializer mengirim ISO lengkap (`2026-08-14T07:00:00Z`), dan nilai
 * yang tidak sah **dibuang browser tanpa keluhan** — kotaknya tampil
 * kosong. Itu gagal ke arah paling merugikan: yang membuka form
 * membacanya sebagai data yang belum diisi, lalu menekan Save dan
 * benar-benar mengosongkannya.
 *
 * Zonanya sengaja **dipotong, bukan dikonversi**. `TIME_ZONE` proyek ini
 * UTC sementara tabel merender pakai jam browser, dan selisih itu sudah
 * ada sebelum komponen ini — menambahkan konversi di sini akan membuat
 * satu layar bergeser tujuh jam terhadap layar lain. Yang benar
 * menyeragamkannya di satu keputusan tersendiri, bukan menambal per
 * komponen.
 */
function toInputValue(value?: string | null): string {
  if (!value)
    return ""

  const match = String(value).match(
    /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/,
  )

  return match ? `${match[1]}T${match[2]}` : ""
}
</script>

<template>
  <div class="grid gap-2">
    <MFieldLabel :label="label" :required="required" />
    <Input
      type="datetime-local"
      :model-value="toInputValue(props.modelValue)"
      :disabled="disabled"
      @update:model-value="(v) => $emit('update:modelValue', String(v ?? ''))"
    />
    <MFieldHint :text="hint" />
    <MFieldError :error="error" />
  </div>
</template>
