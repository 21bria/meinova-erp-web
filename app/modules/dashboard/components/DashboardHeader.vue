<script setup lang="ts">
/**
 * Kepala beranda: sapaan, tanggal, dan sorotan hari ini.
 *
 * Dulu tiga baris teks abu-abu dengan judul yang sama persis setiap
 * hari — "Meinova ERP Workspace / Manage people, operations, supply
 * chain, and finance in one platform." Kalimat itu menjelaskan
 * produknya kepada orang yang sudah memakainya setiap pagi, jadi
 * diganti sapaan bernama dan sorotan yang memang berubah tiap hari.
 *
 * Gradiennya di kepala saja, bukan di seluruh halaman: kartu data di
 * bawahnya harus tetap terbaca, dan latar berwarna di belakang angka
 * adalah cara tercepat membuatnya tidak terbaca.
 */
import { Award, Cake, PartyPopper } from 'lucide-vue-next'

import type { DashboardHighlight } from '../types'

const props = withDefaults(
  defineProps<{
    highlights?: DashboardHighlight[]
  }>(),
  { highlights: () => [] },
)

const auth = useAuthStore()

const today = new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

/**
 * Sapaan mengikuti jam **perangkat pengguna**, bukan jam server.
 *
 * Tenant ini dipakai lintas zona waktu (Jakarta dan Halmahera beda
 * satu jam); "Selamat pagi" jam sembilan malam adalah kesalahan yang
 * langsung terlihat, dan menghitungnya di backend membuat setiap
 * penggunanya bergantung pada zona waktu server.
 */
const greeting = computed(() => {
  const hour = new Date().getHours()

  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 19) return 'Selamat sore'

  return 'Selamat malam'
})

// Nama depan saja. "Selamat pagi, Muhammad Reza Aditya Pratama" memakan
// satu baris penuh dan tidak terdengar seperti sapaan.
const displayName = computed(() => {
  const name =
    auth.user?.display_name
    || auth.user?.full_name
    || auth.user?.username
    || ''

  return name.split(' ')[0] ?? ''
})

const HIGHLIGHT_ICONS: Record<string, unknown> = {
  birthday: Cake,
  work_anniversary: Award,
  holiday: PartyPopper,
}

function iconFor(kind: string) {
  return HIGHLIGHT_ICONS[kind] ?? Cake
}

/**
 * Dipisah dua sisi, dan pembedanya **milik siapa**.
 *
 * Ulang tahun dan ulang tahun kerja menempel pada satu orang; hari
 * libur berlaku untuk semua. Menumpuknya dalam satu baris membuat
 * "17 Agustus" terbaca seperti nama orang berikutnya di daftar.
 */
const personalHighlights = computed(() =>
  props.highlights.filter(item => item.kind !== 'holiday'),
)

const holidayHighlights = computed(() =>
  props.highlights.filter(item => item.kind === 'holiday'),
)

/*
 * Kalau yang berulang tahun lebih dari satu, ditampilkan bergantian.
 *
 * Berjejer semuanya membuat kepala halaman melebar sampai menabrak
 * tombol Customize di hari yang ramai, dan memotongnya jadi "+3
 * lainnya" berarti tiga orang yang namanya tidak pernah muncul. Diputar
 * pelan (5 detik) supaya semuanya kebagian, dengan titik penanda yang
 * bisa ditekan untuk melompat.
 */
const activeIndex = ref(0)

let rotation: ReturnType<typeof setInterval> | null = null

function stopRotation() {
  if (rotation) {
    clearInterval(rotation)
    rotation = null
  }
}

function startRotation() {
  stopRotation()

  if (personalHighlights.value.length < 2) return

  rotation = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % personalHighlights.value.length
  }, 5000)
}

function goTo(index: number) {
  activeIndex.value = index

  // Diputar ulang dari nol setelah ditekan: kalau tidak, kartu yang
  // baru saja dipilih bisa berganti setengah detik kemudian.
  startRotation()
}

// Hanya di klien. `setInterval` saat SSR tidak pernah dibersihkan dan
// menahan proses render tetap hidup.
onMounted(startRotation)
onBeforeUnmount(stopRotation)

// Daftarnya datang setelah render pertama (`/auth/me` dan `summary/`
// berjalan bersamaan), jadi pemutarnya harus dinyalakan ulang begitu
// isinya berubah — dan indeksnya dikembalikan ke nol supaya tidak
// menunjuk baris yang sudah tidak ada.
watch(personalHighlights, () => {
  activeIndex.value = 0
  startRotation()
})

const activeHighlight = computed(
  () => personalHighlights.value[activeIndex.value] ?? null,
)

/**
 * Di hari biasa daftarnya kosong dan seluruh bagian ini hilang.
 *
 * Baris yang 360 hari setahun berbunyi "tidak ada apa-apa hari ini"
 * hanya melatih orang untuk berhenti membacanya — dan pada hari yang
 * benar-benar ada isinya, mereka sudah tidak melihat ke sana.
 */
const hasHighlights = computed(() => props.highlights.length > 0)
</script>

<template>
  <!--
    Latar kepala beranda: biru sangat lembut di kiri, es/cyan di
    tengah, mint di kanan — kira-kira #EFF6FF → #ECFEFF → #ECFDF5.

    Ditulis sebagai **tint beropasitas rendah di atas `bg-card`**, bukan
    warna `-50` yang pekat: `bg-card` yang menentukan terang-gelapnya,
    jadi satu deklarasi ini benar di tema terang **dan** gelap. Warna
    `from-blue-50` yang dipatok mati akan menyala putih di tema gelap,
    dan teks gelap di atasnya berhenti terbaca.

    Keduanya properti yang berbeda (`background-color` vs
    `background-image`), jadi `bg-card` dan `bg-linear-to-r` memang
    boleh berdiri berdampingan — bukan dua kelas yang saling menimpa.

    Sebelumnya `from-primary/10 via-background`: `--primary` di tema ini
    nyaris hitam, jadi yang keluar abu-abu kecokelatan — bukan warna,
    cuma kotor.
  -->
  <section
    class="relative overflow-hidden rounded-2xl border bg-card bg-linear-to-r from-blue-500/5 via-cyan-400/4 to-emerald-400/5 p-5 sm:p-6 dark:from-blue-500/10 dark:via-cyan-400/8 dark:to-emerald-400/8"
  >
    <!--
      Tiga lingkaran kabur: tanpa ini latarnya terbaca sebagai gradien
      linear datar, dan sapuan warnanya berhenti tepat di garis lurus
      yang sama di setiap layar.

      `pointer-events-none` wajib: tanpa itu ketiganya menutupi tombol
      Sesuaikan di kanan atas, dan tombolnya tidak bisa ditekan tanpa
      satu pun petunjuk kenapa.
    -->
    <div
      class="pointer-events-none absolute -left-24 -top-28 size-72 rounded-full bg-blue-500/5 blur-3xl"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -top-24 left-1/3 size-64 rounded-full bg-cyan-400/7 blur-3xl"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -bottom-28 -right-16 size-64 rounded-full bg-emerald-400/5 blur-3xl"
      aria-hidden="true"
    />

    <div class="relative flex flex-col justify-between gap-4 md:flex-row md:items-start">
      <div class="min-w-0">
        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {{ today }}
        </p>

        <h1 class="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {{ greeting }}<template v-if="displayName">, {{ displayName }}</template>
        </h1>

        <p class="mt-1 text-sm text-muted-foreground">
          Semua yang perlu Anda kerjakan hari ini, dalam satu layar.
        </p>
      </div>

      <div class="shrink-0">
        <slot />
      </div>
    </div>

    <!--
      Sorotan hari ini. Orang di kiri, hari libur di kanan — yang
      menempel pada satu orang dan yang berlaku untuk semua tidak
      dicampur dalam satu deret.
    -->
    <div
      v-if="hasHighlights"
      class="relative mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <!--
        `relative` wajib: kartu yang sedang keluar dijadikan `absolute`
        supaya tidak mendorong tata letak saat berganti, dan tanpa
        induk berposisi ia melompat ke sudut halaman.
      -->
      <div v-if="activeHighlight" class="relative flex items-center gap-3">
        <!--
          `mode="out-in"` supaya kartu lama benar-benar hilang sebelum
          yang baru masuk; tanpa itu keduanya menumpuk sesaat dan
          lebarnya melonjak setiap pergantian.
        -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          leave-active-class="transition duration-200 ease-in absolute"
          leave-to-class="opacity-0 -translate-y-1"
          mode="out-in"
        >
          <div
            :key="`${activeHighlight.kind}-${activeIndex}`"
            class="flex items-center gap-2 rounded-full border bg-background/70 py-1.5 pl-2 pr-4 backdrop-blur"
          >
            <span
              class="flex size-7 shrink-0 items-center justify-center rounded-full"
              :class="{
                'bg-pink-500/15 text-pink-600 dark:text-pink-400': activeHighlight.kind === 'birthday',
                'bg-amber-500/15 text-amber-600 dark:text-amber-400': activeHighlight.kind === 'work_anniversary',
              }"
            >
              <component :is="iconFor(activeHighlight.kind)" class="size-4" />
            </span>

            <span class="min-w-0">
              <span class="block truncate text-sm font-medium leading-tight">
                {{ activeHighlight.title }}
              </span>
              <span class="block truncate text-xs leading-tight text-muted-foreground">
                {{ activeHighlight.subtitle }}
              </span>
            </span>
          </div>
        </Transition>

        <!--
          Titik penanda, hanya kalau memang lebih dari satu. Tanpa ini
          tidak ada satu pun tanda bahwa ada nama lain yang sedang
          menunggu giliran.
        -->
        <div
          v-if="personalHighlights.length > 1"
          class="flex items-center gap-1.5"
        >
          <button
            v-for="(item, index) in personalHighlights"
            :key="`dot-${index}`"
            type="button"
            class="h-1.5 rounded-full transition-all duration-300"
            :class="
              activeIndex === index
                ? 'w-4 bg-primary'
                : 'w-1.5 bg-muted-foreground/30'
            "
            :aria-label="`Lihat ${item.title}`"
            @click="goTo(index)"
          />
        </div>
      </div>

      <!-- Penyeimbang supaya hari libur tetap di ujung kanan. -->
      <div v-else class="hidden sm:block" />

      <div
        v-for="(item, index) in holidayHighlights"
        :key="`holiday-${index}`"
        class="flex items-center gap-2 self-start rounded-full border border-emerald-500/30 bg-emerald-500/10 py-1.5 pl-2 pr-4 backdrop-blur sm:self-auto"
      >
        <span
          class="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
        >
          <component :is="iconFor(item.kind)" class="size-4" />
        </span>

        <span class="min-w-0">
          <span class="block truncate text-sm font-medium leading-tight">
            {{ item.title }}
          </span>
          <span class="block truncate text-xs leading-tight text-muted-foreground">
            {{ item.subtitle }}
          </span>
        </span>
      </div>
    </div>
  </section>
</template>
