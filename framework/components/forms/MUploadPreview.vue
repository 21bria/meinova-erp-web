<script setup lang="ts">
/*
|--------------------------------------------------------------------------
| MUploadPreview
|--------------------------------------------------------------------------
|
| Kotak pratinjau satu berkas di `MUploadField`, berikut lightbox-nya.
|
| Gambar diambil lewat `useAuthedImage` — alamat `preview/` menuntut
| token, dan `<img>` tidak pernah membawanya. Selama pengambilan
| berjalan, atau kalau gagal, yang tampil ikon berkasnya: tidak pernah
| ikon gambar rusak bawaan peramban.
|
| **Berkas gambar bisa diklik** dan membuka `MImagePreviewDialog` di
| dalam aplikasi. Object URL-nya yang sudah ada dioper apa adanya, jadi
| membuka kotaknya tidak mengunduh apa pun untuk kedua kalinya — dan
| tidak ada yang dicabut saat ditutup, karena blob-nya milik cache
| bersama yang masih dipakai thumbnail ini.
|
| Berkas **bukan gambar** tidak punya lightbox: memaksa PDF masuk
| penampil gambar menghasilkan kotak kosong yang terbaca sebagai
| kerusakan. Jalurnya tetap `MUploadField` (tab baru / unduh).
*/

import type { UploadPreviewDetail } from "../../core/utils/uploadPreview"

import {
  FileText,
  Image as ImageIcon,
  Loader2,
} from "lucide-vue-next"

import { computed, ref, watch } from "vue"

import { useAuthedImage } from "../../core/composables/useAuthedImage"
import {
  imagePreviewState,
  imagePreviewTitle,
  isPreviewableImage,
} from "../../core/utils/imagePreview"
import { uploadPreviewSource } from "../../core/utils/uploadPreview"
import MImagePreviewDialog from "../feedback/MImagePreviewDialog.vue"

const props = withDefaults(
  defineProps<{
    detail: UploadPreviewDetail & { original_name?: string | null }
    imageMode?: boolean
    /** Kelas ukuran kotaknya. */
    size?: string
  }>(),
  {
    imageMode: false,
    size: "size-10 rounded-md",
  },
)

const emit = defineEmits<{
  download: []
}>()

const source = computed(
  () => uploadPreviewSource(props.detail, props.imageMode),
)

const { url: resolved, pending, failed } = useAuthedImage(source)

/*
 * Object URL yang sudah didapat tetap bisa gagal digambar (berkas yang
 * rusak isinya). Jatuh ke ikon, sama seperti yang gagal diambil.
 */
const broken = ref(false)

watch(resolved, () => {
  broken.value = false
})

const icon = computed(
  () => (source.value || props.imageMode ? ImageIcon : FileText),
)

/** Hanya gambar yang punya lightbox. */
const previewable = computed(
  () => isPreviewableImage(props.detail, props.imageMode),
)

const state = computed(() => imagePreviewState({
  detail: props.detail,
  imageMode: props.imageMode,
  url: resolved.value,
  pending: pending.value,
  failed: failed.value || broken.value,
}))

const title = computed(() => imagePreviewTitle(props.detail))

const dialogOpen = ref(false)

function open() {
  if (!previewable.value)
    return

  dialogOpen.value = true
}

defineExpose({ open, previewable })
</script>

<template>
  <div
    class="
      flex shrink-0 items-center justify-center
      overflow-hidden bg-muted
    "
    :class="[
      props.size,
      previewable
        ? 'cursor-zoom-in transition hover:opacity-90'
        : '',
    ]"
    :role="previewable ? 'button' : undefined"
    :tabindex="previewable ? 0 : undefined"
    :aria-label="previewable ? `Preview ${title}` : undefined"
    @click.stop="open"
    @keydown.enter.prevent="open"
    @keydown.space.prevent="open"
  >
    <img
      v-if="resolved && !broken"
      :src="resolved"
      :alt="title"
      class="size-full object-cover"
      @error="broken = true"
    >

    <Loader2
      v-else-if="pending"
      class="size-5 animate-spin text-muted-foreground"
    />

    <component
      :is="icon"
      v-else
      class="size-5 text-muted-foreground"
    />
  </div>

  <MImagePreviewDialog
    v-if="previewable"
    v-model:open="dialogOpen"
    :src="resolved"
    :filename="title"
    :loading="state === 'loading'"
    :failed="state === 'error'"
    @download="emit('download')"
  />
</template>
