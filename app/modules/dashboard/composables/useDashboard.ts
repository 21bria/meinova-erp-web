import {
  mapCharts,
  mapHighlights,
  mapFavoriteApps,
  mapFavoriteMenus,
  mapKpis,
  mapNotifications,
  mapQuickActions,
  mapWorkflows,
} from '../mapper'
import { apiErrorMessage } from '@framework'

import { useDashboardApi } from './useDashboardApi'

import type { DashboardWidgetCard } from '../types'

export function useDashboard() {
  const {
    getSummary,
    getLayout,
    saveLayout,
    resetLayout,
    getAppCatalog,
    saveFavoriteApps,
    getMenuCatalog,
    saveFavoriteMenus,
  } = useDashboardApi()

  const isLoading = ref(false)
  const isCustomizing = ref(false)
  const error = ref<string | null>(null)

  /**
   * Susunan beranda: urutan, tampil/tidak, terlipat/tidak.
   *
   * Sebelumnya dimuat lalu **tidak dipakai sama sekali** —
   * `index.vue` merender delapan komponen tetap dalam urutan tetap,
   * dan tabelnya sudah berisi dua belas baris yang tidak pernah
   * memengaruhi apa pun.
   */
  const layout = ref<DashboardWidgetCard[]>([])

  // Semuanya berangkat kosong dan diisi API.
  //
  // Sebelumnya lima di antaranya berangkat dari `dashboardDummy` —
  // "Active Employees 248" di tenant berisi 10 orang, dan angka yang
  // sama persis untuk setiap orang yang login. Kosong sesaat lalu
  // terisi data sungguhan lebih jujur daripada angka yang tidak pernah
  // menunjuk apa pun.
  const workspace = ref({
    highlights: [] as any[],
    kpis: [] as any[],
    charts: [] as any[],

    favoriteMenus: [] as any[],
    favoriteApps: [] as any[],

    quickActions: [] as any[],
    notifications: [] as any[],
    workflows: [] as any[],
  })

  /**
   * Saat menyusun, seluruh katalog ditampilkan — yang belum dipilih
   * tampil pudar dengan tombol bintang. Kalau yang tampil cuma yang
   * sudah dipilih, tidak ada cara menambahkan yang belum, dan itu
   * keadaan bagian Applications selama ini: kosong, tanpa jalan keluar.
   */
  /**
   * Launcher menampilkan **seluruh katalog**, bukan cuma yang bisa
   * dibuka: modul yang tidak boleh diakses pengguna ini (atau yang
   * memang belum jalan) ikut tampil, kelabu dan tidak bisa ditekan.
   *
   * Sebelumnya keduanya dibuang backend, dan pegawai yang hanya
   * berhak atas HR + Workflow membuka beranda dan menemukan dua ikon
   * di kanvas kosong — ERP-nya terbaca seperti produk yang isinya cuma
   * dua modul.
   *
   * Yang bisa disembunyikan pengguna lewat Customize tetap hanya yang
   * bisa ia buka (`favorite`); yang kelabu tidak punya bintang, jadi
   * tidak ada keadaan "disembunyikan" yang perlu dihormati untuknya.
   */
  const favoriteApps = computed(() =>
    isCustomizing.value
      ? workspace.value.favoriteApps
      : workspace.value.favoriteApps.filter(item =>
          item.accessible === false
          || item.available === false
          || item.favorite !== false,
        ),
  )

  /**
   * Pintasan: saat menyusun tampil seluruh katalog (yang belum dipilih
   * pudar dengan tombol bintang), di luar itu hanya yang dipilih.
   *
   * Alasan yang sama dengan Applications dan Quick Actions: kalau yang
   * tampil cuma yang terpilih, tidak ada cara menambahkan yang belum —
   * dan itu keadaan bagian ini selama ini. Barisnya hanya bisa lahir
   * dari seed, drag-nya menyusun state lokal yang hilang begitu halaman
   * dimuat ulang.
   */
  const favoriteMenus = computed(() =>
    isCustomizing.value
      ? workspace.value.favoriteMenus
      : workspace.value.favoriteMenus.filter(item => item.favorite !== false),
  )

  function toggleFavoriteMenu(code: string) {
    workspace.value.favoriteMenus = workspace.value.favoriteMenus.map(item =>
      item.code === code
        ? { ...item, favorite: !item.favorite }
        : item,
    )
  }

  /**
   * Pintasan: saat menyusun tampil semuanya (yang belum dipilih pudar
   * dengan tombol bintang), di luar itu hanya yang dipilih.
   *
   * Alasan yang sama dengan Applications: kalau yang tampil cuma yang
   * terpilih, tidak ada cara menambahkan yang belum.
   */
  const quickActions = computed(() =>
    isCustomizing.value
      ? workspace.value.quickActions
      : workspace.value.quickActions.filter(item => item.selected !== false),
  )

  function toggleQuickAction(code: string) {
    workspace.value.quickActions = workspace.value.quickActions.map(item =>
      item.code === code
        ? { ...item, selected: !item.selected }
        : item,
    )
  }

  /**
   * Saat menyusun, **seluruh** widget ditampilkan — yang disembunyikan
   * tampil pudar dengan tombol mata. Kalau yang tampil cuma yang
   * terpilih, tidak ada cara mengembalikan yang sudah disembunyikan,
   * dan penggunanya kehilangan widget itu untuk selamanya.
   */
  const visibleWidgets = computed(() =>
    isCustomizing.value
      ? layout.value
      : layout.value.filter(item => item.is_visible !== false),
  )

  /**
   * Envelope `{success, message, data}` dibongkar di sini.
   *
   * Beranda memakainya, endpoint favorit di sebelahnya tidak — jadi
   * dibongkar per pemanggil, bukan di `useApi`, supaya yang lain tidak
   * ikut berubah.
   */
  function unwrap(response: any): DashboardWidgetCard[] {
    const rows = Array.isArray(response) ? response : response?.data

    return Array.isArray(rows) ? rows : []
  }

  function indexOf(code: string): number {
    return layout.value.findIndex(item => item.code === code)
  }

  /**
   * Geser satu widget satu posisi.
   *
   * Dipakai tombol naik/turun **dan** hasil tarikan drag. Di ponsel
   * drag bertabrakan dengan gulir halaman dan selalu terasa rusak, jadi
   * tombolnya bukan pelengkap — di layar sempit justru itu satu-satunya
   * cara menyusun.
   *
   * `scope` menyebut kode widget yang berdiri di kolom yang sama.
   * Sejak Approval/Notifications/Recent Documents pindah ke kolom
   * kanan, `layout` memuat widget dari **dua** kolom sekaligus —
   * tanpa penyaring ini tombol "naik" pada Quick Actions bisa
   * menukarnya dengan widget yang dirender di kolom sebelah, dan yang
   * terlihat di layar cuma tombol yang tidak melakukan apa-apa.
   * Tetangga di luar kolomnya dilewati, bukan dihitung.
   */
  function moveWidget(code: string, direction: -1 | 1, scope?: string[]) {
    const from = indexOf(code)

    if (from < 0) return

    const list = layout.value

    let to = from + direction

    // Penyaring kolom dikeluarkan dari syarat perulangan: `scope` tidak
    // pernah berubah di dalamnya, dan menuliskannya di sana membuat
    // eslint (benar) membaca ini sebagai perulangan yang syaratnya
    // tidak bisa berubah.
    if (scope) {
      while (to >= 0 && to < list.length && !scope.includes(list[to]!.code))
        to += direction
    }

    if (to < 0 || to >= list.length) return

    // Ditukar, bukan disisipkan: yang dilewati di atas memang harus
    // tetap di tempatnya. Untuk tetangga yang langsung bersebelahan
    // (satu-satunya kemungkinan saat `scope` tidak disebut) hasil
    // keduanya sama persis.
    const next = [...list]

    const moved = next[from]!

    next[from] = next[to]!
    next[to] = moved

    layout.value = next.map((item, position) => ({ ...item, position }))
  }

  function toggleWidgetVisible(code: string) {
    layout.value = layout.value.map(item =>
      item.code === code
        ? { ...item, is_visible: !item.is_visible }
        : item,
    )
  }

  function toggleWidgetCollapsed(code: string) {
    layout.value = layout.value.map(item =>
      item.code === code
        ? { ...item, is_collapsed: !item.is_collapsed }
        : item,
    )
  }

  /**
   * Menyimpan **seluruh** susunan beranda: widget, aplikasi, pintasan.
   *
   * Satu tombol Save untuk ketiganya. Sebelumnya cuma widget + quick
   * action yang tersimpan — `saveWorkspace` yang menyimpan pilihan
   * Applications diekspor tapi **tidak pernah dipanggil siapa pun**,
   * jadi bintang yang ditekan orang hilang begitu halaman dimuat ulang,
   * tanpa satu pun pesan.
   *
   * Disimpan saat menekan Done, bukan tiap geseran: satu tarikan drag
   * menghasilkan puluhan perubahan posisi, dan menyimpan tiap perubahan
   * berarti puluhan request untuk satu gerakan — plus susunan setengah
   * tersimpan kalau salah satunya gagal.
   */
  async function persistLayout() {
    try {
      const saved = await saveLayout(
        layout.value.map(item => ({
          code: item.code,
          is_visible: item.is_visible,
          is_collapsed: item.is_collapsed,

          // Pengaturan khusus widget ikut kiriman yang sama, jadi
          // seluruh beranda tetap satu tombol Save. Untuk Quick
          // Actions isinya pintasan yang dipilih **beserta urutannya**;
          // widget lain mengirim `config` apa adanya supaya pengaturan
          // yang tidak dikenal halaman ini tidak ikut terhapus.
          config: item.code === 'quick_actions'
            ? {
                ...(item.config ?? {}),
                codes: workspace.value.quickActions
                  .filter(action => action.selected !== false)
                  .map(action => action.code),
              }
            : item.config,
        })),
      )

      // Hasil simpan yang dipakai, bukan keadaan lokal: backend yang
      // menentukan posisi akhir, dan membiarkan keduanya berbeda
      // membuat tampilan setelah simpan tidak sama dengan setelah muat
      // ulang.
      layout.value = unwrap(saved)

      // Ketiganya berurutan, bukan `Promise.all`: kalau salah satu gagal
      // yang sudah tersimpan tetap tersimpan, dan pesannya menyebut
      // bagian yang gagal — bukan "gagal menyimpan" untuk seluruh
      // beranda padahal dua pertiganya berhasil.
      await persistFavoriteApps()
      await persistFavoriteMenus()

      isCustomizing.value = false
    }
    catch (err: any) {
      error.value = apiErrorMessage(err, 'Gagal menyimpan susunan beranda')
    }
  }

  async function persistFavoriteApps() {
    const codes = workspace.value.favoriteApps
      .filter(item => item.favorite !== false)
      .map(item => item.code)

    const saved = await saveFavoriteApps(codes)

    const rows = Array.isArray(saved) ? saved : []

    const chosen = new Set(rows.map((item: any) => item.app_code))

    // Yang tidak dipilih tetap disimpan di state (pudar), bukan dibuang:
    // mode Customize harus tetap bisa memunculkannya lagi tanpa memuat
    // ulang katalognya.
    workspace.value.favoriteApps = [
      ...mapFavoriteApps(rows),
      ...workspace.value.favoriteApps
        .filter(item => !chosen.has(item.code))
        .map(item => ({ ...item, favorite: false })),
    ]
  }

  async function persistFavoriteMenus() {
    const codes = workspace.value.favoriteMenus
      .filter(item => item.favorite !== false)
      .map(item => item.code)

    const saved = await saveFavoriteMenus(codes)

    const rows = Array.isArray(saved) ? saved : []

    const chosen = new Set(rows.map((item: any) => item.menu_code))

    workspace.value.favoriteMenus = [
      ...mapFavoriteMenus(rows),
      ...workspace.value.favoriteMenus
        .filter(item => !chosen.has(item.code))
        .map(item => ({ ...item, favorite: false })),
    ]
  }

  async function restoreDefaultLayout() {
    try {
      layout.value = unwrap(await resetLayout())
    }
    catch (err: any) {
      error.value = apiErrorMessage(err, 'Gagal mengembalikan susunan bawaan')
    }
  }

  async function loadDashboard() {
    isLoading.value = true
    error.value = null

    try {
      const [
        summaryRes,
        layoutRes,
        favoriteAppsRes,
        favoriteMenusRes,
      ] = await Promise.all([
        getSummary(),
        getLayout(),
        // Katalog, bukan daftar favorit: satu request memberi kedua
        // keadaan sekaligus (semua aplikasi + mana yang dipilih), jadi
        // masuk mode Customize tidak perlu menembak API lagi.
        getAppCatalog(),
        // Sama alasannya: katalog menu, bukan daftar pintasan. Satu
        // request memberi seluruh menu yang boleh dilihat pengguna
        // **beserta** mana yang sudah dipilihnya.
        getMenuCatalog(),
      ])

      // Beranda memakai envelope `{success, message, data}`; endpoint
      // favorit/katalog di sebelahnya tidak. Dibongkar di sini, bukan di
      // `useApi`, supaya yang lain tidak ikut berubah.
      const summary = (summaryRes as any)?.data ?? summaryRes ?? {}

      workspace.value.highlights = mapHighlights(summary.highlights)
      workspace.value.kpis = mapKpis(summary.kpis)
      workspace.value.charts = mapCharts(summary.charts)
      workspace.value.quickActions = mapQuickActions(summary.quick_actions)
      workspace.value.notifications = mapNotifications(summary.notifications)
      workspace.value.workflows = mapWorkflows(summary.workflows)

      layout.value = unwrap(layoutRes)

      workspace.value.favoriteApps = mapFavoriteApps(
        Array.isArray(favoriteAppsRes) ? favoriteAppsRes : [],
      )

      workspace.value.favoriteMenus = mapFavoriteMenus(
        Array.isArray(favoriteMenusRes) ? favoriteMenusRes : [],
      )
    }
    catch (err: any) {
      error.value = err?.message || 'Failed to load dashboard'
      console.error('load dashboard error', err)
    }
    finally {
      isLoading.value = false
    }
  }

  function toggleFavorite(code: string) {
    workspace.value.favoriteApps = workspace.value.favoriteApps.map(item =>
      item.code === code
        ? { ...item, favorite: !item.favorite }
        : item,
    )
  }

  onMounted(loadDashboard)

  return {
    workspace,
    layout,
    visibleWidgets,
    moveWidget,
    toggleWidgetVisible,
    toggleWidgetCollapsed,
    saveLayout: persistLayout,
    resetLayout: restoreDefaultLayout,
    favoriteApps,
    favoriteMenus,
    quickActions,
    toggleQuickAction,
    isLoading,
    isCustomizing,
    error,
    loadDashboard,
    toggleFavorite,
    toggleFavoriteMenu,
  }
}