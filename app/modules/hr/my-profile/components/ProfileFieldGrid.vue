<script setup lang="ts">
import type { ProfileField } from '../composables/useMyProfile'

/**
 * Grid label/nilai read-only.
 *
 * Bukan form yang dinonaktifkan. Field yang di-`disable` tetap terbaca
 * sebagai kotak isian yang "sedang tidak bisa diisi" — dan yang
 * membacanya akan mencari cara mengaktifkannya. Yang dituju di sini
 * adalah **membaca**, jadi bentuknya memang teks.
 */

const props = defineProps<{
  fields: ProfileField[]
  record: Record<string, any> | null
}>()

/**
 * Nilai siap tampil untuk satu field.
 *
 * Urutannya: `display_key` yang ditulis schema → turunan `<key>_name`
 * untuk lookup → nilai mentah. Sama persis dengan cara generator tabel
 * memilih kolom; kalau berbeda, satu nilai tampil sebagai **pk mentah**
 * di halaman ini dan sebagai nama di tabel HR.
 */
function display(field: ProfileField): string {
  const row = props.record ?? {}

  const raw
    = (field.displayKey ? row[field.displayKey] : undefined)
      ?? (field.type === 'lookup' ? row[`${field.key}_name`] : undefined)
      ?? row[field.key]

  if (raw === null || raw === undefined || raw === '')
    return '—'

  if (typeof raw === 'boolean')
    return raw ? 'Ya' : 'Tidak'

  // Objek relasi yang terlanjur ikut terkirim utuh. Tanpa ini selnya
  // berbunyi "[object Object]" — terbaca seperti data rusak, padahal
  // cuma bentuk payload yang berbeda.
  if (typeof raw === 'object')
    return String((raw as any).name ?? (raw as any).label ?? '—')

  return String(raw)
}

/**
 * Field panjang mengambil lebar penuh.
 *
 * Alamat dan catatan lazimnya dua-tiga baris; dipaksa ke satu kolom
 * sempit, keduanya terpotong jadi teks yang harus ditebak.
 */
function isWide(field: ProfileField): boolean {
  return field.type === 'textarea' || field.type === 'richtext'
}
</script>

<template>
  <dl
    class="
      grid gap-x-8 gap-y-5
      sm:grid-cols-2
      xl:grid-cols-3
    "
  >
    <div
      v-for="field in fields"
      :key="field.key"
      :class="isWide(field) ? 'sm:col-span-2 xl:col-span-3' : ''"
    >
      <dt class="text-xs text-muted-foreground">
        {{ field.label }}
      </dt>

      <dd
        class="mt-1 text-sm font-medium break-words whitespace-pre-line"
      >
        {{ display(field) }}
      </dd>
    </div>
  </dl>
</template>
