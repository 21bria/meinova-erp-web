import { computed, onMounted, ref, watch } from "vue"
import { translate, resourceLabel } from "../utils/i18n"

import { useApi } from "@/composables/useApi"
import {
  periodForMode,
  periodRangeLabel,
  shiftPeriod,
} from "../utils/dashboard"

import type {
  DashboardFilter,
  DashboardPeriodMode,
  DashboardPeriodState,
  DashboardResponse,
  DashboardSchema,
  DashboardWidget,
} from "../types/dashboard"

const DEFAULT_MODES: DashboardPeriodMode[] = [
  "day",
  "week",
  "month",
  "custom",
]

export function useDashboard(schema: DashboardSchema) {
  const { request } = useApi()

  const periodFilter = computed(() => {
    return (schema.filters ?? []).find(
      (item): item is Extract<DashboardFilter, { type: "period" }> =>
        item.type === "period",
    ) ?? null
  })

  const periodModes = computed<DashboardPeriodMode[]>(() => {
    const modes = periodFilter.value?.modes

    return modes?.length ? modes : DEFAULT_MODES
  })

  // Mode awal diambil dari schema; kalau schema menyebut mode yang tidak
  // ada di daftarnya, yang menang adalah daftarnya — backend menolak
  // mode di luar `modes` juga, jadi UI tidak boleh menawarkannya.
  const initialMode: DashboardPeriodMode = (() => {
    const mode = periodFilter.value?.mode

    if (mode && periodModes.value.includes(mode)) return mode

    return periodModes.value.includes("month")
      ? "month"
      : periodModes.value[0]!
  })()

  const period = ref<DashboardPeriodState>(periodForMode(initialMode))

  // Filter bercentang menyimpan `number[]`; `useApi.buildUrl`
  // meng-`String()` nilainya jadi "1,2", dan array kosong jadi string
  // kosong yang dibuang `cleanQuery` — persis arti "tidak disaring".
  const filters = ref<Record<string, string | number | number[] | null>>({})

  const data = ref<DashboardResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /*
   * Dashboard tidak lewat generator label seperti CRUD.
   *
   * Modul CRUD memancarkan `resourceLabel("hr.employees.fields.code",
   * "Code")` ke berkas hasil generate; dashboard tidak — schema-nya
   * ditulis apa adanya sebagai JSON dan dibaca renderer saat runtime.
   * Jadi titik terjemahannya di sini: satu tempat yang dilewati SEMUA
   * widget dan filter dashboard, alih-alih menyentuh lima komponen
   * render satu per satu.
   *
   * Diselesaikan lewat `computed`, bukan sekali di awal, supaya ganti
   * bahasa langsung terlihat tanpa memuat ulang halaman.
   */
  const namespace = (schema as { i18n?: { namespace?: string } }).i18n?.namespace ?? ""

  function localize(kind: "fields" | "filters" | "empty", key: string, fallback: string) {
    if (!namespace || !key)
      return fallback

    return resourceLabel(`${namespace}.${kind}.${key}`, fallback)
  }

  const widgets = computed<DashboardWidget[]>(() => {
    return [...(schema.widgets ?? [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((widget) => {
        const localized = {
          ...widget,
          label: localize("fields", widget.key, widget.label ?? ""),
        }

        /*
         * Kolom tabel laporan memakai ruang kunci yang sama dengan
         * widget (`<namespace>.fields.<kolom>`). Kunci kolom = kode
         * metrik (`late`, `ot_regular`), jadi judul dialog rincian yang
         * dibaca dari kolom ini ikut berbahasa yang sama tanpa peta
         * kedua. `drilldown` (kode) tidak disentuh.
         */
        if (localized.type === "table" && Array.isArray(localized.columns)) {
          localized.columns = localized.columns.map(column => ({
            ...column,
            label: localize("fields", column.key, column.label ?? ""),
          }))
        }

        /*
         * `empty_text` cuma ada di widget list dan table — stat dan
         * chart tidak punya. Disentuh lewat penyempitan tipe, bukan
         * diberi nilai tanpa syarat, supaya widget yang memang tidak
         * mengenalnya tidak mendadak membawa key baru.
         */
        if ("empty_text" in localized && localized.empty_text) {
          localized.empty_text = localize(
            "empty",
            widget.key,
            localized.empty_text,
          )
        }

        return localized
      })
  })

  const lookupFilters = computed(() => {
    return (schema.filters ?? [])
      .filter(
        (item): item is Extract<DashboardFilter, { type: "lookup" }> =>
          item.type === "lookup",
      )
      .map(item => ({
        ...item,
        label: localize("filters", item.key, item.label ?? ""),
      }))
  })

  /*
   * Filter yang berdiri di kepala halaman vs yang dilipat ke panel
   * Advanced Filter.
   *
   * Tanpa `placement` semuanya "quick" — itu bawaan backend, dan itu
   * yang menjaga dashboard yang sudah ada (HR, Payroll) tidak berubah
   * tampilannya sama sekali gara-gara kunci baru ini.
   */
  const quickFilters = computed(() =>
    lookupFilters.value.filter(item => (item.placement ?? "quick") === "quick"),
  )

  const advancedFilters = computed(() =>
    lookupFilters.value.filter(item => item.placement === "advanced"),
  )

  // Berapa filter advanced yang sedang terisi — angka di badge tombolnya.
  // Tanpa itu panel yang tertutup menyembunyikan penyaringan yang sedang
  // berlaku, dan yang membaca angkanya tidak punya cara tahu.
  const activeAdvancedCount = computed(() =>
    advancedFilters.value.filter((item) => {
      const value = filters.value[item.key]

      if (Array.isArray(value)) return value.length > 0

      return value != null && value !== ""
    }).length,
  )

  // Label dihitung lokal, bukan menunggu respons — tombol periode tidak
  // boleh tertinggal satu langkah setiap kali user menggeser bulan.
  const periodLabelText = computed(() => periodRangeLabel(period.value))

  // Permintaan yang datang belakangan selalu menang. Tanpa ini, klik
  // cepat pada panah periode bisa membuat respons lama mendarat setelah
  // respons baru dan menampilkan angka periode yang bukan lagi terpilih.
  let requestId = 0

  async function load() {
    const current = ++requestId

    loading.value = true
    error.value = null

    try {
      const response = await request<
        DashboardResponse | { data: DashboardResponse }
      >(schema.endpoint, {
        query: {
          mode: period.value.mode,
          start: period.value.start,
          end: period.value.end,
          ...filters.value,
        },
      })

      if (current !== requestId) return

      // Endpoint dashboard membalas envelope `{success, message, data}`,
      // tapi `ui-schema/` membalas polos. Ditangani dua-duanya supaya
      // composable ini tidak ikut rusak kalau envelope-nya berubah.
      data.value =
        (response as { data?: DashboardResponse })?.data
        ?? (response as DashboardResponse)
    }
    catch (e: unknown) {
      if (current !== requestId) return

      const message =
        (e as { data?: { message?: string } })?.data?.message
        ?? (e as Error)?.message
        ?? translate("common.errors.loadDashboard", "Failed to load dashboard.")

      error.value = message
      data.value = null
    }
    finally {
      if (current === requestId) loading.value = false
    }
  }

  /**
   * Muat ulang **satu** widget saja, dengan parameter tambahannya
   * sendiri (halaman tabel, kotak cari).
   *
   * Bukan `load()` dengan parameter tambahan: memuat ulang seluruh
   * dashboard tiap kali orang menekan "halaman berikutnya" membuat enam
   * kartu KPI berkedip jadi kerangka lalu kembali ke angka yang sama
   * persis — terbaca seperti angkanya ikut dihitung ulang per halaman,
   * padahal periode dan filternya tidak berubah sedikit pun.
   *
   * Periode dan filter tetap ikut dikirim apa adanya. Halaman kedua dari
   * penyaringan yang berbeda bukan halaman kedua.
   */
  async function loadWidget(
    key: string,
    extra: Record<string, unknown> = {},
  ) {
    const response = await request<
      DashboardResponse | { data: DashboardResponse }
    >(schema.endpoint, {
      query: {
        mode: period.value.mode,
        start: period.value.start,
        end: period.value.end,
        ...filters.value,
        ...extra,
        widget: key,
      },
    })

    const payload =
      (response as { data?: DashboardResponse })?.data
      ?? (response as DashboardResponse)

    const value = payload?.widgets?.[key]

    if (value === undefined || !data.value) return

    // Ditulis ke tempat yang sama dengan hasil `load()` supaya tidak ada
    // dua sumber untuk widget yang sama — `load()` berikutnya menimpanya
    // apa adanya, dan tidak ada state kedua yang harus dijaga sinkron.
    data.value = {
      ...data.value,
      widgets: { ...data.value.widgets, [key]: value },
    }
  }

  function widgetData<T>(key: string): T | null {
    const value = data.value?.widgets?.[key]

    return (value ?? null) as T | null
  }

  function setPeriod(next: DashboardPeriodState) {
    period.value = next
  }

  /**
   * Ganti satuan periode. Rentangnya dijangkarkan ke tanggal mulai yang
   * sedang aktif, jadi berpindah dari "Agustus" ke "Harian" mendarat di
   * bulan yang sama — bukan melompat ke hari ini.
   */
  function setPeriodMode(mode: DashboardPeriodMode) {
    if (mode === period.value.mode) return

    if (mode === "custom") {
      period.value = { ...period.value, mode }

      return
    }

    period.value = periodForMode(mode, period.value.start)
  }

  function movePeriod(direction: number) {
    period.value = shiftPeriod(period.value, direction)
  }

  function setFilter(
    key: string,
    value: string | number | number[] | null,
  ) {
    // Field turunan ikut dikosongkan supaya tidak tertinggal nilai
    // yang tidak lagi valid setelah induknya berganti. Yang bercentang
    // dikosongkan jadi array, bukan null — bentuk nilainya harus tetap
    // sama supaya `toArray` di toolbar tidak menerima dua bentuk untuk
    // keadaan yang sama.
    const dependents = lookupFilters.value.filter(
      item => item.depends_on === key,
    )

    filters.value = {
      ...filters.value,
      [key]: value,
      ...Object.fromEntries(
        dependents.map(item => [item.key, item.multiple ? [] : null]),
      ),
    }
  }

  /**
   * Kosongkan seluruh filter lookup sekaligus.
   *
   * Periodenya **tidak** ikut dikosongkan: "tanpa periode" bukan keadaan
   * yang bisa ditampilkan laporan ini, dan Reset yang melompat ke bulan
   * berjalan mengubah angka yang sedang dibaca orang tanpa diminta.
   */
  function resetFilters() {
    filters.value = Object.fromEntries(
      lookupFilters.value.map(item => [item.key, item.multiple ? [] : null]),
    )
  }

  const hasActiveFilters = computed(() =>
    lookupFilters.value.some((item) => {
      const value = filters.value[item.key]

      if (Array.isArray(value)) return value.length > 0

      return value != null && value !== ""
    }),
  )

  watch(
    [period, filters],
    () => {
      void load()
    },
    { deep: true },
  )

  onMounted(() => {
    void load()
  })

  return {
    schema,
    period,
    periodModes,
    periodLabel: periodLabelText,
    filters,
    data,
    loading,
    error,
    widgets,
    periodFilter,
    lookupFilters,
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
  }
}
