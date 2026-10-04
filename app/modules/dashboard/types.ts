import type { Component } from 'vue'

export interface DashboardKpi {
  code: string
  title: string
  value: string | number
  /** Layar yang menghasilkan angka ini. */
  href?: string
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon?: Component
  /** Warna teks ikon, dari `app/registry/color.ts`. */
  color?: string
  /**
   * Latar + teks untuk ikon berlatar bulat (`bg-… text-…`).
   *
   * Terpisah dari `color` karena keduanya dipakai di tempat berbeda:
   * kartu KPI memakai latar, sementara pemakai lain masih memakai ikon
   * telanjang berwarna.
   */
  badge?: string
}

export interface DashboardChart {
  code: string
  title: string
  type:
    | 'area'
    | 'line'
    | 'bar'
    | 'column'
    | 'donut'
    | 'mixed'

  height?: number

  categories?: (string | number)[]

  series: any[]

  /**
   * Kode stabil tiap irisan, sejajar dengan `series`/`categories`.
   *
   * Dipakai kartu Approval Status untuk menerjemahkan labelnya
   * (`common.status.<kode>`) dan menentukan warna titiknya. Chart donut
   * tidak memerlukannya.
   */
  codes?: string[]

  /** Jumlah seluruh irisan — dipakai donut. */
  total?: number

  colors?: string[]
}

export interface FavoriteMenu {
  code: string
  title: string
  /** Nama grup menunya ("Attendance & Leave"), bukan nama modul. */
  description?: string
  href: string
  icon?: Component
  color?: string
  badge?: string
  /** Dipilih pengguna jadi pintasan beranda. */
  favorite: boolean
  is_visible?: boolean
  position: number
}

export interface FavoriteApplication {
  code: string
  title: string
  /**
   * Masih dikirim backend, tapi **tidak** ditampilkan launcher: nama
   * aplikasi saja yang berdiri di bawah ikonnya.
   */
  description?: string
  href: string
  icon?: Component
  /** Token `vivid` dari `colorRegistry`: titik henti gradien ubinnya. */
  color?: string
  /** Token `glow`: bayangan bersemu warna ubinnya. */
  glow?: string
  badge?: string
  /** `FavoriteApp.Status` di backend: ACTIVE / BETA / COMING_SOON / … */
  status?: string

  /**
   * Pengguna ini boleh membuka modulnya (`MenuAccessService` di
   * backend). `false` = ubinnya tampil kelabu dan tidak bisa ditekan.
   *
   * **Penanda tampilan, bukan penjagaan.** Yang menolak akses tetap
   * backend: menu permission, DataScope, dan permission tiap endpoint.
   */
  accessible?: boolean

  /**
   * Modulnya sendiri sudah jalan (`FavoriteApp.Status` ACTIVE/BETA).
   *
   * Dipisah dari `accessible` karena sebabnya berbeda: "Segera hadir"
   * berlaku untuk semua orang termasuk superuser, dan menyatukannya
   * dengan hak akses membuat pengguna mengejar admin untuk izin ke
   * modul yang memang belum ada isinya.
   */
  available?: boolean
  favorite: boolean
  position: number
}

export interface QuickAction {
  /** Dipilih pengguna untuk tampil di beranda. */
  selected?: boolean
  code: string
  title: string
  description?: string
  href: string
  icon?: Component
  color?: string
}

export interface NotificationItem {
  id: string
  title: string
  description?: string
  type:
    | 'info'
    | 'success'
    | 'warning'
    | 'error'

  href?: string

  /** Sudah diringkas jadi "Today" / "12 Aug" oleh `shortDay()`. */
  created_at: string

  is_read: boolean
}

export interface WorkflowItem {
  id: string

  title: string

  document_number?: string

  module: string

  requester: string

  /**
   * Label yang sudah diterjemahkan dari kode `InstanceStatus`
   * ("pending" → "Pending"). Sengaja string bebas: modul baru boleh
   * membawa status yang belum ada di daftar ini tanpa memutus tipe.
   *
   * Dipakai sebagai **cadangan** saja — yang menentukan bunyi dan warna
   * badge adalah `status_code`.
   */
  status: string

  /**
   * Kode mentah dari API (`pending`, `approved`, …).
   *
   * Warna badge dan terjemahannya dicocokkan ke kode ini, bukan ke
   * `status`: label yang sudah diterjemahkan tidak pernah cocok lagi
   * dengan `'Approved'` begitu bahasanya berganti.
   */
  status_code: string

  created_at: string
}

export interface DashboardWorkspace {
  kpis: DashboardKpi[]

  charts: DashboardChart[]

  favoriteMenus: FavoriteMenu[]

  favoriteApps: FavoriteApplication[]

  quickActions: QuickAction[]

  notifications: NotificationItem[]

  workflows: WorkflowItem[]
}
/**
 * Satu widget beranda: apa yang ada di katalog, plus keadaannya bagi
 * pengguna ini.
 *
 * `component` adalah **nama** komponen, bukan komponennya — backend
 * tidak bisa mengirim komponen Vue. Yang menerjemahkannya
 * `HOME_WIDGETS` di `registry.ts`; nama yang tidak dikenal dilewati,
 * bukan menjatuhkan halaman.
 */
export interface DashboardWidgetCard {
  code: string
  title: string
  description: string
  component: string

  /** Grid 12 kolom, ditentukan katalog dan tidak bisa diubah pengguna. */
  span: number

  /** Tingginya dikunci di layar lebar; isinya yang menggulir. */
  fixed_height?: boolean

  position: number
  is_visible: boolean
  is_collapsed: boolean

  /**
   * Pengaturan khusus widget (mis. `codes` milik Quick Actions).
   *
   * Dikembalikan apa adanya oleh backend dan dikirim balik utuh saat
   * menyimpan — tanpa itu, menyimpan susunan akan menghapus pengaturan
   * widget yang tidak dikenal halaman beranda.
   */
  config?: Record<string, unknown>
}

/** Bentuk yang dikirim balik saat menyimpan susunan. */
export interface DashboardLayoutItem {
  code: string
  is_visible: boolean
  is_collapsed: boolean
  config?: Record<string, unknown>
}

/**
 * Sorotan hari ini di kepala beranda: ulang tahun, ulang tahun kerja,
 * hari libur.
 *
 * `kind` sengaja string bebas, bukan union tertutup: modul baru boleh
 * menambah jenis sorotan tanpa memutus tipe ini, dan yang tidak dikenal
 * jatuh ke ikon bawaan.
 */
export interface DashboardHighlight {
  kind: string
  title: string
  subtitle: string
  icon?: string
}
