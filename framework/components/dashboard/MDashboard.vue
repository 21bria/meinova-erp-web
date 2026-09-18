<script setup lang="ts">
import { computed, ref } from "vue"
import { translate } from "../../core/utils/i18n"

import { useDashboard } from "@framework/core/composables/useDashboard"
import { daysBetween, spanClass, statGridClass } from "@framework/core/utils/dashboard"

import type { CarouselApi } from "@/components/ui/carousel"
import type {
  DashboardChartData,
  DashboardChartWidget,
  DashboardListData,
  DashboardListWidget,
  DashboardSchema,
  DashboardStatData,
  DashboardStatWidget,
  DashboardTableData,
  DashboardTableWidget,
} from "@framework/core/types/dashboard"

const props = defineProps<{
  schema: DashboardSchema
  title?: string
  subtitle?: string
}>()

const {
  period,
  periodModes,
  periodLabel,
  filters,
  loading,
  error,
  widgets,
  periodFilter,
  periodFilterLabel,
  quickFilters,
  advancedFilters,
  activeAdvancedCount,
  hasActiveFilters,
  load,
  loadWidget,
  resetFilters,
  widgetData,
  setPeriod,
  setPeriodMode,
  movePeriod,
  setFilter,
} = useDashboard(props.schema)

// Kartu KPI dipisah dari sisanya karena perlakuannya beda: di layar
// kecil dia jadi carousel yang digeser jari, di layar lebar jadi grid.
const statWidgets = computed(
  () => widgets.value.filter(
    (item): item is DashboardStatWidget => item.type === "stat",
  ),
)

const bodyWidgets = computed(
  () => widgets.value.filter(item => item.type !== "stat"),
)

/*
 * Bunyi chart yang kosong, dan bunyinya bergantung apakah layar ini
 * punya periode.
 *
 * "Belum ada data pada periode ini" menyuruh pembacanya mengganti
 * pemilih periode. Di laporan potret (Manpower Summary, Employee
 * Reporting Audit, Contract Expiry) pemilih itu memang tidak ada, jadi
 * kalimatnya mengirim orang mencari kontrol yang tidak pernah dibuat —
 * padahal yang perlu diubah filternya. Dashboard berperiode tetap
 * berbunyi persis seperti sebelumnya.
 */
const chartEmptyMessage = computed(() =>
  periodFilter.value
    ? translate("common.state.noDataPeriod", "No data for this period.")
    : translate("common.state.noDataFilter", "No data for this filter."),
)

/*
 * Periode + filter yang sedang aktif, dalam bentuk yang sama persis
 * dengan yang dikirim `useDashboard.load()`.
 *
 * Dipakai widget tabel untuk memuat rincian. Merakit ulang query-nya di
 * sana berarti satu filter yang besok ditambahkan diam-diam tidak ikut
 * di rincian saja — dan yang terbuka adalah daftar di luar filter yang
 * sedang dipilih di layar, tanpa satu pun tanda.
 */
const activeQuery = computed(() => ({
  mode: period.value.mode,
  start: period.value.start,
  end: period.value.end,
  ...filters.value,
}))

const heading = computed(
  () => props.title ?? props.schema.title ?? "Dashboard",
)

function cardAriaLabel(label: string) {
  return translate("common.actions.goToCard", `Go to card ${label}`, { label })
}

const description = computed(() => props.subtitle ?? props.schema.description ?? "")

const rangeCaption = computed(() => {
  const days = daysBetween(period.value.start, period.value.end)

  return days > 1 ? `${days} hari` : "1 hari"
})

/*
 * Carousel hanya hidup di breakpoint kecil; di atas itu kartu memakai
 * grid biasa. Dipisah lewat CSS, bukan `useMediaQuery`, supaya render
 * di server dan di klien menghasilkan markup yang sama.
 */
const carouselApi = ref<CarouselApi>()
const activeSlide = ref(0)

function onCarouselInit(api: CarouselApi) {
  carouselApi.value = api

  api?.on("select", () => {
    activeSlide.value = api.selectedScrollSnap()
  })
}

function goToSlide(index: number) {
  carouselApi.value?.scrollTo(index)
}
</script>

<template>
  <div class="space-y-5 p-4 sm:space-y-6 sm:p-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div class="min-w-0">
        <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">
          {{ heading }}
        </h1>

        <div class="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span v-if="description" class="truncate">{{ description }}</span>

          <span v-if="description && periodFilter" class="hidden text-muted-foreground/40 sm:inline">•</span>

          <!--
            Label periode ikut `periodFilter`, sama dengan pemilihnya di
            kanan atas — dan sebelumnya tidak.

            Laporan yang memang tidak punya periode (Employee Reporting
            Audit membaca master organisasi) tetap menampilkan "Agustus
            2026 · 31 hari" di kepala halaman, padahal tidak satu pun
            angkanya berubah karena bulan itu. Yang membacanya
            menyimpulkan laporannya tersaring per bulan, lalu mencari
            pemilih bulan yang memang sengaja tidak ada.

            `useDashboard` tetap menghitung `period` untuk semua
            dashboard — yang berubah cuma apakah ia ditampilkan.
          -->
          <template v-if="periodFilter">
            <span class="inline-flex items-center gap-1.5 font-medium text-foreground">
              <Icon name="i-lucide-calendar-range" class="size-3.5 text-muted-foreground" />
              {{ periodLabel }}
            </span>

            <Badge variant="secondary" class="px-1.5 text-[10px] font-normal">
              {{ rangeCaption }}
            </Badge>
          </template>

          <Icon
            v-if="loading"
            name="i-lucide-loader-circle"
            class="size-3.5 animate-spin text-muted-foreground"
          />
        </div>
      </div>

      <!-- Di layar sempit barisnya menumpuk: lookup dulu, lalu periode
           yang memakai lebar penuh supaya labelnya tidak terpotong. -->
      <div class="flex shrink-0 flex-col gap-2 lg:flex-row lg:items-center lg:justify-end">
        <div class="flex flex-wrap items-center gap-2">
          <MDashboardFilters
            v-if="quickFilters.length"
            :lookup-filters="quickFilters"
            :filters="filters"
            @update:filter="(key, value) => setFilter(key, value)"
          />

          <!--
            Tombolnya baru muncul kalau ada schema yang benar-benar
            menaruh filter di sana. Dashboard yang seluruh filternya
            "quick" — bawaan, dan itu berarti semua yang sudah ada —
            tidak mendapat tombol yang dibuka lalu kosong.
          -->
          <MDashboardAdvancedFilters
            v-if="advancedFilters.length"
            :filters="advancedFilters"
            :values="filters"
            :active-count="activeAdvancedCount"
            :disabled="loading"
            @update:filter="(key, value) => setFilter(key, value)"
            @reset="resetFilters()"
          />

          <Button
            v-if="advancedFilters.length && hasActiveFilters"
            type="button"
            variant="ghost"
            class="h-9"
            :disabled="loading"
            @click="resetFilters()"
          >
            <Icon name="i-lucide-rotate-ccw" class="mr-2 size-4" />
            Reset
          </Button>
        </div>

        <div class="flex items-center gap-2">
          <MDashboardPeriodPicker
            v-if="periodFilter"
            class="min-w-0 flex-1 lg:w-76 lg:flex-none"
            :period="period"
            :modes="periodModes"
            :label="periodLabel"
            :title="periodFilterLabel"
            @update:period="value => setPeriod(value)"
            @update:mode="value => setPeriodMode(value)"
            @move="direction => movePeriod(direction)"
          />

          <Button
            variant="outline"
            size="icon"
            class="size-9 shrink-0"
            :disabled="loading"
            :aria-label="translate('common.actions.refresh', 'Refresh')"
            @click="load()"
          >
            <Icon
              name="i-lucide-refresh-cw"
              class="size-4"
              :class="loading && 'animate-spin'"
            />
          </Button>
        </div>
      </div>
    </div>

    <Alert v-if="error" variant="destructive">
      <AlertTitle>{{ translate("common.errors.loadDashboard", "Failed to load dashboard.") }}</AlertTitle>
      <AlertDescription class="flex items-center gap-3">
        {{ error }}
        <Button size="sm" variant="outline" @click="load()">
          Coba lagi
        </Button>
      </AlertDescription>
    </Alert>

    <template v-if="statWidgets.length">
      <!-- Layar kecil: kartu digeser seperti tumpukan kartu bank. -->
      <div class="sm:hidden">
        <Carousel
          class="w-full"
          :opts="{ align: 'start', containScroll: 'trimSnaps' }"
          @init-api="onCarouselInit"
        >
          <CarouselContent class="-ml-3">
            <CarouselItem
              v-for="(widget, index) in statWidgets"
              :key="widget.key"
              class="basis-[80%] pl-3"
            >
              <MDashboardStat
                :widget="widget"
                :data="widgetData<DashboardStatData>(widget.key)"
                :loading="loading"
                :index="index"
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        <div class="mt-3 flex items-center justify-center gap-1.5">
          <button
            v-for="(widget, index) in statWidgets"
            :key="widget.key"
            type="button"
            class="h-1.5 rounded-full transition-all duration-300"
            :class="
              activeSlide === index
                ? 'w-5 bg-primary'
                : 'w-1.5 bg-muted-foreground/30'
            "
            :aria-label="cardAriaLabel(widget.label ?? String(index + 1))"
            @click="goToSlide(index)"
          />
        </div>
      </div>

      <div class="hidden gap-4 sm:grid" :class="statGridClass(statWidgets.length)">
        <MDashboardStat
          v-for="(widget, index) in statWidgets"
          :key="widget.key"
          :widget="widget"
          :data="widgetData<DashboardStatData>(widget.key)"
          :loading="loading"
          :index="index"
        />
      </div>
    </template>

    <!--
      Diregangkan (`items-stretch` bawaan grid), **bukan** `items-start`.

      Sempat sebaliknya, dengan alasan yang masuk akal di atas kertas:
      kartu berisi satu baris data tidak perlu diregangkan setinggi
      tetangganya. Di layar hasilnya justru lebih buruk — Rekap Cuti
      yang berisi satu tipe cuti berhenti di sepertiga tinggi chart di
      sebelahnya, dan barisnya terbaca seperti kartu yang gagal dimuat
      atau tata letak yang rusak, bukan seperti kartu yang isinya
      memang sedikit. Ruang kosong **di dalam** kartu terbaca sebagai
      "belum ada isinya lagi"; tepi bawah yang tidak rata terbaca
      sebagai kerusakan.

      Tingginya per **baris**, bukan seluruh grid: itu sifat CSS grid,
      dan itu yang diinginkan — baris chart tidak menyeret tinggi baris
      daftar di bawahnya.
    -->
    <div class="grid gap-4 md:grid-cols-12">
      <!--
        `min-w-0` pada pembungkus, dan ini bukan kosmetik.

        Item grid bawaannya `min-width: auto`, artinya ia **menolak
        menyusut di bawah lebar isinya**. Tabel laporan berisi sembilan
        belas kolom punya lebar alami sekitar dua ribu piksel, jadi
        tanpa baris ini kolom gridnya ikut melebar dan yang tergulir
        mendatar adalah **seluruh halaman** — bukan tabelnya. Di ponsel
        gejalanya persis "tidak responsif": judul, filter, dan kartu KPI
        ikut terseret ke kanan, dan `overflow-auto` milik tabel tidak
        pernah kebagian bekerja karena tidak ada yang memaksanya
        meluap.

        Berlaku untuk semua widget, bukan cuma tabel: chart pun
        mengandalkan lebar induk yang bisa menyusut.
      -->
      <div
        v-for="widget in bodyWidgets"
        :key="widget.key"
        class="min-w-0"
        :class="spanClass(widget.span)"
      >
        <MDashboardChart
          v-if="widget.type === 'chart'"
          :widget="widget as DashboardChartWidget"
          :data="widgetData<DashboardChartData>(widget.key)"
          :loading="loading"
          :empty-message="chartEmptyMessage"
        />

        <MDashboardList
          v-else-if="widget.type === 'list'"
          :widget="widget as DashboardListWidget"
          :data="widgetData<DashboardListData>(widget.key)"
          :loading="loading"
        />

        <MDashboardTable
          v-else-if="widget.type === 'table'"
          :widget="widget as DashboardTableWidget"
          :data="widgetData<DashboardTableData>(widget.key)"
          :loading="loading"
          :endpoint="schema.endpoint"
          :query="activeQuery"
          :on-page="(params) => loadWidget(widget.key, params)"
        />
      </div>
    </div>
  </div>
</template>
