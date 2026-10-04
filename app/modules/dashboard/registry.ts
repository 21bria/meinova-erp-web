/**
 * Penerjemah nama komponen → komponen Vue.
 *
 * Backend mengirim `component: "DashboardKpi"` sebagai **string** —
 * satu-satunya bentuk yang bisa dikirim lewat API. Berkas ini yang
 * menerjemahkannya, dan berkas ini pula satu-satunya tempat yang harus
 * disentuh saat modul baru menambahkan widget beranda: satu baris di
 * sini, satu baris di `HOME_WIDGETS` sisi backend, selesai.
 * `app/pages/index.vue` tidak perlu diubah lagi.
 *
 * **Nama yang tidak dikenal dilewati, bukan menjatuhkan halaman.**
 * Backend bisa saja lebih dulu di-deploy daripada frontend, dan beranda
 * yang blank karena satu widget baru jauh lebih buruk daripada beranda
 * yang kekurangan satu kartu. Di mode dev nama yang tidak ketemu
 * dicatat, supaya salah ketik tidak hilang tanpa jejak.
 */
import type { Component } from 'vue'

import { Bell, CircleCheckBig, Clock3 } from 'lucide-vue-next'

import ApplicationLauncher from './components/ApplicationLauncher.vue'
import DashboardApprovalStatus from './components/DashboardApprovalStatus.vue'
import DashboardFavoriteMenus from './components/DashboardFavoriteMenus.vue'
import DashboardKpi from './components/DashboardKpi.vue'
import DashboardNotifications from './components/DashboardNotifications.vue'
import DashboardQuickActions from './components/DashboardQuickActions.vue'
import DashboardWorkflow from './components/DashboardWorkflow.vue'

/*
| Kunci = nama yang dikirim backend; nilai = komponen yang merendernya.
|
| Dua kunci sengaja tidak sama dengan nama berkasnya, dan itu bukan
| kelalaian: nama di kiri adalah **kontrak API** (`HOME_WIDGETS.
| component`) yang sudah tersimpan di katalog backend, sementara yang
| di kanan adalah komponen yang hari ini bertugas merendernya.
| Mengganti nama di kiri berarti migrasi katalog di repo sebelah untuk
| perubahan yang seluruhnya soal tampilan.
|
| * `DashboardApplications` → Application Launcher (ubin ikon, bukan
|   lagi kartu besar berdeskripsi);
| * `DashboardInsights` → daftar ringkas Approval Status (dulu donut
|   selebar sepertiga halaman; di kolom kanan selebar 320px donut itu
|   tinggal potongan warna tanpa keterangan).
*/
export const HOME_WIDGET_COMPONENTS: Record<string, Component> = {
  DashboardKpi,
  DashboardFavoriteMenus,
  DashboardQuickActions,
  DashboardInsights: DashboardApprovalStatus,
  DashboardNotifications,
  DashboardWorkflow,
  DashboardApplications: ApplicationLauncher,
}

/**
 * Widget yang pindah ke kolom utility di kanan, berikut keadaan
 * bawaannya saat beranda pertama kali dibuka.
 *
 * Urutan di sini **yang menentukan urutan kartunya** — bukan `order`
 * dari backend. Ketiganya berdiri di kolom sempit yang isinya tetap;
 * menyusun ulang tiga kartu setinggi 40px tidak menjawab kebutuhan
 * siapa pun, sementara "Recent Documents paling bawah dan terbuka"
 * adalah hal yang dicari orang di tempat yang sama tiap hari.
 *
 * `title` adalah **kunci i18n**, bukan judul dari backend: judul di
 * katalog backend hanya ada dalam satu bahasa.
 *
 * `component` disebut langsung di sini, tidak lewat
 * `resolveWidgetComponent`: kartunya harus tetap berdiri saat katalog
 * layout belum selesai dimuat, dan saat itu belum ada satu pun nama
 * komponen yang bisa diterjemahkan. Komponennya sama persis dengan
 * yang terdaftar di peta di atas.
 */
export interface UtilityWidgetMeta {
  /** Kode widget, sama dengan `HOME_WIDGETS.code` di backend. */
  code: string
  /** **Kunci i18n** judulnya, bukan judulnya sendiri. */
  title: string
  icon: Component
  component: Component
  defaultOpen: boolean
}

/*
 * Tipenya disebut, bukan `as const`.
 *
 * Tanpa itu `component` bertipe union tiga komponen konkret sekaligus,
 * dan `v-bind` berisi prop yang dirakit runtime (`propsFor`) harus
 * cocok dengan **ketiganya** — `vue-tsc` menolaknya di `index.vue`.
 * Yang dibutuhkan pemanggilnya memang cuma "sebuah komponen".
 */
export const UTILITY_WIDGETS: UtilityWidgetMeta[] = [
  {
    code: 'approval_chart',
    title: 'home.utility.approval',
    icon: CircleCheckBig,
    component: DashboardApprovalStatus,
    defaultOpen: false,
  },
  {
    code: 'notifications',
    title: 'home.utility.notifications',
    icon: Bell,
    component: DashboardNotifications,
    defaultOpen: false,
  },
  {
    code: 'recent_documents',
    title: 'home.utility.recentDocuments',
    icon: Clock3,
    component: DashboardWorkflow,
    defaultOpen: true,
  },
]

/**
 * Kode yang **tidak** ikut dirender di kolom kiri.
 *
 * Satu daftar untuk dua keperluan sekaligus (menyusun kolom kanan dan
 * menyaring kolom kiri): dua daftar terpisah berarti satu hari nanti
 * ada widget yang muncul dua kali di halaman yang sama.
 */
export const UTILITY_CODES: string[] = UTILITY_WIDGETS.map(item => item.code)

export function resolveWidgetComponent(name: string): Component | null {
  const component = HOME_WIDGET_COMPONENTS[name]

  if (!component) {
    if (import.meta.dev) {
      console.warn(
        `[dashboard] Komponen "${name}" tidak terdaftar di registry.ts — `
        + `widget-nya dilewati.`,
      )
    }

    return null
  }

  return component
}

/**
 * `span` dari backend memakai grid 12 kolom. Tailwind tidak bisa
 * menerima kelas yang dirakit saat runtime (`col-span-${n}` ter-purge),
 * jadi pemetaannya ditulis penuh — sama seperti `spanClass` milik
 * dashboard modul.
 */
const SPAN_CLASS: Record<number, string> = {
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  6: 'lg:col-span-6',
  8: 'lg:col-span-8',
  9: 'lg:col-span-9',
  12: 'lg:col-span-12',
}

export function widgetSpanClass(span?: number): string {
  return SPAN_CLASS[span ?? 12] ?? SPAN_CLASS[12]!
}

/**
 * Tinggi tetap untuk widget yang menyatakannya di katalog.
 *
 * Tanpa ini tinggi tiap kartu mengikuti isinya sendiri, dan tiga kartu
 * berjejer jadi tiga tinggi berbeda — Notifications yang kosong tinggal
 * seperempat tinggi tetangganya, dan barisnya terbaca seperti ada yang
 * gagal dimuat.
 *
 * Hanya `lg` ke atas: di layar sempit ketiganya bertumpuk, dan kotak
 * bergulir di dalam halaman yang juga bergulir adalah hal yang paling
 * menjengkelkan di ponsel.
 */
export function widgetHeightClass(fixedHeight?: boolean): string {
  return fixedHeight ? "lg:h-[26rem]" : ""
}
