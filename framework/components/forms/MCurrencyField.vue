<script setup lang="ts">
import { Input } from "@/components/ui/input"

import { formatLocaleNumber, localeSeparators } from "../../core/utils/i18n"
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
    : formatLocaleNumber(props.modelValue),
)

/*
| Membaca kembali apa yang ditampilkan `display`, **menurut bahasa yang
| sama**.
|
| Sebelumnya: `v.replace(/[^\d.-]/g, "")`, dipasangkan dengan tampilan
| yang selalu `id-ID`. Di locale itu pemisah ribuannya titik, jadi
| 1.234.567 yang dibaca ulang menghasilkan `Number("1.234.567")` —
| **NaN**. Kolom uang yang disunting lalu disimpan tanpa mengetik ulang
| seluruh angkanya mengirim NaN ke backend, dan gagalnya tidak berbunyi
| di sisi ini.
|
| Sekarang pemisahnya diturunkan dari `Intl` untuk bahasa aktif:
| pemisah ribuan dibuang, pemisah desimal dijadikan titik, sisanya
| ditolak. Nilai numeriknya sendiri tidak disentuh — tidak ada
| pembulatan, tidak ada perubahan presisi.
*/
function parseInput(raw: string): number | null {
  const { group, decimal } = localeSeparators()

  const normalized = raw
    .split(group).join("")
    .split(decimal).join(".")
    .replace(/[^\d.-]/g, "")

  if (!normalized || normalized === "-" || normalized === ".")
    return null

  const parsed = Number(normalized)

  // NaN tidak pernah diteruskan. Mengirimnya ke form berarti angka
  // yang hilang diam-diam; membiarkan nilai lama berdiri lebih jujur.
  return Number.isNaN(parsed) ? null : parsed
}

function update(v: string) {
  emit("update:modelValue", parseInput(v))
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