<script setup lang="ts">
import { computed, nextTick, ref } from "vue"
import type { Editor } from "@tiptap/vue-3"

import {
  Bold,
  Code2,
  Eraser,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
  Youtube,
} from "lucide-vue-next"

import { useApi } from "@/composables/useApi"

import { apiErrorMessage } from "../../core/utils/errors"
import { looksLikeYoutubeUrl } from "../../core/editor/youtubeEmbed"

const props = defineProps<{
  editor?: Editor
  disabled?: boolean
}>()

const api = useApi()

/*
 | Sisip gambar.
 |
 | Diunggah ke `apps/uploads` yang sudah ada, bukan disimpan sebagai
 | data URI di dalam isi artikel: satu tangkapan layar base64 menambah
 | ratusan kilobyte ke **setiap** permintaan yang membawa artikel itu,
 | termasuk daftar dan pencarian.
 */
const imageInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const imageError = ref("")

function pickImage() {
  imageError.value = ""
  imageInput.value?.click()
}

async function onImagePicked(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  // Nilainya dikosongkan lebih dulu supaya memilih **berkas yang sama**
  // dua kali tetap memicu `change` — kalau tidak, gagal unggah sekali
  // berarti berkas itu tidak bisa dicoba lagi tanpa memilih yang lain.
  input.value = ""

  if (!file || !props.editor)
    return

  uploading.value = true
  imageError.value = ""

  try {
    const formData = new FormData()
    formData.append("file", file, file.name)

    // `category` menentukan folder tujuannya di backend
    // (`uploads/<schema>/content/…`), bukan sekadar label. Gambar yang
    // tertanam di dalam tulisan tidak boleh berjejer dengan scan KTP dan
    // lampiran dokumen: media disajikan tanpa autentikasi, jadi selama
    // semuanya satu folder tidak ada batas yang bisa ditunjuk aturan
    // server mana pun.
    //
    // `content`, bukan `help-article`: komponen ini dipakai field
    // richtext mana pun, dan yang membedakan berkasnya adalah cara ia
    // dipakai — bukan modul yang kebetulan memuatnya.
    formData.append("metadata", JSON.stringify({ category: "content" }))

    const res: any = await api.request("/api/uploads/", {
      method: "POST",
      body: formData,
    })

    const payload = res?.data ?? res
    const url: string = payload?.file_url ?? payload?.url ?? ""

    if (!url)
      throw new Error("Respons unggah tidak memuat URL berkas.")

    // URL absolut dari endpoint unggah dipakai apa adanya. Sempat
    // diperkecil jadi relatif di sini demi portabilitas antar
    // lingkungan, dan itu **salah**: frontend beda origin dari
    // backend, jadi `/media/x.png` diselesaikan terhadap Nuxt dan
    // gambarnya langsung tampil sebagai ikon pecah.
    //
    // Portabilitasnya tetap terjaga, cuma di tempat yang benar:
    // `normalize_image_src` di backend menyimpannya sebagai jalur
    // relatif, dan `absolutize_media` mengembalikannya jadi absolut
    // saat isi artikel dikirim ke sini.
    props.editor
      .chain()
      .focus()
      .setImage({ src: url, alt: file.name })
      .run()
  }
  catch (error: any) {
    imageError.value = apiErrorMessage(error, "Gambar gagal diunggah.")
  }
  finally {
    uploading.value = false
  }
}

/*
 | Ukuran gambar.
 |
 | Tangkapan layar datang dalam ukuran apa saja — layar penuh 2560px
 | maupun potongan satu tombol. `max-width: 100%` saja membuat yang
 | pertama benar dan yang kedua tampil sebesar aslinya di tengah
 | paragraf; di layar retina, potongan tombol itu tergambar dua kali
 | lebih besar daripada tombol aslinya.
 |
 | Lebarnya disimpan sebagai atribut `width` pada `<img>` (sanitizer
 | sudah mengizinkannya), bukan kelas CSS: kelas berarti daftar nama
 | yang harus dijaga sama di editor dan di halaman baca.
 */
const IMAGE_WIDTHS = [
  { label: "Kecil", value: 320 },
  { label: "Sedang", value: 560 },
  { label: "Penuh", value: null },
]

function setImageWidth(width: number | null) {
  props.editor
    ?.chain()
    .focus()
    .updateAttributes("image", { width })
    .run()
}

function isImageWidth(width: number | null) {
  const current = props.editor?.getAttributes("image")?.width ?? null

  return (current ? Number(current) : null) === width
}

// Isian URL video dibuka sebagai baris di bawah toolbar, bukan
// `prompt()` bawaan browser: dialog bawaan tidak bisa ditata, tidak
// ikut tema gelap, dan pesan salahnya cuma bisa lewat `alert()` kedua
// yang menutup seluruh layar. Barisnya juga membuat URL yang salah
// ketik tetap terlihat sehingga bisa dibetulkan, bukan diketik ulang.
const videoOpen = ref(false)
const videoUrl = ref("")
const videoError = ref("")
const videoInput = ref<HTMLInputElement | null>(null)

async function toggleVideoInput() {
  videoOpen.value = !videoOpen.value
  videoError.value = ""

  if (!videoOpen.value)
    return

  await nextTick()
  videoInput.value?.focus()
}

function insertYoutube() {
  const editor = props.editor
  const url = videoUrl.value.trim()

  if (!editor || !url)
    return

  // Diperiksa di sini supaya penulisnya tahu **sekarang**, bukan
  // setelah menekan Save: backend membuang `src` yang bukan YouTube
  // tanpa mengeluh, jadi videonya hilang diam-diam dari isi tersimpan.
  if (!looksLikeYoutubeUrl(url)) {
    videoError.value
      = "Bukan URL video YouTube. Yang diterima: youtube.com/watch, "
        + "youtu.be, /embed/, atau /shorts/."

    return
  }

  ;(editor.chain().focus() as any).setYoutubeVideo(url).run()

  videoUrl.value = ""
  videoError.value = ""
  videoOpen.value = false
}

function buttonClass(active = false) {
  return [
    "inline-flex size-8 items-center justify-center rounded-md",
    "transition-colors hover:bg-muted",
    "disabled:pointer-events-none disabled:opacity-40",
    active
      ? "bg-muted text-foreground"
      : "text-muted-foreground",
  ]
}

const heading = computed(() => {
  const editor = props.editor

  if (!editor)
    return "paragraph"

  if (editor.isActive("heading", { level: 1 }))
    return "h1"

  if (editor.isActive("heading", { level: 2 }))
    return "h2"

  if (editor.isActive("heading", { level: 3 }))
    return "h3"

  return "paragraph"
})

function setHeading(event: Event) {
  const editor = props.editor

  if (!editor)
    return

  const target = event.target as HTMLSelectElement
  const value = target.value

  if (value === "paragraph") {
    editor
      .chain()
      .focus()
      .setParagraph()
      .run()

    return
  }

  const level = Number(
    value.replace("h", ""),
  ) as 1 | 2 | 3

  editor
    .chain()
    .focus()
    .toggleHeading({ level })
    .run()
}
</script>

<template>
  <div v-if="editor" class="flex flex-wrap items-center gap-1 border-b bg-muted/30 p-2">
    <button type="button" :class="buttonClass()" :disabled="disabled
      || !editor.can().chain().focus().undo().run()
      " title="Undo" @click="editor.chain().focus().undo().run()">
      <Undo2 class="size-4" />
    </button>

    <button type="button" :class="buttonClass()" :disabled="disabled
      || !editor.can().chain().focus().redo().run()
      " title="Redo" @click="editor.chain().focus().redo().run()">
      <Redo2 class="size-4" />
    </button>

    <div class="mx-1 h-5 w-px bg-border" />

    <select class="
        h-8 rounded-md border border-input
        bg-background px-2 text-sm outline-none
        disabled:cursor-not-allowed disabled:opacity-50
      " :disabled="disabled" :value="heading" @change="setHeading">
      <option value="paragraph">
        Paragraph
      </option>

      <option value="h1">
        Heading 1
      </option>

      <option value="h2">
        Heading 2
      </option>

      <option value="h3">
        Heading 3
      </option>
    </select>

    <div class="mx-1 h-5 w-px bg-border" />

    <button type="button" :class="buttonClass(editor.isActive('bold'))" :disabled="disabled" title="Bold"
      @click="editor.chain().focus().toggleBold().run()">
      <Bold class="size-4" />
    </button>

    <button type="button" :class="buttonClass(editor.isActive('italic'))" :disabled="disabled" title="Italic"
      @click="editor.chain().focus().toggleItalic().run()">
      <Italic class="size-4" />
    </button>

    <button type="button" :class="buttonClass(editor.isActive('underline'))" :disabled="disabled" title="Underline"
      @click="editor.chain().focus().toggleUnderline().run()">
      <Underline class="size-4" />
    </button>

    <button type="button" :class="buttonClass(editor.isActive('strike'))" :disabled="disabled" title="Strikethrough"
      @click="editor.chain().focus().toggleStrike().run()">
      <Strikethrough class="size-4" />
    </button>

    <div class="mx-1 h-5 w-px bg-border" />

    <button type="button" :class="buttonClass(editor.isActive('bulletList'))" :disabled="disabled" title="Bullet list"
      @click="
        editor
          .chain()
          .focus()
          .toggleBulletList()
          .run()
        ">
      <List class="size-4" />
    </button>

    <button type="button" :class="buttonClass(editor.isActive('orderedList'))" :disabled="disabled"
      title="Numbered list" @click="
        editor
          .chain()
          .focus()
          .toggleOrderedList()
          .run()
        ">
      <ListOrdered class="size-4" />
    </button>

    <button type="button" :class="buttonClass(editor.isActive('blockquote'))" :disabled="disabled" title="Quote" @click="
      editor
        .chain()
        .focus()
        .toggleBlockquote()
        .run()
      ">
      <Quote class="size-4" />
    </button>

    <button type="button" :class="buttonClass(editor.isActive('codeBlock'))" :disabled="disabled" title="Code block"
      @click="
        editor
          .chain()
          .focus()
          .toggleCodeBlock()
          .run()
        ">
      <Code2 class="size-4" />
    </button>

    <div class="mx-1 h-5 w-px bg-border" />

    <button
      type="button"
      :class="buttonClass(editor.isActive('image'))"
      :disabled="disabled || uploading"
      title="Sisipkan gambar"
      @click="pickImage"
    >
      <Loader2 v-if="uploading" class="size-4 animate-spin" />
      <ImagePlus v-else class="size-4" />
    </button>

    <input
      ref="imageInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onImagePicked"
    >

    <button
      type="button"
      :class="buttonClass(videoOpen || editor.isActive('youtubeEmbed'))"
      :disabled="disabled"
      title="Sisipkan video YouTube"
      @click="toggleVideoInput"
    >
      <Youtube class="size-4" />
    </button>

    <div class="mx-1 h-5 w-px bg-border" />

    <button type="button" :class="buttonClass()" :disabled="disabled" title="Clear formatting" @click="
      editor
        .chain()
        .focus()
        .clearNodes()
        .unsetAllMarks()
        .run()
      ">
      <Eraser class="size-4" />
    </button>

    <!--
      Baris isian URL. Lebarnya penuh (`basis-full`) supaya ia turun
      ke baris sendiri di bawah tombol-tombol, bukan menyempil di
      antaranya dan mendorong separuh toolbar keluar layar.
    -->
    <div v-if="videoOpen" class="mt-2 basis-full">
      <div class="flex gap-2">
        <input
          ref="videoInput"
          v-model="videoUrl"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          class="
            h-8 flex-1 rounded-md border border-input bg-background
            px-2 text-sm outline-none
            focus:border-ring focus:ring-2 focus:ring-ring/20
          "
          @keydown.enter.prevent="insertYoutube"
          @keydown.esc="videoOpen = false"
        >

        <button
          type="button"
          class="
            h-8 rounded-md bg-primary px-3 text-sm font-medium
            text-primary-foreground transition-opacity
            hover:opacity-90 disabled:opacity-40
          "
          :disabled="!videoUrl.trim()"
          @click="insertYoutube"
        >
          Sisipkan
        </button>
      </div>

      <p v-if="videoError" class="mt-1 text-xs text-destructive">
        {{ videoError }}
      </p>
    </div>

    <!--
      Ukuran gambar. Muncul hanya saat sebuah gambar sedang dipilih —
      tombol ukuran yang selalu tampil membuat orang menekannya tanpa
      memilih apa pun lalu menyimpulkan fiturnya rusak.
    -->
    <div
      v-if="editor.isActive('image')"
      class="mt-2 flex basis-full items-center gap-2"
    >
      <span class="text-xs text-muted-foreground">Ukuran gambar</span>

      <button
        v-for="option in IMAGE_WIDTHS"
        :key="option.label"
        type="button"
        class="h-7 rounded-md px-2 text-xs transition-colors"
        :class="isImageWidth(option.value)
          ? 'bg-muted font-medium text-foreground'
          : 'text-muted-foreground hover:bg-muted'"
        :disabled="disabled"
        @click="setImageWidth(option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <!--
      Kegagalan unggah ditempel di sini, bukan lewat toast: yang
      mengunggah sedang menulis artikel dan matanya di editor, dan
      toast yang hilang dalam empat detik membuat gambar yang tidak
      muncul terbaca seperti editor yang rusak.
    -->
    <p v-if="imageError" class="mt-2 basis-full text-xs text-destructive">
      {{ imageError }}
    </p>
  </div>
</template>