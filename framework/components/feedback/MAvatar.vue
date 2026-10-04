<script setup lang="ts">
/*
|--------------------------------------------------------------------------
| MAvatar
|--------------------------------------------------------------------------
|
| Foto bulat dengan inisial sebagai cadangan. Satu komponen, dipakai
| tabel, kartu, dan header — supaya "foto tidak ada" tampil sama di
| mana pun, dan aturan cadangannya tidak disalin ke tiap layar.
|
| Tiga hal yang ditangani di sini dan tidak boleh diulang pemanggilnya:
|
|  1. gambar dipotong `object-cover`. Foto potret pada kotak bulat yang
|     diregangkan menghasilkan wajah yang gepeng, bukan gambar yang
|     "kurang rapi";
|  2. alamat `/api/...` diambil membawa token — lihat `authedImage.ts`;
|  3. gambar yang gagal dimuat jatuh ke inisial, bukan ke ikon gambar
|     rusak bawaan peramban.
|
| **Pratinjau besar (`preview`) tidak menyala sendiri.** Bawaannya mati,
| jadi seluruh pemanggil lama — baris tabel, sel identitas, kartu —
| tetap tidak bisa diklik. Yang menyalakannya hanya layar yang memang
| menampilkan foto seseorang sebagai foto: hero `/me` dan kepala Detail
| pegawai. Kotaknya `MImagePreviewDialog` yang sama dengan lampiran,
| memakai object URL yang **sudah** diambil di sini — membukanya tidak
| menambah satu permintaan pun.
*/

import { computed, ref, watch } from "vue"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { avatarInitials } from "@/utils/avatar"

import { useAuthedImage } from "../../core/composables/useAuthedImage"
import MImagePreviewDialog from "./MImagePreviewDialog.vue"

const props = withDefaults(
  defineProps<{
    /** Alamat foto. `null` / kosong langsung jatuh ke inisial. */
    src?: string | null

    /**
     * Nama yang dipakai menghitung inisial, dan jadi `alt` gambarnya.
     * Boleh dioper terpisah (`first_name`, `last_name`).
     */
    name?: string | null
    lastName?: string | null

    /**
     * Inisial dari backend (`avatar_display.initials`). Dipakai hanya
     * kalau namanya tidak ikut terkirim — baris yang fieldnya disaring
     * policy tetap punya sesuatu untuk ditampilkan.
     */
    initials?: string | null

    /** Kelas ukuran. Bawaannya 32px, setinggi baris tabel yang padat. */
    size?: string

    /**
     * Ukuran huruf inisialnya. Ikut ukuran avatar: 0.7rem pas untuk
     * 32px, tapi tenggelam di avatar kepala halaman yang lebih besar.
     */
    fallbackClass?: string

    /**
     * Foto bisa diklik untuk dilihat utuh. **Mati secara bawaan**:
     * avatar yang cuma menandai baris tidak pantas jadi tombol.
     */
    preview?: boolean

    /** Judul kotak pratinjaunya. Bawaannya nama orangnya. */
    previewTitle?: string | null
  }>(),
  {
    src: null,
    name: null,
    lastName: null,
    initials: null,
    size: "size-8",
    fallbackClass: "text-[0.7rem]",
    preview: false,
    previewTitle: null,
  },
)

const fallback = computed(() => {
  const derived = avatarInitials(
    props.name,
    props.lastName,
  )

  if (derived !== "?")
    return derived

  const given = (props.initials ?? "").trim()

  return given || "?"
})

const label = computed(() => {
  const full = [props.name, props.lastName]
    .filter(Boolean)
    .join(" ")
    .trim()

  return full || "Avatar"
})

/*
 * Alamat yang benar-benar dipasang ke `<img>`: object URL untuk yang
 * berautentikasi, alamat aslinya untuk yang statis, `null` selama
 * pengambilannya belum selesai atau gagal. Aturannya — termasuk
 * balasan terlambat yang tidak boleh menimpa alamat yang lebih baru —
 * di `authedImageSource.ts`, dipakai bersama pratinjau `MUploadField`.
 */
const { url: resolved } = useAuthedImage(() => props.src)

/*
 * Object URL yang sudah didapat tetap bisa gagal digambar. Saat itu
 * `Avatar` menampilkan inisialnya — dan avatar yang menampilkan
 * inisial tidak boleh membuka penampil gambar yang kosong.
 */
const broken = ref(false)

watch(resolved, () => {
  broken.value = false
})

function handleStatus(status: string) {
  broken.value = status === "error"
}

/**
 * Interaktif hanya kalau ketiganya benar: pratinjaunya dinyalakan,
 * alamatnya sudah didapat, dan gambarnya berhasil dimuat. Inisial —
 * karena tidak ada foto, masih diambil, atau gagal — tidak pernah bisa
 * diklik.
 */
const interactive = computed(
  () => props.preview && Boolean(resolved.value) && !broken.value,
)

const previewTitle = computed(
  () => (props.previewTitle ?? "").trim() || label.value,
)

const dialogOpen = ref(false)

function open(event?: Event) {
  if (!interactive.value)
    return

  /*
   * Avatar yang bisa diklik kerap duduk di dalam sesuatu yang juga
   * bisa diklik (baris, kartu). Membuka pratinjau tidak boleh sekaligus
   * memicu navigasi di belakangnya.
   */
  event?.stopPropagation()

  dialogOpen.value = true
}

watch(interactive, (value) => {
  if (!value)
    dialogOpen.value = false
})
</script>

<template>
  <Avatar
    class="shrink-0"
    :class="[
      props.size,
      interactive ? 'cursor-zoom-in transition hover:opacity-90' : '',
    ]"
    :role="interactive ? 'button' : undefined"
    :tabindex="interactive ? 0 : undefined"
    :aria-label="interactive ? `Preview photo of ${previewTitle}` : undefined"
    @click="open"
    @keydown.enter.prevent="open"
    @keydown.space.prevent="open"
  >
    <AvatarImage
      v-if="resolved"
      :src="resolved"
      :alt="label"
      class="object-cover"
      @loading-status-change="handleStatus"
    />

    <AvatarFallback
      class="bg-muted font-medium text-muted-foreground"
      :class="props.fallbackClass"
    >
      {{ fallback }}
    </AvatarFallback>

    <!--
    | Kotak yang sama dengan lampiran unggahan — tanpa tombol unduh:
    | ini penampil foto profil, bukan layar kelola berkas. `src` sudah
    | berupa object URL milik cache bersama, jadi membukanya tidak
    | mengambil gambarnya untuk kedua kali, dan menutupnya tidak
    | mencabut blob yang masih dipakai avatar di belakangnya.
    |
    | Ditaruh di dalam `Avatar` supaya komponen ini tetap berakar
    | tunggal — pemanggilnya mengoper `class` (mis. `ring-1`), dan akar
    | ganda membuat kelas itu hilang diam-diam. Isinya sendiri
    | di-teleport ke `body` oleh `DialogContent`.
    -->
    <MImagePreviewDialog
      v-if="interactive"
      v-model:open="dialogOpen"
      :src="resolved"
      :filename="previewTitle"
      :downloadable="false"
    />
  </Avatar>
</template>
