<script setup lang="ts">
/*
|--------------------------------------------------------------------------
| MDateField — tanggal tanpa jam
|--------------------------------------------------------------------------
|
| Kotaknya menampilkan `25.09.26`. Yang naik ke `modelValue` — dan
| karenanya ke payload API — selalu `2026-09-25`.
|
| **Dua keadaan, bukan satu.** Versi sebelumnya memakai `modelValue`
| langsung sebagai isi kotak, lalu menormalkan apa pun yang keluar dari
| kotak itu seolah-olah selalu hari-dulu. Pada Edit isi kotaknya ISO,
| jadi normalisasinya menebak untuk kedua kalinya: `2026-09-27` dibaca
| hari=2026, tahun=27, dan yang tersimpan menjadi `2027-09-2026`. Satu
| nilai untuk dua bentuk adalah bug itu sendiri, bukan penyebabnya.
|
| Di sini `text` milik yang mengetik, `modelValue` milik API, dan
| `parseDateInput`/`formatDateForDisplay` satu-satunya jembatan.
|
| **Yang diketik tidak pernah ditulis ulang di tengah jalan.** Watcher
| hanya menyentuh `text` kalau nilai yang masuk bukan yang sedang
| ditampilkan — tanpa syarat itu, gema `update:modelValue` dari induk
| akan menyusun ulang string-nya pada tiap ketukan dan memindahkan
| kursor ke ujung. Perapian menjadi `25.09.26` ditunda sampai blur.
|
| **Tanggal yang tidak ada di kalender ditolak, bukan digulirkan.**
| `31.02.26` membuat modelnya kosong dan menampilkan keluhan; ia tidak
| diam-diam menjadi 3 Maret seperti yang dilakukan `new Date`.
*/
import { computed } from "vue"

import { Input } from "@/components/ui/input"
import MFieldLabel from "./MFieldLabel.vue"
import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"
import { useDateFieldModel } from "../../core/composables/useDateFieldModel"
import { DATE_DISPLAY_FORMAT } from "../../core/utils/date"
import { translate } from "../../core/utils/i18n"

const props = defineProps<{
  modelValue?: string | null
  label?: string
  placeholder?: string
  error?: string | null
  hint?: string | null
  required?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string | null): void
}>()

/*
| Seluruh aturan sinkronisasinya ada di composable, diuji tanpa DOM di
| `core/composables/__tests__/useDateFieldModel.spec.ts`. Yang tinggal
| di sini cuma penampilannya.
*/
const { text, touched, malformed, onInput, onBlur } = useDateFieldModel({
  value: () => props.modelValue,
  emit: next => emit("update:modelValue", next),
})

const formatError = computed(() => {
  if (!touched.value || !malformed.value)
    return null

  return translate(
    "common.dateInput.invalid",
    `Invalid date. Use ${DATE_DISPLAY_FORMAT} — for example 25.09.26.`,
    { format: DATE_DISPLAY_FORMAT },
  )
})

/*
| Kesalahan dari backend didahulukan: ia tahu hal yang tidak diketahui
| kotak ini (periode terkunci, tanggal di luar tahun buku), dan
| menimpanya dengan keluhan format akan menyembunyikan alasan yang
| sebenarnya.
*/
const shownError = computed(() => props.error ?? formatError.value)
</script>

<template>
  <div class="grid gap-2">
    <MFieldLabel :label="label" :required="required" />
    <Input
      :model-value="text"
      inputmode="numeric"
      autocomplete="off"
      :placeholder="placeholder ?? DATE_DISPLAY_FORMAT"
      :disabled="disabled"
      :aria-invalid="shownError ? 'true' : undefined"
      @update:model-value="(v) => onInput(String(v ?? ''))"
      @blur="onBlur"
    />
    <MFieldHint
      :text="
        hint ?? translate(
          'common.dateInput.hint',
          'Format dd.mm.yy — 25.09.26 is 25 September 2026.',
        )
      "
    />
    <MFieldError :error="shownError" />
  </div>
</template>
