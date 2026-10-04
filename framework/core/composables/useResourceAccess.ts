import { useApi } from "@/composables/useApi"

/**
 * Izin tulis per resource, dibaca sekali per sesi.
 *
 * Yang diperbaikinya: penjagaan `ModelPermission` sudah lama benar di
 * backend, tapi **layarnya tidak pernah tahu**. Tidak satu pun modul
 * hasil generate memakai `useAccess()` — generator memang tidak pernah
 * menghasilkannya — jadi pegawai melihat tombol Add/Edit yang selalu
 * berakhir 403 setelah seluruh form diisi.
 *
 * Dipasang di `useCrud`, bukan di berkas hasil generate: seluruh tabel
 * membaca `crud.ui`, jadi satu gerbang di sana menutup semua modul
 * **tanpa regenerate** — dan tidak hilang lagi saat ada yang
 * meregenerate.
 *
 * Satu request untuk seluruh resource. Halaman workspace lazim memuat
 * beberapa tabel sekaligus, dan menembak satu request per tabel membuat
 * render pertama jauh lebih lambat demi jawaban yang sama.
 */

export type ResourceAccess = {
  model: string
  create: boolean
  update: boolean
  delete: boolean
}

type AccessMap = Record<string, ResourceAccess>

export function useResourceAccess() {
  const { request } = useApi()
  const nuxtApp = useNuxtApp()

  const map = useState<AccessMap | null>("framework:resource-access", () => null)

  /**
   * Penanda request yang sedang berjalan — **tidak** di `useState`.
   *
   * Nuxt menyerialisasi seluruh isi `useState` ke payload SSR, dan
   * Promise bukan POJO: begitu ada yang membuka halaman tabel lewat
   * refresh (bukan navigasi klien), render server jatuh dengan
   * `Cannot stringify arbitrary non-POJOs` — seluruh halaman, bukan
   * cuma tombolnya. Disimpan di instance Nuxt yang per-request dan
   * tidak ikut diserialisasi.
   */
  function inflight(): Promise<void> | null {
    return (nuxtApp as any).__resourceAccessPending ?? null
  }

  function setInflight(value: Promise<void> | null) {
    (nuxtApp as any).__resourceAccessPending = value
  }

  async function load() {
    // Tabelnya sendiri tidak memuat data di server (`server: false` di
    // `useCrud`), jadi mengambil izin di sana cuma menambah satu
    // request ke render yang belum menampilkan baris apa pun.
    if (import.meta.server)
      return

    if (map.value !== null)
      return

    // Beberapa tabel di satu halaman memanggil ini bersamaan; tanpa
    // penanda ini, semuanya menembak endpoint yang sama.
    const running = inflight()

    if (running) {
      await running
      return
    }

    const promise = (async () => {
      try {
        const response = await request<AccessMap>("/api/framework/permissions/", {
          method: "GET",
        })

        map.value = response ?? {}
      }
      catch {
        // Gagal memuat = **tidak menyembunyikan apa pun**. Tombol yang
        // hilang gara-gara satu request gagal jauh lebih sulit dilacak
        // daripada tombol yang ditolak API dengan pesan jelas — dan
        // API tetap penjaga sebenarnya.
        map.value = {}
      }
      finally {
        setInflight(null)
      }
    })()

    setInflight(promise)

    await promise
  }

  /**
   * `null` kalau resource-nya tidak dikenal — dan itu **bukan** larangan.
   *
   * 22 viewset belum menuliskan `endpoint` di schema-nya, jadi tidak
   * ikut terdaftar. Menganggapnya terlarang akan mengosongkan tombol di
   * layar yang izinnya sebenarnya ada.
   */
  function accessFor(endpoint?: string): ResourceAccess | null {
    if (!endpoint || !map.value)
      return null

    return map.value[endpoint] ?? null
  }

  function reset() {
    map.value = null
    setInflight(null)
  }

  return { load, accessFor, reset }
}
