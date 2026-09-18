<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { translate } from "../../core/utils/i18n"

import { useApi } from "@/composables/useApi"
import { formatDashboardValue } from "@framework/core/utils/dashboard"
import {
  drilldownColumns,
  drilldownSourceLabel,
  drilldownSummary,
  isDrillable,
} from "@framework/core/utils/drilldown"

import type {
  DashboardDrilldownData,
  DashboardTableColumn,
  DashboardTableData,
  DashboardTableWidget,
} from "@framework/core/types/dashboard"

/*
 * Alias tipe, **bukan** `interface`, dan itu bukan selera.
 *
 * TypeScript hanya memberi index signature implisit pada type alias.
 * Sebagai `interface`, bentuk ini tidak bisa diteruskan ke
 * `loadWidget(key, extra: Record<string, unknown>)` — dan yang muncul
 * adalah error di pemanggilnya, bukan di sini.
 */
export type DashboardTablePageRequest = {
  page: number
  page_size: number
  search: string
}

const props = defineProps<{
  widget: DashboardTableWidget
  data: DashboardTableData | null
  loading?: boolean
  /*
   * Pemuat halaman berikutnya. Dideklarasikan sebagai **prop fungsi**,
   * bukan emit, karena tabel ini perlu tahu kapan permintaannya selesai
   * untuk mematikan spinnernya sendiri — dan `emit` tidak mengembalikan
   * apa pun yang bisa ditunggu.
   *
   * Yang dimuat ulang hanya widget ini (`?widget=<key>` di backend).
   * KPI dan chart di atasnya tidak ikut dihitung ulang, jadi pindah
   * halaman tidak membuat angkanya berkedip.
   */
  onPage?: (params: DashboardTablePageRequest) => void | Promise<void>
  /*
   * Endpoint laporannya. Rinciannya dilayani `<endpoint>drilldown/` —
   * diturunkan, bukan dibaca dari kunci schema tersendiri: builder
   * dashboard di backend cuma meneruskan module/filters/widgets, jadi
   * kunci tambahan hilang diam-diam saat schema diregenerate.
   */
  endpoint?: string
  // Periode + filter yang sedang aktif, apa adanya dari `useDashboard`.
  // Rincian **wajib** memakai penyaringan yang sama dengan angkanya;
  // kalau tidak, yang terbuka adalah daftar kedua, bukan bukti.
  query?: Record<string, unknown>
}>()

const { request } = useApi()

const columns = computed<DashboardTableColumn[]>(
  () => props.widget.columns ?? [],
)

const items = computed(() => props.data?.items ?? [])

const rawTotals = computed(() => props.data?.totals ?? null)

/*
 * Baris Total baru berdiri kalau ada **kolom yang benar-benar dirender**
 * yang punya angkanya; kalau tidak, `totals` di sini bernilai `null` dan
 * `tfoot`-nya tidak pernah dibuat.
 *
 * `data.totals` tidak dijanjikan sekunci dengan kolom tabelnya. HR
 * Period Summary dan Manpower Summary memang mengirimnya per kolom,
 * tapi Contract Expiry mengirim rekap **per bucket** (`expired`,
 * `expiring_30`, …) — tidak satu pun namanya sama dengan nama kolom,
 * karena yang dijumlahkan di sana bukan isi kolom mana pun.
 *
 * Tanpa penjagaan ini yang muncul adalah baris tebal menempel di kaki
 * tabel yang isinya cuma kata "Total" dan tujuh belas sel kosong — dan
 * baris jumlah yang kosong seluruhnya tidak terbaca sebagai "memang
 * tidak ada yang dijumlahkan", melainkan sebagai angka yang gagal
 * dimuat. Yang tidak menjumlahkan apa pun lebih baik tidak berdiri.
 *
 * Disaring **di dalam `totals`**, bukan lewat penanda boolean di
 * sebelahnya: `v-if` pada penanda terpisah tidak menyempitkan tipe
 * `totals` di dalam blok, jadi tiap pembacaan selnya jadi "possibly
 * null" di `vue-tsc`.
 */
const totals = computed(() => {
  const value = rawTotals.value

  if (!value) return null

  return columns.value.some(column => value[column.key] != null)
    ? value
    : null
})

const stickyCount = computed(() => props.widget.sticky_columns ?? 1)

/*
 * Kolom terkunci butuh `left` yang pasti, dan lebarnya tidak bisa
 * ditanyakan ke browser saat render pertama. Dipatok di sini: satu
 * kolom nama pegawai selebar 14rem sudah memuat nama Indonesia
 * terpanjang yang lazim tanpa memakan setengah layar.
 *
 * Schema boleh menyebut `width` sendiri per kolom, dan untuk kolom
 * pendek itu bukan kemewahan: "HO001" di kotak selebar 14rem
 * meninggalkan jarak kosong yang terbaca seperti kolomnya salah
 * pasang. Yang tidak menyebutnya tetap memakai angka di atas, jadi
 * tabel lama tidak berubah sedikit pun.
 */
const STICKY_WIDTH = 224

function widthOf(index: number): number {
  return columns.value[index]?.width ?? STICKY_WIDTH
}

function stickyStyle(index: number) {
  if (index >= stickyCount.value) return undefined

  /*
   * `left` dijumlahkan dari lebar kolom **sebelumnya**, bukan
   * `index * STICKY_WIDTH`. Perkalian itu benar hanya selama seluruh
   * kolom terkunci sama lebar; begitu yang pertama dipersempit, kolom
   * kedua mendarat di tengah kolom pertama dan menutupinya — dan yang
   * terlihat cuma teks bertumpuk saat tabelnya digeser.
   */
  let left = 0

  for (let i = 0; i < index; i += 1) left += widthOf(i)

  /*
   * Dikirim sebagai custom property, bukan `left` langsung, supaya
   * kuncinya bisa dimatikan per breakpoint lewat kelas
   * (`md:left-[var(--sticky-left)]`). Nilai inline tidak punya varian
   * layar, dan di ponsel kunci ini justru merugikan: dua kolom terkunci
   * memakan 328px dari layar selebar 375px, jadi yang tersisa untuk
   * digulir cuma sekitar 47px. Tabelnya secara teknis berfungsi dan
   * secara praktis tidak bisa dibaca.
   *
   * `minWidth` tetap berlaku di semua ukuran — ia cuma menetapkan lebar
   * kolom, dan kolom yang tidak terkunci ikut hanyut seperti kolom
   * biasa.
   */
  return {
    "--sticky-left": `${left}px`,
    minWidth: `${widthOf(index)}px`,
  }
}

function isSticky(index: number) {
  return index < stickyCount.value
}

function cellText(value: unknown, column: DashboardTableColumn): string {
  const text = formatDashboardValue(value, column.format ?? "text")

  // Suffix hanya menempel pada angka yang benar-benar ada. "—h" untuk
  // pegawai yang belum punya lembur terbaca seperti data rusak.
  if (!column.suffix || text === "—") return text

  return `${text}${column.suffix}`
}

/*
 * Nol dipudarkan, tidak disembunyikan.
 *
 * Tabel delapan belas kolom yang mayoritas selnya berisi "0" membuat
 * angka yang tidak nol — yang justru dicari pembacanya — tenggelam di
 * antara nol yang tercetak sama tebalnya. Membuangnya sama sekali juga
 * salah: sel kosong berarti "tidak ada datanya", dan nol berarti
 * "dihitung, hasilnya nol".
 */
function isZero(value: unknown): boolean {
  return Number(value) === 0
}

// ---------------------------------------------------------------------
// Paginasi & pencarian — keduanya di server
// ---------------------------------------------------------------------
//
// Halaman dan kotak cari **hanya menyentuh tabel ini**. KPI, chart, dan
// baris Total tetap dihitung dari seluruh dataset yang lolos filter
// laporan, dan itu yang membuat angkanya bisa dibandingkan antar
// halaman. Kalau ikut berubah, "Absent 412" berhenti berarti "412 pada
// filter ini" dan berubah jadi "412 di antara 25 baris yang kebetulan
// sedang terbuka".

const paginated = computed(() => Boolean(props.widget.page_size))

const pageSizeOptions = computed(
  () => props.widget.page_size_options ?? [25, 50, 100],
)

const page = ref(1)
const pageSize = ref(props.widget.page_size ?? pageSizeOptions.value[0]!)
const search = ref("")
const pending = ref(false)

// Yang lolos kotak cari; dasar penghitungan halaman. Backend lama yang
// belum mengirimnya jatuh ke `total` — tabelnya tetap tampil, cuma tanpa
// paginasi yang berarti, bukan blank.
const matched = computed(() => props.data?.matched ?? props.data?.total ?? 0)

const pageCount = computed(
  () => props.data?.page_count
    ?? Math.max(Math.ceil(matched.value / pageSize.value), 1),
)

async function requestPage() {
  if (!props.onPage) return

  pending.value = true

  try {
    await props.onPage({
      page: page.value,
      page_size: pageSize.value,
      search: search.value,
    })
  }
  finally {
    pending.value = false
  }
}

function goToPage(next: number) {
  const target = Math.min(Math.max(next, 1), pageCount.value)

  if (target === page.value) return

  page.value = target

  void requestPage()
}

function setPageSize(next: number) {
  if (next === pageSize.value) return

  pageSize.value = next

  // Kembali ke halaman pertama: "halaman 8 dari 25 baris" tidak punya
  // padanan di daftar berukuran 100, dan mendarat di baris yang berbeda
  // dari yang sedang dibaca orang lebih buruk daripada mengulang.
  page.value = 1

  void requestPage()
}

/*
 * Kotak cari ditunda sebentar sebelum menembak backend.
 *
 * Bukan penghematan request semata: tanpa jeda, tiap huruf yang diketik
 * memicu satu perakitan ulang agregasi seluruh pegawai di server, dan
 * huruf keempat menunggu antrian tiga permintaan yang jawabannya sudah
 * tidak dipakai.
 */
let searchTimer: ReturnType<typeof setTimeout> | undefined

function onSearch(value: string) {
  search.value = value

  if (searchTimer) clearTimeout(searchTimer)

  searchTimer = setTimeout(() => {
    page.value = 1

    void requestPage()
  }, 350)
}

/*
 * Filter atau periode berganti = dataset yang berbeda, jadi halaman dan
 * kotak cari sama-sama kembali ke keadaan awal.
 *
 * Halamannya jelas: memilih departemen berisi tiga orang sementara tabel
 * sedang di halaman 8 menghasilkan tabel kosong, dan yang terbaca adalah
 * "departemen ini tidak punya data" — bukan "halaman delapan tidak ada".
 *
 * Kotak carinya ikut dikosongkan karena `useDashboard.load()` memuat
 * **seluruh** widget tanpa membawa `page`/`search`: begitu filter
 * berubah, backend membalas halaman pertama tanpa pencarian. Kalau
 * tulisannya dibiarkan tinggal di kotak, layar memperlihatkan kata kunci
 * yang sudah tidak berlaku di atas tabel yang tidak menyaringnya — dan
 * tidak ada di layar yang memberi tahu mana yang benar.
 */
watch(
  () => props.query,
  () => {
    if (searchTimer) clearTimeout(searchTimer)

    page.value = 1
    search.value = ""
  },
  { deep: true },
)

// ---------------------------------------------------------------------
// Drill-down
// ---------------------------------------------------------------------

const detailOpen = ref(false)
const detailLoading = ref(false)
const detailError = ref<string | null>(null)
const detail = ref<DashboardDrilldownData | null>(null)
const detailSubject = ref("")
// Judul = label kolom yang sudah dilokalkan `useDashboard`, jadi
// "Late" dan "Terlambat" datang dari satu kunci yang sama.
const detailTitle = ref("")

function canDrill(column: DashboardTableColumn, value: unknown): boolean {
  return isDrillable(column, value)
}

async function openDetail(
  column: DashboardTableColumn,
  row: Record<string, unknown>,
) {
  if (!column.drilldown || !props.endpoint) return

  detailOpen.value = true
  detailLoading.value = true
  detailError.value = null
  detail.value = null

  detailSubject.value = String(row.employee ?? "")
  detailTitle.value = column.label

  try {
    const response = await request<
      DashboardDrilldownData | { data: DashboardDrilldownData }
    >(`${props.endpoint}drilldown/`, {
      query: {
        ...(props.query ?? {}),
        metric: column.drilldown,
        employee_id: row.id as number,
      },
    })

    detail.value =
      (response as { data?: DashboardDrilldownData })?.data
      ?? (response as DashboardDrilldownData)

    if (detail.value?.employee?.name)
      detailSubject.value = detail.value.employee.name
  }
  catch (error: unknown) {
    detailError.value =
      (error as { data?: { message?: string } })?.data?.message
      ?? (error as Error)?.message
      ?? translate("common.errors.loadDetail", "Failed to load details.")
  }
  finally {
    detailLoading.value = false
  }
}

/*
 * Kolom dan subjudul dirakit `utils/drilldown.ts` dari kode backend
 * (`detail_kind`, `aggregate.unit`, `source_code`). Di sini tidak ada
 * aturan HR — cuma merender yang dikirim.
 */
const detailColumns = computed(
  () => (detail.value ? drilldownColumns(detail.value) : []),
)

const detailDescription = computed(
  () => (detail.value ? drilldownSummary(detail.value) : ""),
)

const detailSourceLabel = computed(
  () => drilldownSourceLabel(detail.value?.source_code, detail.value?.source),
)
</script>

<template>
  <Card class="flex h-full flex-col gap-0 border-border/60 py-0 shadow-xs">
    <CardHeader class="gap-0 border-b p-4 sm:p-5">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <CardTitle class="text-base">
            {{ widget.label }}
          </CardTitle>

          <CardDescription v-if="widget.description" class="mt-1">
            {{ widget.description }}
          </CardDescription>
        </div>

        <!--
          Label penghitungnya ikut schema, dan bawaannya tetap
          "Pegawai" supaya dua laporan yang sudah hidup tidak bergeser.

          Ada karena tidak semua tabel laporan berisi satu baris per
          pegawai: Manpower Summary satu baris per **kelompok
          organisasi**, jadi "Pegawai 11" di sana menyebut angka yang
          bukan jumlah orangnya — dan menyebutnya persis di sebelah
          kartu KPI yang berbunyi 30.
        -->
        <div v-if="data?.total != null" class="shrink-0 text-right">
          <p class="text-xs text-muted-foreground">
            {{ widget.total_label ?? translate("common.labels.employees", "Employees") }}
          </p>
          <p class="text-lg font-semibold tabular-nums">
            {{ data.total }}
          </p>
        </div>
      </div>

      <!--
        Kotak cari **milik tabel**, bukan filter laporan. Sengaja duduk
        di kepala tabel dan bukan di baris filter halaman: yang di atas
        mengubah angka KPI, yang di sini tidak.
      -->
      <div
        v-if="widget.searchable"
        class="mt-4 flex flex-wrap items-center gap-2"
      >
        <div class="relative w-full sm:w-72">
          <Icon
            name="i-lucide-search"
            class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            class="h-9 pl-9"
            :model-value="search"
            :placeholder="widget.search_placeholder ?? translate('common.actions.search', 'Search')"
            @update:model-value="(value) => onSearch(String(value ?? ''))"
          />
        </div>

        <p
          v-if="search"
          class="text-xs text-muted-foreground"
        >
          {{ translate("common.state.searchMatched", `${matched} of ${data?.total ?? 0} employees match`, { matched, total: data?.total ?? 0 }) }}
        </p>

        <Icon
          v-if="pending"
          name="i-lucide-loader-circle"
          class="size-4 animate-spin text-muted-foreground"
        />
      </div>
    </CardHeader>

    <CardContent class="min-h-0 flex-1 p-0">
      <div v-if="loading" class="space-y-2 p-4">
        <Skeleton v-for="n in 6" :key="n" class="h-10 w-full rounded-md" />
      </div>

      <div
        v-else-if="!items.length"
        class="flex min-h-48 flex-col items-center justify-center gap-2 p-6 text-center"
      >
        <Icon name="i-lucide-inbox" class="size-6 text-muted-foreground/50" />

        <!--
          Dua kalimat berbeda untuk dua sebab berbeda. "Tidak ada pegawai
          pada filter ini" saat yang kosong sebenarnya hasil pencarian
          membuat orang mengubah filternya, bukan kata kuncinya.
        -->
        <p class="text-sm text-muted-foreground">
          <template v-if="search">
            {{ translate("common.state.searchNoMatch", `No employees match "${search}".`, { search }) }}
          </template>

          <template v-else>
            {{ widget.empty_text ?? translate("common.state.noData", "No data found") }}
          </template>
        </p>

        <Button
          v-if="search"
          type="button"
          variant="outline"
          size="sm"
          @click="onSearch('')"
        >
          {{ translate("common.actions.clearSearch", "Clear search") }}
        </Button>
      </div>

      <!--
        Digulir **di dalam kotaknya sendiri**, bukan ikut menggulir
        halaman. Tabel delapan belas kolom yang melebarkan `body` membuat
        seluruh halaman — termasuk kartu KPI di atasnya — ikut bergeser
        mendatar, dan tidak ada di layar yang memberi tahu kenapa.

        Digulir dua arah: mendatar untuk kolomnya, menegak supaya kepala
        tabel bisa menempel. `max-h` dipatok ke tinggi layar — seratus
        baris yang menumbuhkan kartu sampai dua layar membuat kepala
        tabel yang menempel tidak ada gunanya, karena yang digulir
        halamannya, bukan kotaknya.
      -->
      <div
        v-else
        class="relative w-full overflow-auto"
        :class="paginated && 'max-h-[70vh]'"
      >
        <table class="w-full border-collapse text-sm">
          <!--
            Kepala tabel menempel saat digulir menegak.

            Latarnya **wajib pekat**. `bg-muted/40` yang tembus pandang
            membuat baris yang lewat di belakangnya terbaca menembus
            judul kolom, dan yang terlihat adalah tulisan bertumpuk.
            `color-mix` di sini menghasilkan warna yang sama persis
            dengan `bg-muted/40` di atas kartu — cuma sudah pekat, jadi
            tampilannya tidak berubah sedikit pun.
          -->
          <thead>
            <tr>
              <th
                v-for="(column, index) in columns"
                :key="column.key"
                class="sticky top-0 z-20 whitespace-nowrap border-b px-3 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground [background-color:color-mix(in_oklab,var(--muted)_40%,var(--card))]"
                :class="[
                  (column.format ?? 'text') === 'text' ? 'text-left' : 'text-right',
                  // Sudut kiri atas menempel ke dua arah sekaligus, jadi
                  // ia harus berada di atas kepala tabel *dan* di atas
                  // kolom terkunci — z-nya satu tingkat di atas keduanya.
                  //
                  // Kunci mendatarnya mulai dari `md`. Di ponsel
                  // `left` sengaja dibiarkan `auto`: kepala tabel tetap
                  // menempel menegak (`top-0`), tapi kolomnya ikut
                  // hanyut seperti kolom biasa.
                  isSticky(index) && 'z-30 text-left md:left-[var(--sticky-left)]',
                ]"
                :style="stickyStyle(index)"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(row, rowIndex) in items"
              :key="String(row.id ?? rowIndex)"
              class="border-b transition-colors last:border-b-0 hover:bg-muted/40"
            >
              <td
                v-for="(column, index) in columns"
                :key="column.key"
                class="whitespace-nowrap px-3 py-2"
                :class="[
                  (column.format ?? 'text') === 'text'
                    ? 'text-left'
                    : 'text-right tabular-nums',
                  isSticky(index) && 'z-10 text-left font-medium md:sticky md:left-[var(--sticky-left)] md:bg-background',
                  !isSticky(index) && isZero(row[column.key]) && 'text-muted-foreground/50',
                ]"
                :style="stickyStyle(index)"
              >
                <button
                  v-if="canDrill(column, row[column.key])"
                  type="button"
                  class="cursor-pointer rounded px-1 underline decoration-dotted decoration-muted-foreground/60 underline-offset-2 hover:decoration-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  :title="translate('common.drilldown.viewDetails', 'View details')"
                  @click="openDetail(column, row)"
                >
                  {{ cellText(row[column.key], column) }}
                </button>

                <span v-else>{{ cellText(row[column.key], column) }}</span>
              </td>
            </tr>
          </tbody>

          <!--
            Baris jumlah dari backend, bukan dijumlahkan di sini. Kolom
            yang dijumlahkan frontend akan menyimpang begitu tabelnya
            dipaginasi, dan selisihnya tidak berbunyi.
          -->
          <!--
            Baris Total menempel di kaki kotak gulir, bukan ikut hanyut ke
            bawah baris ke-100. Angkanya adalah pembanding tiap baris di
            atasnya; yang harus digulir dulu untuk dilihat berhenti jadi
            pembanding.
          -->
          <tfoot v-if="totals">
            <tr class="font-semibold">
              <td
                v-for="(column, index) in columns"
                :key="column.key"
                class="sticky bottom-0 z-20 whitespace-nowrap border-t px-3 py-2.5 [background-color:color-mix(in_oklab,var(--muted)_40%,var(--card))]"
                :class="[
                  (column.format ?? 'text') === 'text'
                    ? 'text-left'
                    : 'text-right tabular-nums',
                  isSticky(index) && 'z-30 text-left md:left-[var(--sticky-left)]',
                ]"
                :style="stickyStyle(index)"
              >
                <template v-if="index === 0">
                  {{ translate("common.labels.total", "Total") }}
                </template>

                <template v-else-if="totals[column.key] != null">
                  {{ cellText(totals[column.key], column) }}
                </template>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!--
        Kaki paginasi memakai `MPagination` yang sudah dipakai tabel CRUD
        — sebutan "Showing 1-25 of 37", pemilih baris per halaman, dan
        empat tombolnya sudah ada di sana, dan versi kedua yang ditulis
        khusus laporan berarti dua tempat untuk memperbaiki hal yang sama.

        `total` yang dikirim adalah `matched`, **bukan** jumlah pegawai:
        ini angka pembagi halaman. Kalau yang dikirim jumlah pegawai,
        mencari satu nama di tenant berisi 500 orang menyisakan satu baris
        tapi tetap menawarkan 20 halaman — sembilan belas kosong.
      -->
      <div
        v-if="paginated && items.length"
        class="border-t px-4 py-3 sm:px-5"
      >
        <MPagination
          :page="page"
          :page-size="pageSize"
          :total="matched"
          :loading="pending"
          :page-size-options="pageSizeOptions"
          @update:page="goToPage"
          @update:page-size="setPageSize"
        />
      </div>

    </CardContent>
  </Card>

  <Dialog v-model:open="detailOpen">
    <DialogContent class="max-h-[85vh] sm:max-w-3xl">
      <DialogHeader>
        <DialogTitle>
          {{ detailTitle || translate("common.drilldown.title", "Details") }}
          <span v-if="detailSubject" class="text-muted-foreground">
            — {{ detailSubject }}
          </span>
        </DialogTitle>

        <DialogDescription>
          <template v-if="detail">
            {{ detailDescription }}
          </template>

          <template v-else>
            {{ translate("common.drilldown.intro", "Source records behind this value.") }}
          </template>
        </DialogDescription>
      </DialogHeader>

      <div class="max-h-[55vh] overflow-y-auto">
        <div v-if="detailLoading" class="space-y-2">
          <Skeleton v-for="n in 5" :key="n" class="h-9 w-full rounded-md" />
        </div>

        <Alert v-else-if="detailError" variant="destructive">
          <AlertTitle>{{ translate("common.drilldown.loadError", "Failed to load details") }}</AlertTitle>
          <AlertDescription>{{ detailError }}</AlertDescription>
        </Alert>

        <p
          v-else-if="!detail?.items?.length"
          class="py-8 text-center text-sm text-muted-foreground"
        >
          {{ translate("common.drilldown.empty", "No records for this value.") }}
        </p>

        <!--
          Pembungkus penggulir mendatar. Kolom jam dan nomor dokumen
          tidak muat di lebar dialog ponsel; tanpa ini kolomnya saling
          menghimpit atau isi dialog menyembul keluar tepinya.
        -->
        <div v-else class="-mx-1 overflow-x-auto px-1">
          <table class="w-full min-w-[34rem] border-collapse text-sm">
            <thead>
              <tr class="border-b text-xs uppercase tracking-wide text-muted-foreground">
                <th
                  v-for="col in detailColumns"
                  :key="col.key"
                  class="whitespace-nowrap px-2 py-2"
                  :class="col.align === 'right' ? 'text-right' : 'text-left'"
                >
                  {{ col.label }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, index) in detail.items"
                :key="`${item.date}-${item.record_id ?? index}`"
                class="border-b last:border-b-0"
              >
                <td
                  v-for="col in detailColumns"
                  :key="col.key"
                  class="px-2 py-2"
                  :class="[
                    col.align === 'right' ? 'whitespace-nowrap text-right tabular-nums' : '',
                    col.key === 'date' && 'whitespace-nowrap',
                    col.muted && 'text-muted-foreground',
                  ]"
                >
                  {{ col.cell(item) }}
                  <span
                    v-if="col.note && col.note(item)"
                    class="block text-xs text-muted-foreground"
                  >
                    {{ col.note(item) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <DialogFooter class="sm:justify-between">
        <p v-if="detail?.truncated" class="text-xs text-muted-foreground">
          {{ translate("common.drilldown.truncated", "Only part of the records is shown.") }}
        </p>

        <span v-else />

        <!--
          Tautan ke layar sumbernya — rute CURRENT dari backend
          (Attendance, Leave, Overtime, Roster Schedule), bukan rute
          yang dirakit di sini.
        -->
        <Button
          v-if="detail?.link"
          as-child
          variant="outline"
          size="sm"
        >
          <NuxtLink :to="detail.link">
            {{ translate("common.drilldown.openSource", `Open ${detailSourceLabel}`, { source: detailSourceLabel }) }}
            <Icon name="i-lucide-arrow-up-right" class="ml-1 size-3.5" />
          </NuxtLink>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
