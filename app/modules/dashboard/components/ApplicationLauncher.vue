<script setup lang="ts">
import type { FavoriteApplication } from '../types'
/**
 * Application Launcher: seluruh aplikasi yang boleh dibuka pengguna,
 * sebagai ubin ikon dalam **satu** panel.
 *
 * Menggantikan kartu besar berdeskripsi yang dulu ada di sini (tiga
 * kartu selebar sepertiga layar, masing-masing berjudul, berparagraf,
 * dan bergradien). Yang dibaca orang setiap pagi dari bagian ini cuma
 * satu hal — aplikasi apa yang tersedia — dan paragraf di bawah tiap
 * nama tidak pernah menjawabnya.
 *
 * **Daftarnya tidak ditulis di sini.** Isinya datang dari katalog
 * backend yang sudah tersaring hak akses (`FavoriteAppService`), lewat
 * `useDashboard`. Menambah modul = satu baris di `APP_CATALOG`, bukan
 * di berkas ini.
 */
import { Star } from 'lucide-vue-next'

import draggable from 'vuedraggable'

import ApplicationLauncherItem from './ApplicationLauncherItem.vue'

const props = defineProps<{
  items: FavoriteApplication[]
  isCustomizing?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:items': [value: FavoriteApplication[]]
  'toggle-favorite': [code: string]
}>()

const localItems = computed({
  get: () => props.items,
  set: value => emit('update:items', value),
})

/*
 * Kolomnya dihitung dari lebar yang tersedia, bukan dari titik henti
 * layar: panel ini duduk di kolom kiri yang lebarnya berubah karena
 * dua hal sekaligus — ukuran jendela **dan** sidebar aplikasi yang
 * bisa dilipat. Jumlah kolom per breakpoint yang ditulis tangan selalu
 * meleset di salah satu kombinasinya.
 *
 * **`auto-fit`, bukan `auto-fill`** — dan ini bukan detail. Keduanya
 * membuat jumlah track yang sama persis (sebanyak yang muat pada lebar
 * minimum), tapi `auto-fill` **mempertahankan track yang tidak berisi
 * apa-apa**. Dengan lima aplikasi di panel selebar 814px, keenam track
 * tetap dibuat dan yang keenam berdiri kosong di kanan — Reports
 * berhenti satu kolom penuh sebelum tepi panel, dan yang terlihat
 * adalah slot yang seperti gagal dimuat. `auto-fit` meruntuhkan track
 * kosong itu, lalu sisa ruangnya dibagi rata ke lima yang benar-benar
 * berisi.
 *
 * Batas atasnya **wajib `1fr`, bukan panjang tetap**. Jumlah
 * pengulangan dihitung browser dari sisi **maksimum** track kalau
 * ukuran itu pasti: `minmax(7rem,12rem)` menghasilkan empat track
 * selebar 192px di panel 814px — lima aplikasi jadi membungkus ke dua
 * baris, dan di ponsel satu track 192px berdiri di ruang 292px
 * sehingga kelimanya menumpuk ke bawah. `1fr` tidak pasti, jadi yang
 * dipakai menghitung adalah sisi minimumnya, dan track yang tersisa
 * membagi rata seluruh lebar panel.
 *
 * Lebar minimum turun sedikit di pita `lg` (1024–1279px), dan itu satu-
 * satunya tempat angkanya berbeda. Di situ kolom kiri tinggal ~542px
 * karena kolom utility memakan 320px: pada minimum 7rem hanya empat
 * track yang muat, dan aplikasi kelima berdiri sendirian di baris
 * kedua. Pada 6rem kelimanya kembali satu baris (~99px per track), dan
 * label ikut mengecil satu tingkat di pita yang sama supaya nama
 * terpanjang tetap utuh, bukan terpotong.
 *
 * Tidak ada angka lima di mana pun: enam aplikasi besok mendapat enam
 * kolom, dan yang lebih banyak membungkus ke baris berikutnya.
 */
const GRID_CLASS = 'grid justify-center gap-x-2 gap-y-6 [grid-template-columns:repeat(auto-fit,minmax(5.75rem,1fr))] sm:gap-x-3 sm:[grid-template-columns:repeat(auto-fit,minmax(7rem,1fr))] lg:gap-x-2 lg:[grid-template-columns:repeat(auto-fit,minmax(6rem,1fr))] xl:gap-x-3 xl:[grid-template-columns:repeat(auto-fit,minmax(7rem,1fr))]'
</script>

<template>
  <!--
    `data-slot` mengikuti konvensi komponen UI proyek ini, dan dipakai
    UAT browser (`scripts/uat/home-launcher.mjs`) untuk menemukan panel
    ini. Pemeriksaan yang menempel pada kelas CSS gagal tiap kali
    tampilannya disetel — yaitu karena hal yang bukan perilaku.
  -->
  <section
    data-slot="application-launcher"
    class="rounded-xl border bg-card px-4 py-4 shadow-sm sm:px-5 sm:py-5"
  >
    <div class="mb-4 flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h2 class="text-sm font-semibold">
          {{ $t('home.launcher.title') }}
        </h2>

        <p class="mt-0.5 truncate text-xs text-muted-foreground">
          {{
            isCustomizing
              ? $t('home.launcher.customizeHint')
              : $t('home.launcher.subtitle')
          }}
        </p>
      </div>
    </div>

    <!--
      Kerangka saat memuat, bukan panel kosong: beranda adalah halaman
      pertama yang dibuka tiap pagi, dan kotak kosong selama satu
      request terbaca seperti akun yang kehilangan seluruh aplikasinya.
    -->
    <div v-if="loading && !items.length" :class="GRID_CLASS">
      <div
        v-for="index in 6"
        :key="index"
        class="flex flex-col items-center gap-2 px-1 py-2"
      >
        <Skeleton class="size-16 rounded-[1.35rem] sm:size-18" />
        <Skeleton class="h-3.5 w-16" />
      </div>
    </div>

    <!--
      Saat menyusun ubinnya bisa diseret **dan** bisa dipilih lewat
      bintang. Keduanya di ubin yang sama: pegangan seret terpisah
      seukuran 16px di sebelah ikon 52px lebih sering meleset daripada
      kena.
    -->
    <draggable
      v-else-if="isCustomizing"
      v-model="localItems"
      item-key="code"
      :class="GRID_CLASS"
      ghost-class="opacity-40"
    >
      <template #item="{ element: app }">
        <div class="relative">
          <ApplicationLauncherItem :app="app" is-customizing />

          <!--
            Bintang hanya untuk modul yang benar-benar bisa dibuka.
            Modul yang kelabu tidak punya keadaan "dipilih" — memberinya
            bintang berarti pengguna bisa menyimpan pintasan ke pintu
            yang tidak akan pernah terbuka untuknya, dan backend
            (`get_favorites`) menyaringnya kembali tanpa ada satu pun
            pesan yang menjelaskan ke mana pilihannya pergi.
          -->
          <button
            v-if="app.accessible !== false && app.available !== false"
            type="button"
            class="absolute right-0 top-0 rounded-full border bg-background/90 p-1 text-muted-foreground shadow-sm transition-colors hover:text-foreground"
            :aria-label="
              app.favorite
                ? $t('home.launcher.inWorkspace')
                : $t('home.launcher.notInWorkspace')
            "
            @click="emit('toggle-favorite', app.code)"
          >
            <Star
              class="size-3.5"
              :class="app.favorite ? 'fill-current text-yellow-500' : ''"
            />
          </button>
        </div>
      </template>
    </draggable>

    <div v-else-if="items.length" :class="GRID_CLASS">
      <ApplicationLauncherItem
        v-for="app in items"
        :key="app.code"
        :app="app"
      />
    </div>

    <!--
      Kosong itu keadaan yang sah: pengguna yang menu modulnya
      disembunyikan seluruhnya memang tidak punya satu pun aplikasi di
      sini. Panel putih tanpa keterangan terbaca seperti gagal memuat.
    -->
    <p v-else class="py-8 text-center text-sm text-muted-foreground">
      {{ $t('home.launcher.empty') }}
    </p>
  </section>
</template>
