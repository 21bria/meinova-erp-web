// framework/core/types/dashboard.ts
//
// Bentuk schema `schema_type: "dashboard"` dari backend
// (`apps/framework/builders/dashboard.py`). Key-nya snake_case karena
// dikirim apa adanya oleh Django — jangan di-camelCase-kan di sini,
// nanti tidak cocok lagi saat schema diregenerate.

export type DashboardFormat =
  | "number"
  | "percent"
  | "currency"
  | "duration"
  | "date"
  // Tanggal **beserta jamnya**. Dipakai daftar aktivitas: jejak audit
  // yang tiga barisnya jatuh di hari yang sama tidak memberi tahu
  // apa-apa tanpa jam.
  | "datetime"
  // Nilainya dirender sebagai badge berwarna, warnanya diambil dari
  // `state` pada baris yang sama ("success" | "warning" | "danger").
  // Formatnya sendiri tidak mengubah teks — yang berubah cuma
  // tampilannya, dan itu memang yang dibutuhkan daftar berstatus.
  | "status"
  | "text"

export interface DashboardTrend {
  value: number
  direction: "up" | "down"
  period: string
}

interface DashboardWidgetBase {
  key: string
  label?: string
  description?: string
  span?: number
  order?: number
  permission?: string
}

export interface DashboardStatWidget extends DashboardWidgetBase {
  type: "stat"
  icon?: string
  format?: DashboardFormat
  precision?: number
  trend?: boolean
}

export interface DashboardChartWidget extends DashboardWidgetBase {
  type: "chart"
  chart: "line" | "bar" | "donut" | "area"
  x_label?: string
  y_label?: string
  y_format?: DashboardFormat
  stacked?: boolean
  // Batang mendatar tetap bawaan — seluruh bar chart yang sudah ada
  // adalah distribusi berlabel panjang. Chart deret waktu yang
  // menyebutnya `false` yang berdiri tegak.
  horizontal?: boolean
  /*
   * Ringkasan kecil di kanan judul (Total, atau nilai titik terakhir).
   * `false` mematikannya — untuk chart yang jumlah deretnya memang
   * bukan angka yang berarti apa pun, seperti komposisi yang memuat
   * sisi penghasilan dan sisi potongan sekaligus.
   *
   * Kosong = tampil, sama dengan perilaku sebelum kunci ini ada.
   */
  summary?: boolean
}

export interface DashboardListColumn {
  key: string
  label: string
  format?: DashboardFormat
}

export interface DashboardListWidget extends DashboardWidgetBase {
  type: "list"
  columns?: DashboardListColumn[]
  empty_text?: string
  link?: string
  limit?: number
}

export interface DashboardTableColumn extends DashboardListColumn {
  /*
   * Nama metrik di backend (`apps/reports/api/hr/period_summary/
   * metrics.py`). Kolom yang menyebutkannya bisa ditekan untuk membuka
   * rincian sumbernya; kolom identitas sengaja tidak punya.
   */
  drilldown?: string
  // Satuan pendek di belakang angka ("x", "h"). Bukan bagian format:
  // yang dicari pembaca laporan adalah "11h", bukan "11 jam".
  suffix?: string
  /*
   * Lebar kolom terkunci, dalam piksel. Hanya berlaku untuk kolom yang
   * masuk `sticky_columns` — sisanya diatur browser. Yang tidak
   * menyebutkannya memakai lebar bawaan, jadi tabel lama tidak berubah.
   */
  width?: number
}

/*
 * Tabel lebar — bentuk laporan, bukan dashboard.
 *
 * Sengaja tipe tersendiri dan bukan `list` berkolom banyak:
 * `MDashboardList` memampatkan barisnya jadi judul + keterangan +
 * beberapa angka di kanan karena kartunya sempit, dan laporan justru
 * dibaca per kolom.
 */
export interface DashboardTableWidget extends DashboardWidgetBase {
  type: "table"
  columns?: DashboardTableColumn[]
  empty_text?: string

  /*
   * Label penghitung baris di kanan atas kartu. Bawaannya "Pegawai" —
   * benar untuk laporan yang satu barisnya satu pegawai, salah untuk
   * tabel agregat seperti Manpower Summary yang satu barisnya satu
   * kelompok organisasi.
   */
  total_label?: string
  // Jumlah kolom pertama yang ikut terkunci saat digeser mendatar.
  sticky_columns?: number

  /*
   * Paginasi **sisi server** (`apps/framework/tables.py`). Ada nilainya
   * = tabelnya dipaginasi; halaman berikutnya diminta ulang ke backend,
   * bukan diiris dari daftar yang sudah di tangan.
   *
   * Yang dipotong hanya tabelnya. KPI, chart, dan baris Total tetap
   * dihitung dari seluruh dataset yang lolos filter, jadi pindah halaman
   * tidak menggeser satu angka pun di luar tabel.
   */
  page_size?: number
  page_size_options?: number[]

  // Kotak cari di kepala tabel. **Bukan** filter laporan: ia hanya
  // menyaring baris tabelnya dan tidak menyentuh KPI/chart.
  searchable?: boolean
  search_placeholder?: string
}

export type DashboardWidget =
  | DashboardStatWidget
  | DashboardChartWidget
  | DashboardListWidget
  | DashboardTableWidget

/*
 * Satuan periode. Backend (`apps/framework/periods.py`) menerima
 * keenamnya; `modes` pada schema yang menentukan mana saja yang boleh
 * dipilih user di satu dashboard.
 */
export type DashboardPeriodMode =
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year"
  | "custom"

export interface DashboardPeriodFilter {
  key: string
  type: "period"
  label?: string
  // Mode yang aktif saat halaman pertama dibuka.
  mode?: DashboardPeriodMode
  modes?: DashboardPeriodMode[]
  default?: string
}

export interface DashboardLookupFilter {
  key: string
  type: "lookup"
  label?: string
  lookup_endpoint: string
  depends_on?: string
  lookup_params?: Record<string, unknown>
  // Daftar centang. Nilainya jadi `number[]` dan dikirim `?key=1,2`;
  // tidak ada yang dicentang = tanpa penyaringan, bukan tanpa hasil.
  multiple?: boolean
  /*
   * "quick" berdiri di kepala halaman, "advanced" masuk panel Advanced
   * Filter. Dialek yang sama dengan filter CRUD (`FilterPlacement` di
   * `framework/builders/filters/types.ts`).
   *
   * Kosong = "quick", sama dengan bawaan backend: sebelum kunci ini ada,
   * seluruh filter dashboard memang berdiri di kepala halaman, dan
   * dashboard yang sudah ada tidak boleh berubah tampilannya gara-gara
   * kunci baru.
   */
  placement?: "quick" | "advanced"
  /*
   * Tombol pintas satu-tekan yang mengisi filter ini dari profil
   * penggunanya, ditulis dengan dialek `$me.<jalur>` yang sama dengan
   * schema form. Tidak menyala sendiri saat halaman dibuka — angka
   * pertama yang dilihat orang harus angka utuh.
   *
   * Nilainya boleh **satu angka atau daftar**, dan yang memutuskan
   * backend: `$me.data_scope.self_filter.location` berisi lokasi
   * penempatan untuk hampir semua orang, dan seluruh lokasi dalam
   * cakupannya untuk direksi. Frontend tidak perlu tahu siapa yang
   * direksi — kalau aturannya ditulis di sini, ia akan menyimpang dari
   * cakupan yang ditegakkan backend tanpa ada yang menyadarinya.
   */
  self_filter?: string
  self_filter_label?: string
}

export type DashboardFilter =
  | DashboardPeriodFilter
  | DashboardLookupFilter

export interface DashboardSchema {
  module: string
  type: "dashboard"
  title: string
  slug?: string
  entity?: string
  description?: string | null
  endpoint: string
  columns?: number
  filters?: DashboardFilter[]
  widgets?: DashboardWidget[]

  /*
   * Namespace katalog terjemahan, mis. `reports.hr.manpower-summary`.
   * Diturunkan backend dari `framework_module`; dipakai `useDashboard`
   * untuk menyelesaikan label widget dan filter saat render. Dashboard
   * lama yang schema-nya belum memuatnya tetap memakai label Inggris.
   */
  i18n?: { namespace?: string }
}

/*
|--------------------------------------------------------------------------
| Data
|--------------------------------------------------------------------------
| Satu request mengembalikan seluruh widget sekaligus; `widgets` di-key
| dengan `widget.key` yang sama dengan schema.
*/

export interface DashboardStatData {
  // null berarti belum ada data pada periode itu — bukan nol. Dibedakan
  // supaya kartu bisa menampilkan "—" alih-alih angka 0 yang menyesatkan.
  value: number | null
  trend?: DashboardTrend | null
}

export interface DashboardSeriesPoint {
  label: string
  value: number | null
  percentage?: number
  color?: string
}

export interface DashboardDataset {
  label: string
  data: (number | null)[]
  color?: string
}

/**
 * Dua bentuk, dan kuncinya sengaja berbeda.
 *
 * `series` — satu deret `{label, value}`, bentuk yang dipakai hampir
 * semua widget. `datasets` + `categories` — banyak deret, untuk chart
 * bertumpuk. Memaksakan keduanya ke satu kunci berarti pembacanya harus
 * menebak bentuk dari isinya, dan tebakan itu meleset tepat saat salah
 * satu deretnya kosong.
 */
export interface DashboardChartData {
  series?: DashboardSeriesPoint[]
  categories?: string[]
  datasets?: DashboardDataset[]
  total?: number
  year?: number
}

export interface DashboardListData {
  items: Record<string, unknown>[]
  total?: number
  /*
   * Tujuan tombol "Lihat Semua", **dihitung backend**.
   *
   * `DashboardListWidget.link` di schema tetap ada dan tetap dipakai
   * kalau ini kosong. Yang tidak bisa dilayani schema adalah tujuan
   * yang bergantung pada data: "buka payroll run yang sedang dibaca"
   * berisi id yang baru diketahui saat resolvernya jalan, dan schema
   * dikirim sekali lalu di-generate jadi file statis di frontend.
   */
  link?: string
}

/*
 * Baris daftar boleh membawa `link` sendiri (`row.link`), dan barisnya
 * jadi bisa ditekan. Dipakai daftar temuan: "2 pegawai belum punya
 * Payroll Assignment" tidak berguna kalau yang membacanya harus
 * mencari sendiri run mana yang dimaksud.
 *
 * Tidak ada di tipe barisnya karena baris daftar memang
 * `Record<string, unknown>` — kolomnya ditentukan schema, bukan tipe.
 */

export interface DashboardTableData {
  items: Record<string, unknown>[]
  /*
   * Seluruh baris yang lolos **filter laporan** — angka yang sama yang
   * dihitung KPI, bukan jumlah baris yang sedang terlihat. Tetap sama
   * saat halaman digeser maupun saat ada yang diketik di kotak cari.
   */
  total?: number
  // Baris jumlah di kaki tabel, di-key dengan `column.key`. Ikut
  // `total`, bukan `matched`: ia menjawab "berapa seluruhnya pada filter
  // ini", bukan "berapa yang kebetulan terlihat".
  totals?: Record<string, number>

  // Yang lolos kotak cari; dasar penghitungan jumlah halaman. Sama
  // dengan `total` selama kotak carinya kosong.
  matched?: number
  page?: number
  page_size?: number
  page_count?: number
  search?: string
}

/*
|--------------------------------------------------------------------------
| Drill-down
|--------------------------------------------------------------------------
| Balasan `<endpoint>drilldown/?metric=&employee_id=`. Isinya baris yang
| **dipakai menyusun** angkanya, bukan query baru yang kebetulan mirip —
| kalau keduanya bisa berbeda, rinciannya berhenti jadi bukti.
*/

/*
| Kunci bertanda "audit" adalah perluasan aditif: semuanya **kode stabil**
| atau nilai authoritative dari backend. Frontend cuma memformat —
| durasi tidak pernah dihitung dari selisih jam di sini.
*/
export type DashboardDrilldownUnit = "occurrence" | "day" | "hour" | "minute"

export type DashboardDrilldownSource = "attendance" | "leave" | "overtime" | "roster"

export type DashboardDrilldownKind =
  | "late"
  | "early"
  | "attendance_day"
  | "leave"
  | "overtime"
  | "roster"

export interface DashboardDrilldownItem {
  employee: string
  employee_id?: number
  employee_number?: string
  location?: string
  date: string
  value: number
  detail?: string
  reference?: string
  status?: string
  record_id?: number | null
  // audit
  source_code?: DashboardDrilldownSource
  quantity?: number
  row_unit?: DashboardDrilldownUnit
  detail_code?: string
  scheduled_time?: string | null
  actual_time?: string | null
  start_time?: string | null
  end_time?: string | null
  duration_minutes?: number | null
  excused_minutes?: number
  reason?: string
  range_start?: string | null
  range_end?: string | null
}

export interface DashboardDrilldownData {
  metric: string
  label: string
  unit: "days" | "hours"
  source?: string
  link?: string
  count: number
  total: number
  truncated?: boolean
  items: DashboardDrilldownItem[]
  // audit
  source_code?: DashboardDrilldownSource
  detail_kind?: DashboardDrilldownKind
  aggregate?: { value: number, unit: DashboardDrilldownUnit }
  occurrences?: number
  duration_minutes?: number | null
  duration_complete?: boolean
  employee?: { id: number, name: string, number: string } | null
}

/**
 * Rentang yang dipilih di UI. `start`/`end` selalu ISO `YYYY-MM-DD`
 * tanpa komponen jam — periode dashboard adalah tanggal kalender, dan
 * memasukkan zona waktu ke dalamnya hanya memindahkan batas harinya.
 */
export interface DashboardPeriodState {
  mode: DashboardPeriodMode
  start: string
  end: string
}

export interface DashboardPeriod extends DashboardPeriodState {
  // Tetap dikirim backend untuk pemanggil lama & chart per tahun.
  year: number
  month: number
  label?: string
  days?: number
  compare_label?: string
  previous?: {
    start: string
    end: string
    label?: string
  }
}

export interface DashboardResponse {
  period: DashboardPeriod
  widgets: Record<string, unknown>
}
