<script setup lang="ts">
/*
|--------------------------------------------------------------------------
| MImagePreviewDialog
|--------------------------------------------------------------------------
|
| Pratinjau gambar di dalam aplikasi — tab baru tidak dibuka sama
| sekali. Membuka tab untuk melihat satu lampiran berarti meninggalkan
| formulir yang sedang diisi; yang kembali kemudian adalah halaman yang
| dimuat ulang, dan isian yang belum disimpan ikut hilang.
|
| **Alamat gambarnya tidak dirakit di sini.** Yang dioper `src` sudah
| berupa object URL milik cache `authedImage.ts` — hasil pengambilan
| bertoken yang sama dengan thumbnail-nya. Dua akibatnya disengaja:
| membuka kotak ini **tidak** mengunduh ulang gambar yang sudah ada, dan
| `blob:` itu **tidak** dicabut saat kotaknya ditutup — ia masih dipakai
| thumbnail di belakang kotak, dan mungkin baris lain.
|
| Escape, klik overlay, dan tombol X ditangani `DialogContent`
| (reka-ui), jadi perilakunya sama dengan dialog lain di aplikasi ini.
*/

import { Download, ImageOff, Loader2 } from "lucide-vue-next"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const props = withDefaults(
  defineProps<{
    /** Object URL gambar yang sudah diambil. */
    src?: string | null
    /** Nama berkas aslinya, dicetak di kepala kotak. */
    filename?: string | null
    /** Sedang diambil — pemutar, bukan gambar rusak. */
    loading?: boolean
    /** Gagal diambil — kalimat, bukan ikon rusak bawaan peramban. */
    failed?: boolean
    /** Tampilkan tombol unduh. */
    downloadable?: boolean
  }>(),
  {
    src: null,
    filename: null,
    loading: false,
    failed: false,
    downloadable: true,
  },
)

const emit = defineEmits<{
  download: []
}>()

const open = defineModel<boolean>("open", { default: false })

const title = computed(() => props.filename?.trim() || "Image")

/*
 * Gambar yang gagal dimuat **sesudah** alamatnya didapat (blob rusak)
 * jatuh ke keadaan yang sama dengan gagal diambil.
 */
const broken = ref(false)

watch(
  () => props.src,
  () => {
    broken.value = false
  },
)

const showImage = computed(
  () => Boolean(props.src) && !broken.value && !props.failed,
)

const showError = computed(
  () => !showImage.value && (props.failed || broken.value),
)
</script>

<template>
  <Dialog v-model:open="open">
    <!--
    | Lebar: 90vw sampai 940px di desktop, hampir selebar layar di
    | ponsel dengan sisa margin yang aman. `p-0` supaya gambarnya yang
    | jadi isi kotak, bukan padding.
    |
    | Batas desktopnya sengaja **di bawah** lebar layar: pratinjau yang
    | memenuhi layar terbaca sebagai halaman baru, bukan sebagai kotak
    | yang sedang menimpa halaman yang masih ada di belakangnya.
    -->
    <DialogContent
      class="
        max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden p-0
        sm:max-w-[min(940px,90vw)]
      "
    >
      <DialogHeader class="border-b px-4 py-3 pr-12 text-left">
        <DialogTitle class="truncate text-sm font-medium">
          {{ title }}
        </DialogTitle>

        <DialogDescription class="sr-only">
          Image preview
        </DialogDescription>
      </DialogHeader>

      <!--
      | Permukaan gelap netral: foto potret, gambar berlatar transparan,
      | dan gambar terang sama-sama tetap terbaca batasnya di sini.
      -->
      <div
        class="
          flex max-h-[75vh] min-h-48 items-center justify-center
          overflow-hidden bg-neutral-900 p-3
          sm:max-h-[78vh] sm:p-4
        "
      >
        <!--
        | Hanya batas atas — tanpa `w-full`/`h-full`. Gambar kecil tampil
        | seukuran aslinya; yang besar mengecil utuh.
        -->
        <img
          v-if="showImage"
          :src="src!"
          :alt="title"
          class="
            h-auto max-h-[calc(75vh-2rem)] w-auto max-w-full object-contain
            sm:max-h-[calc(78vh-2rem)]
          "
          @error="broken = true"
        >

        <div
          v-else-if="loading && !showError"
          class="flex flex-col items-center gap-2 py-12 text-neutral-400"
        >
          <Loader2 class="size-6 animate-spin" />

          <span class="text-xs">Loading image...</span>
        </div>

        <div
          v-else
          class="flex flex-col items-center gap-2 py-12 text-neutral-400"
        >
          <ImageOff class="size-6" />

          <span class="text-xs">Image could not be loaded.</span>
        </div>
      </div>

      <div
        v-if="downloadable"
        class="flex justify-end border-t px-4 py-3"
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          @click="emit('download')"
        >
          <Download class="mr-2 size-4" />
          Download
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
