import { computed, ref, watch } from "vue"

import { formatDateForDisplay, parseDateInput } from "../utils/date"

/*
|--------------------------------------------------------------------------
| Jembatan antara kotak isian tanggal dan nilai API
|--------------------------------------------------------------------------
|
| Dipisahkan dari `MDateField.vue` bukan demi kerapian: yang rusak pada
| kolom tanggal selama ini bukan tampilannya melainkan **aturan
| sinkronisasinya**, dan aturan yang tinggal di dalam `<script setup>`
| hanya bisa diuji dengan menyalakan DOM. Repo ini sengaja tidak
| menyalakannya, jadi aturan itu tidak pernah diuji sama sekali — dan
| `2027-09-2026` hidup di sana berbulan-bulan.
|
| Di sini ia fungsi biasa di atas reaktivitas Vue, bisa dijalankan tanpa
| komponen, tanpa DOM, tanpa Nuxt.
|
| Tiga aturannya:
|
| 1. **Dua keadaan.** `text` bentuk tampilan (`25.09.26`), `value()`
|    bentuk API (`2026-09-25`). Tidak pernah satu string untuk keduanya
|    — begitu disatukan, tidak ada yang bisa memutuskan apakah bagian
|    pertamanya hari atau tahun.
|
| 2. **Yang diketik menang.** Nilai yang masuk hanya menulis ulang
|    `text` kalau bukan yang sedang ditampilkan. Tanpa itu, gema
|    `update:modelValue` dari induk menyusun ulang string pada tiap
|    ketukan dan melempar kursor ke ujung.
|
| 3. **Yang belum/tidak sah mengosongkan model.** Membiarkannya berarti
|    kotaknya menampilkan satu tanggal sementara yang tersimpan tanggal
|    lain, lalu Save menulis yang tidak terlihat di layar mana pun.
*/
export type DateFieldModelOptions = {
  /* Nilai dari induk, bentuk API. */
  value: () => string | null | undefined

  /* Naik ke induk, bentuk API. `null` berarti kosong/tidak sah. */
  emit: (next: string | null) => void
}

export function useDateFieldModel(options: DateFieldModelOptions) {
  const text = ref(formatDateForDisplay(options.value()))

  /*
  | Keluhan format ditahan sampai kotaknya ditinggalkan. Mengetik
  | `25.09.26` melewati `2`, `25`, `25.0` — semuanya belum sah, dan
  | memerahkan kolom pada tiap ketukan melatih orang mengabaikan
  | warnanya.
  */
  const touched = ref(false)

  const malformed = computed(
    () => text.value.trim() !== "" && parseDateInput(text.value) === null,
  )

  /*
  | `flush: "sync"` supaya hidrasi Edit sudah terpasang pada render
  | yang sama dengan datangnya data — bukan satu tick sesudahnya, yang
  | terlihat sebagai kolom berkedip dari kosong ke terisi.
  */
  watch(
    () => options.value() ?? null,
    (incoming) => {
      if (parseDateInput(text.value) === incoming)
        return

      text.value = formatDateForDisplay(incoming)
      touched.value = false
    },
    { flush: "sync" },
  )

  function onInput(raw: string) {
    text.value = raw

    const next = parseDateInput(raw)

    if ((options.value() ?? null) === next)
      return

    options.emit(next)
  }

  /* Perapian `25.9.26` -> `25.09.26` ditunda sampai di sini. */
  function onBlur() {
    touched.value = true

    const parsed = parseDateInput(text.value)

    if (parsed)
      text.value = formatDateForDisplay(parsed)
  }

  return { text, touched, malformed, onInput, onBlur }
}
