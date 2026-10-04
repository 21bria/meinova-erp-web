/**
 * Menu mana yang boleh dilihat pengguna yang sedang login.
 *
 * Sumbernya `RoleMenuPermission` di backend — dicentang per role di
 * Administration → Security → Menu Permissions. Sebelum ini tabel
 * `Menu` kosong dan tidak ada satu pun yang membaca centangnya, jadi
 * seluruh sidebar sama untuk semua orang.
 *
 * **Ini bukan penjagaan.** Halamannya tetap bisa dibuka lewat URL
 * langsung, dan yang menolak sungguhan tetap API tiap resource. Yang
 * dilakukan di sini cuma tidak menyodorkan layar yang bukan urusannya.
 */
const state = () => useState<{
  loaded: boolean
  unrestricted: boolean
  routes: string[]
}>('menu-access', () => ({
  loaded: false,
  unrestricted: true,
  routes: [],
}))

export function useMenuAccess() {
  const auth = useAuthStore()
  const { request } = useApi()

  const access = state()

  /**
   * Route yang tidak dikenal dianggap **boleh**.
   *
   * Menu baru di `menus.ts` belum tentu sudah didaftarkan di tabel
   * `Menu` backend, dan menu yang hilang tanpa jejak jauh lebih sulit
   * dilacak daripada menu yang tampil lalu ditolak API-nya dengan pesan
   * jelas. Sama filosofinya dengan `isGranted` di `useAccess`.
   */
  function isVisible(link?: string) {
    if (!link || link === '#')
      return true

    if (access.value.unrestricted || !access.value.loaded)
      return true

    return access.value.routes.includes(link)
  }

  async function load(force = false) {
    if (!auth.isAuthed)
      return

    if (!force && access.value.loaded)
      return

    try {
      const result = await request<{
        unrestricted: boolean
        routes: string[]
      }>('/api/accounts/menu-permissions/my/', { method: 'GET' })

      access.value = {
        loaded: true,
        unrestricted: result?.unrestricted !== false,
        routes: Array.isArray(result?.routes) ? result.routes : [],
      }
    }
    catch {
      // Gagal memuat tidak boleh mengosongkan sidebar. Dibiarkan
      // terbuka; API tetap penjaga sebenarnya.
      access.value = { loaded: true, unrestricted: true, routes: [] }
    }
  }

  function reset() {
    access.value = { loaded: false, unrestricted: true, routes: [] }
  }

  return {
    unrestricted: computed(() => access.value.unrestricted),
    routes: computed(() => access.value.routes),
    isVisible,
    load,
    reset,
  }
}
