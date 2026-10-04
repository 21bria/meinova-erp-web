<script setup lang="ts">
/**
 * Satu baris label–nilai.
 *
 * Nilai kosong dicetak sebagai em dash, **bukan** dibuang: baris yang
 * hilang membuat dua profil yang berbeda punya bentuk yang berbeda, dan
 * orang jadi tidak bisa tahu apakah datanya memang belum diisi atau
 * halamannya yang tidak menampilkannya.
 *
 * `null`, `undefined`, dan string kosong diperlakukan sama. Yang tidak
 * boleh pernah terjadi: kata "null" tercetak ke layar orang.
 */
const props = defineProps<{
  label: string
  value?: string | number | null
}>()

const EMPTY = '—'

const display = computed(() => {
  const value = props.value

  if (value === null || value === undefined)
    return EMPTY

  const text = String(value).trim()

  return text === '' ? EMPTY : text
})

const isEmpty = computed(() => display.value === EMPTY)
</script>

<template>
  <div class="min-w-0 space-y-1">
    <dt class="text-xs font-medium text-muted-foreground">
      {{ label }}
    </dt>

    <!--
    | `break-words` bukan hiasan: alamat dan email kerja panjang, dan di
    | layar ponsel merekalah yang pertama mendorong halaman jadi bisa
    | digeser ke samping.
    -->
    <dd
      class="text-sm break-words"
      :class="isEmpty ? 'text-muted-foreground' : 'font-medium'"
    >
      {{ display }}
    </dd>
  </div>
</template>
