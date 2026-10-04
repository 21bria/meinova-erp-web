<script setup lang="ts">
import { codeLabel } from '@framework'

/**
 * Satu tempat memetakan status ke warna.
 *
 * Dipakai kotak masuk, daftar dokumen berjalan, dan jejak persetujuan.
 * Kalau tiap layar memetakan sendiri, "pending" bisa abu-abu di satu
 * tabel dan kuning di tabel sebelahnya — dan itu keluhan pertama
 * pengguna yang membandingkan dua layar.
 */
const props = withDefaults(
  defineProps<{
    status?: string | null
    label?: string | null
  }>(),
  {
    status: '',
    label: '',
  },
)

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

const VARIANTS: Record<string, BadgeVariant> = {
  approved: 'default',
  pending: 'secondary',
  draft: 'outline',
  submitted: 'secondary',
  // Dokumen yang sudah lewat meja pertama tapi belum sampai meja
  // terakhir. Diperlakukan sama dengan `pending` — dua-duanya berarti
  // "sedang berjalan", dan yang membedakannya cuma seberapa jauh.
  // Tanpa baris ini badge-nya jatuh ke `outline` dan dokumen yang
  // sedang ditinjau terlihat sama dengan draft.
  in_review: 'secondary',
  returned: 'outline',
  rejected: 'destructive',
  cancelled: 'outline',
  skipped: 'outline',
  recorded: 'default',
}

// Warna tambahan di luar variant bawaan Badge. Returned sengaja
// oranye, bukan merah: dikembalikan untuk diperbaiki bukan penolakan,
// dan menyamakan warnanya membuat pengaju mengira dokumennya mati.
const TINTS: Record<string, string> = {
  approved: 'bg-emerald-600 text-white border-transparent hover:bg-emerald-600/90',
  pending: 'bg-amber-100 text-amber-900 border-transparent dark:bg-amber-500/20 dark:text-amber-200',
  in_review: 'bg-amber-100 text-amber-900 border-transparent dark:bg-amber-500/20 dark:text-amber-200',
  returned: 'bg-orange-100 text-orange-900 border-orange-200 dark:bg-orange-500/20 dark:text-orange-200 dark:border-orange-500/30',
  skipped: 'text-muted-foreground',
  cancelled: 'text-muted-foreground',
}

const key = computed(() => String(props.status ?? '').toLowerCase())

const variant = computed<BadgeVariant>(() => VARIANTS[key.value] ?? 'outline')

const tint = computed(() => TINTS[key.value] ?? '')

/*
| Teks badge, mengikuti bahasa yang dipilih pengguna.
|
| Urutannya: katalog (`codes.status.<kode>` lalu `common.status.<kode>`)
| -> label Inggris dari API -> tebakan dari kodenya sendiri.
|
| **`status` yang dibaca, bukan `label`.** Kode itu yang stabil;
| labelnya kalimat Inggris yang boleh berubah kapan saja di backend.
| Mencocokkan lewat label berarti terjemahannya putus diam-diam begitu
| ada yang memperbaiki satu kata di sana.
|
| Warna tetap dipetakan dari `key` yang sama seperti sebelumnya —
| tidak ada satu pun cabang warna yang membaca teks hasil terjemahan.
*/
const text = computed(() => {
  // `in_review` → "In Review", bukan "In_review". Dipakai kalau
  // pemanggil tidak mengirim label sama sekali.
  const titleCased = key.value
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

  if (!key.value)
    return props.label || '—'

  return codeLabel('status', key.value, props.label || titleCased)
})
</script>

<template>
  <Badge :variant="variant" :class="tint">
    {{ text }}
  </Badge>
</template>
