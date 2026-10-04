<script setup lang="ts">
/*
|--------------------------------------------------------------------------
| MIdentityCell
|--------------------------------------------------------------------------
|
| Satu sel tabel untuk identitas: foto, nama, dan satu baris keterangan
| di bawahnya (nomor pegawai, NIP, kode — apa pun yang menegaskan
| "orang yang mana").
|
| Menggantikan tiga kolom terpisah (nomor, nama depan, nama belakang)
| dengan satu kolom yang lebih cepat dipindai mata, tanpa menambah
| tinggi baris: fotonya 32px, persis setinggi dua baris teks yang sudah
| ada di sel lain.
*/

import MAvatar from "../feedback/MAvatar.vue"

const props = withDefaults(
  defineProps<{
    /** Baris pertama, teks yang dominan. */
    title?: string | null

    /** Baris kedua, lebih kecil dan redup. */
    caption?: string | null

    /** Alamat foto. Kosong berarti inisial. */
    src?: string | null

    /** Inisial dari backend, dipakai kalau namanya tidak terkirim. */
    initials?: string | null
  }>(),
  {
    title: null,
    caption: null,
    src: null,
    initials: null,
  },
)
</script>

<template>
  <div class="flex items-center gap-2.5">
    <MAvatar
      :src="props.src"
      :name="props.title"
      :initials="props.initials"
    />

    <div class="flex min-w-0 flex-col leading-tight">
      <span
        class="
          truncate text-sm font-medium
          text-foreground
        "
      >
        {{ props.title || "-" }}
      </span>

      <span
        v-if="props.caption"
        class="
          truncate text-xs
          text-muted-foreground
        "
      >
        {{ props.caption }}
      </span>
    </div>
  </div>
</template>
