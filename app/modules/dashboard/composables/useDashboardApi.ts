import { useApi } from '@/composables/useApi'

import type { DashboardLayoutItem } from '../types'

export function useDashboardApi() {
  const { request } = useApi()

  /**
   * Seluruh isi beranda dalam satu request: KPI, chart, quick action,
   * notifikasi, dan dokumen berjalan.
   *
   * Sebelumnya kelimanya tidak menembak API sama sekali — isinya
   * `dashboardDummy`, angka karangan yang sama untuk setiap orang yang
   * login. Satu endpoint, bukan lima: halaman pertama yang dibuka
   * setiap pagi tidak boleh menembak lima request untuk render awal.
   */
  async function getSummary() {
    return await request('/api/administration/dashboard/summary/', {
      method: 'GET',
    })
  }

  /**
   * Katalog widget beranda **beserta** susunan pengguna: urutan,
   * tampil/tidak, terlipat/tidak.
   *
   * Satu request memberi dua keadaan sekaligus, jadi masuk mode
   * Customize tidak menembak API lagi — pola yang sama dengan katalog
   * aplikasi.
   */
  async function getLayout() {
    return await request('/api/administration/dashboard/layout/', {
      method: 'GET',
    })
  }

  /**
   * Menyimpan seluruh susunan sekaligus; urutan `items` = urutannya.
   *
   * Bukan per widget: menggeser satu kartu mengubah posisi semua yang
   * di bawahnya, jadi menyimpan satu per satu berarti puluhan request
   * untuk satu tarikan — dan keadaan setengah tersimpan kalau salah
   * satunya gagal.
   */
  async function saveLayout(items: DashboardLayoutItem[]) {
    return await request('/api/administration/dashboard/layout/', {
      method: 'PUT',
      body: { items },
    })
  }

  /** Kembali ke susunan bawaan. */
  async function resetLayout() {
    return await request('/api/administration/dashboard/layout/', {
      method: 'DELETE',
    })
  }

  async function getFavoriteApps() {
    return await request('/api/administration/dashboard/favorite-apps/', {
      method: 'GET',
    })
  }

  /** Seluruh aplikasi yang tersedia, dengan penanda mana yang dipilih. */
  async function getAppCatalog() {
    return await request('/api/administration/dashboard/apps/', {
      method: 'GET',
    })
  }

  /**
   * Menyimpan susunan sekaligus; urutan `codes` = urutan kartunya.
   *
   * Satu request untuk seluruh susunan, bukan satu per kartu — menyeret
   * satu kartu mengubah posisi semua yang di bawahnya.
   */
  async function saveFavoriteApps(codes: string[]) {
    return await request('/api/administration/dashboard/favorite-apps/', {
      method: 'PUT',
      body: { codes },
    })
  }

  async function getFavoriteMenus() {
    return await request('/api/administration/dashboard/favorite-menus/', {
      method: 'GET',
    })
  }

  /**
   * Seluruh menu yang bisa dijadikan pintasan, dengan penanda mana yang
   * dipilih — sudah disaring ke hak akses pengguna di backend.
   *
   * Ini yang selama ini tidak ada, dan sebabnya pintasan di beranda cuma
   * bisa lahir dari seed: tanpa katalog tidak ada tempat memilihnya.
   */
  async function getMenuCatalog() {
    return await request('/api/administration/dashboard/menu-catalog/', {
      method: 'GET',
    })
  }

  /** Menyimpan susunan sekaligus; urutan `codes` = urutan pintasannya. */
  async function saveFavoriteMenus(codes: string[]) {
    return await request('/api/administration/dashboard/favorite-menus/', {
      method: 'PUT',
      body: { codes },
    })
  }

  return {
    getSummary,
    getLayout,
    saveLayout,
    resetLayout,
    getFavoriteApps,
    getAppCatalog,
    saveFavoriteApps,
    getFavoriteMenus,
    getMenuCatalog,
    saveFavoriteMenus,
  }
}