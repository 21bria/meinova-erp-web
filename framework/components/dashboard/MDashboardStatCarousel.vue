<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"

import { translate } from "../../core/utils/i18n"

import {
  activeStatCarouselPage,
  EMPTY_STAT_CAROUSEL_METRICS,
  statCarouselPages,
  visibleCardCount,
} from "@framework/core/utils/statCarousel"

import type { StatCarouselMetrics } from "@framework/core/utils/statCarousel"
import type {
  DashboardStatData,
  DashboardStatWidget,
} from "@framework/core/types/dashboard"

/*
|--------------------------------------------------------------------------
| Baris kartu KPI
|--------------------------------------------------------------------------
|
| Satu track mendatar, di semua ukuran layar. Sebelumnya ada dua: carousel
| Embla di bawah `sm` dan grid `statGridClass` di atasnya — dua markup,
| dua perilaku, dan satu di antaranya membungkus barisnya.
|
| Membungkus adalah yang merusak Payroll Dashboard: delapan kartu di grid
| enam kolom berarti enam kartu di baris pertama dan dua kartu kesepian di
| baris kedua, lalu Progres Proses Penggajian terdorong turun satu baris
| penuh. Yang terbaca bukan "kartunya ada delapan", melainkan dua kartu
| yang tercecer.
|
| Track ini memakai gulir asli — `overflow-x-auto` + `scroll-snap`, bukan
| pustaka carousel. Alasannya bukan ukuran bundel: gulir asli adalah
| satu-satunya cara trackpad mendatar, jari, roda mouse mendatar, dan
| tombol panah papan ketik semuanya bekerja tanpa satu pun penangan
| tambahan — dan `prefers-reduced-motion` dihormati lewat CSS, bukan lewat
| tebakan JavaScript.
*/

const props = withDefaults(
  defineProps<{
    widgets: DashboardStatWidget[]
    /**
     * Pembaca data per widget — `widgetData` milik `useDashboard`.
     * Diteruskan sebagai fungsi supaya komponen ini tidak perlu tahu
     * bentuk respons dashboard sama sekali.
     */
    dataFor: (key: string) => DashboardStatData | null
    loading?: boolean
  }>(),
  { loading: false },
)

/*
 * Lebar kartu per breakpoint, dan ini satu-satunya tempat angkanya
 * ditulis. Jumlah kartu yang terlihat TIDAK ditulis ulang di JavaScript;
 * `visibleCardCount` mengukurnya dari DOM, jadi baris ini tetap jadi
 * satu-satunya sumber kebenaran.
 *
 * Jaraknya `gap-4` (1rem), jadi N kartu per layar berarti
 * `(100% - (N-1) × 1rem) / N`:
 *
 *     ponsel   ~1 kartu + intipan kartu berikutnya
 *     sm / md  2 kartu
 *     lg       3 kartu
 *     xl       4 kartu
 *     2xl      5 kartu
 *
 * Angkanya diturunkan dari lebar yang benar-benar tersisa, bukan dari
 * lebar layar: sidebar mengambil ~256px, jadi tablet 820px cuma punya
 * ~480px untuk kartunya. Tiga kartu di sana tinggal 148px masing-masing
 * — lebih sempit daripada grid yang digantikan ini, dan label KPI mulai
 * turun ke baris ketiga. Dua kartu di `md` menjaganya di ~230px.
 *
 * Intipan 14% di ponsel bukan sisa ruang yang kebetulan: itu satu-satunya
 * tanda bahwa area tersebut bisa digeser. Kartu yang pas selebar layar
 * terbaca sebagai kartu terakhir.
 *
 * Tidak ada satu ukuran pun yang kartunya jadi lebih sempit dari grid
 * yang digantikan: enam kartu sejajar di `xl` dulu menyisakan ~138px per
 * kartu, empat kartu di sini 218px. Jadi tidak ada angka rupiah yang
 * mengecil hurufnya karena perubahan ini.
 *
 * `shrink-0` wajib: tanpa itu delapan kartu yang jumlah lebarnya melebihi
 * layar akan diciutkan flexbox sampai muat, dan tidak ada yang tergulir
 * sama sekali. `grow` mengurus kebalikannya — dashboard dengan empat
 * kartu di layar lima kolom membagi rata sisa ruangnya, bukan
 * meninggalkan sel kosong di ujung kanan. Keduanya bersama berarti
 * seluruh kartu selalu selebar satu sama lain.
 */
const CARD_CLASS = "min-w-0 shrink-0 grow basis-[86%] snap-start sm:basis-[calc(50%-0.5rem)] lg:basis-[calc((100%-2rem)/3)] xl:basis-[calc((100%-3rem)/4)] 2xl:basis-[calc((100%-4rem)/5)]"

const track = ref<HTMLElement | null>(null)
const metrics = ref<StatCarouselMetrics>({ ...EMPTY_STAT_CAROUSEL_METRICS })

let frame = 0
let observer: ResizeObserver | null = null

/*
 * Jarak antar kartu diukur dari dua kartu pertama, bukan dihitung dari
 * `basis-*` + `gap-4`. Yang diukur adalah yang benar-benar dirender —
 * termasuk saat sidebar dilipat, saat bilah gulir mengambil lebarnya,
 * dan saat breakpoint-nya besok digeser.
 */
function measure() {
  const el = track.value

  if (!el) return

  const first = el.children[0] as HTMLElement | undefined
  const second = el.children[1] as HTMLElement | undefined

  const step = first && second
    ? Math.abs(second.offsetLeft - first.offsetLeft)
    : (first?.offsetWidth ?? 0)

  metrics.value = {
    scrollLeft: el.scrollLeft,
    maxScroll: Math.max(0, el.scrollWidth - el.clientWidth),
    step,
    viewport: el.clientWidth,
    total: props.widgets.length,
  }
}

// Satu pengukuran per frame: `scroll` bisa berbunyi puluhan kali per
// detik, dan tiap pembacaan `scrollWidth` memaksa layout dihitung ulang.
function scheduleMeasure() {
  if (typeof requestAnimationFrame !== "function") {
    measure()

    return
  }

  if (frame) return

  frame = requestAnimationFrame(() => {
    frame = 0
    measure()
  })
}

const pages = computed(() => statCarouselPages(metrics.value))
const activePage = computed(() => activeStatCarouselPage(metrics.value))
const perView = computed(() => visibleCardCount(metrics.value))

// Satu kartu per halaman (ponsel): titiknya menunjuk kartu, jadi namanya
// menyebut kartu itu — persis seperti carousel yang digantikannya.
const perPageIsCard = computed(() => perView.value === 1)

const scrollable = computed(() => pages.value.length > 1)
const canScrollPrev = computed(() => activePage.value > 0)
const canScrollNext = computed(() => activePage.value < pages.value.length - 1)

function scrollToPage(index: number) {
  const el = track.value
  const target = pages.value[Math.min(Math.max(index, 0), pages.value.length - 1)]

  if (!el || target == null) return

  // Tanpa `behavior`: nilai bawaannya mengikuti `scroll-behavior` di CSS,
  // dan di sana `motion-reduce:scroll-auto` sudah mematikan animasinya
  // untuk yang memintanya.
  el.scrollTo({ left: target })
}

function step(direction: number) {
  scrollToPage(activePage.value + direction)
}

function cardLabel(index: number) {
  const widget = props.widgets[index]

  return translate(
    "common.actions.goToCard",
    `Go to card ${widget?.label ?? index + 1}`,
    { label: widget?.label ?? String(index + 1) },
  )
}

function pageLabel(index: number) {
  if (perPageIsCard.value) return cardLabel(index)

  return translate(
    "common.actions.goToCardGroup",
    `Go to metrics group ${index + 1}`,
    { index: index + 1 },
  )
}

onMounted(() => {
  nextTick(measure)

  if (typeof ResizeObserver === "function") {
    observer = new ResizeObserver(scheduleMeasure)

    if (track.value) observer.observe(track.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null

  if (frame) cancelAnimationFrame(frame)
})

// Dashboard yang widget KPI-nya baru datang bersama respons pertama
// (atau berubah karena filter) harus diukur ulang — kalau tidak,
// indikatornya tetap memakai jumlah kartu yang lama.
watch(() => props.widgets.length, () => nextTick(measure))
</script>

<template>
  <section :aria-label="translate('common.labels.keyMetrics', 'Key metrics')">
    <!--
      `tabindex="0"` supaya area gulirnya bisa dicapai papan ketik dan
      digeser dengan tombol panah. Sebagian browser memberikannya
      sendiri pada elemen yang tergulir, sebagian tidak — dan konten
      yang cuma bisa dicapai dengan tetikus adalah konten yang hilang
      bagi sebagian orang.

      `-my-1 py-1` menjaga kartu yang terangkat saat disentuh kursor
      (`hover:-translate-y-0.5`) dan bayangannya tidak terpotong:
      `overflow-x-auto` ikut memotong sisi atas-bawah. Marginnya
      mengembalikan jarak yang dipinjam paddingnya, jadi tidak ada ruang
      tambahan yang lahir dari ini.
    -->
    <div
      ref="track"
      tabindex="0"
      class="no-scrollbar -my-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth rounded-xl py-1 outline-none motion-reduce:scroll-auto focus-visible:ring-[3px] focus-visible:ring-ring/50"
      @scroll.passive="scheduleMeasure"
    >
      <div
        v-for="(widget, index) in widgets"
        :key="widget.key"
        :class="CARD_CLASS"
      >
        <MDashboardStat
          :widget="widget"
          :data="dataFor(widget.key)"
          :loading="loading"
          :index="index"
        />
      </div>
    </div>

    <!--
      Baris kendali baru muncul kalau memang ada yang bisa digulir.
      Dashboard berkartu empat di layar lebar tidak mendapat satu titik
      mati dan dua panah yang selamanya padam.
    -->
    <div v-if="scrollable" class="mt-3 flex items-center gap-2">
      <!-- Penyeimbang selebar panah: titiknya tetap di tengah track,
           bukan tergeser ke kiri karena panahnya makan tempat. -->
      <div class="hidden w-15 shrink-0 sm:block" aria-hidden="true" />

      <div class="flex flex-1 items-center justify-center gap-1.5">
        <button
          v-for="(target, index) in pages"
          :key="target"
          type="button"
          class="h-1.5 rounded-full outline-none transition-all duration-300 focus-visible:ring-[3px] focus-visible:ring-ring/50"
          :class="
            activePage === index
              ? 'w-5 bg-primary'
              : 'w-1.5 bg-muted-foreground/30'
          "
          :aria-label="pageLabel(index)"
          :aria-current="activePage === index ? 'true' : undefined"
          @click="scrollToPage(index)"
        />
      </div>

      <!--
        Panah hanya di layar yang punya penunjuk. Di ponsel kartunya
        digeser jari, dan dua tombol mungil di sana cuma mengambil ruang
        yang sudah sempit.
      -->
      <div class="hidden w-15 shrink-0 items-center justify-end gap-1 sm:flex">
        <Button
          type="button"
          variant="outline"
          size="icon"
          class="size-7 rounded-full"
          :disabled="!canScrollPrev"
          :aria-label="translate('common.actions.previousMetrics', 'Previous metrics')"
          @click="step(-1)"
        >
          <Icon name="i-lucide-chevron-left" class="size-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          class="size-7 rounded-full"
          :disabled="!canScrollNext"
          :aria-label="translate('common.actions.nextMetrics', 'Next metrics')"
          @click="step(1)"
        >
          <Icon name="i-lucide-chevron-right" class="size-4" />
        </Button>
      </div>
    </div>
  </section>
</template>
