/**
 * Isi bel di header.
 *
 * Dua sumber, satu permintaan (`notifications/bell/`):
 *
 * - **`waiting_for_me`** — dokumen yang menunggu tanda tangan pengguna
 *   ini. Angkanya milik engine approval, dan belnya cuma menampilkan.
 *   Tidak pernah bisa ditandai terbaca: yang menutup baris itu cuma
 *   tombol Approve/Reject di kotak masuk. Kalau ia ikut bisa dibuang
 *   dari bel, "sudah saya bersihkan" jadi tidak sama dengan "sudah saya
 *   putuskan", dan dokumennya mengendap tanpa ada yang merasa ditagih.
 *
 * - **`items`** — notifikasi yang sifatnya memberi tahu (kontrak mau
 *   habis, ulang tahun). Ini yang punya `is_read`, dan membacanya
 *   memang seluruh daur hidupnya.
 *
 * Statenya `useState` supaya bertahan lintas navigasi — belnya tampil
 * di setiap halaman, dan memuat ulang tiap pindah layar berarti satu
 * permintaan tambahan untuk angka yang jarang berubah. Konsekuensinya
 * wajib di-`reset()` saat logout, sama seperti `useMenuAccess`.
 */

export interface NotificationItem {
  id: number
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
  module: string
  link: string
  object_type: string
  object_id: string
  is_read: boolean
  read_at: string | null
  created_at: string
}

interface NotificationState {
  loaded: boolean
  loading: boolean
  unreadCount: number
  waitingForMe: number
  items: NotificationItem[]
}

const emptyState = (): NotificationState => ({
  loaded: false,
  loading: false,
  unreadCount: 0,
  waitingForMe: 0,
  items: [],
})

const state = () => useState<NotificationState>(
  'notifications',
  emptyState,
)

export function useNotifications() {
  const auth = useAuthStore()
  const { request } = useApi()

  const bell = state()

  const endpoint = '/api/administration/notifications/notifications'

  /**
   * Angka di lencana = yang belum dibaca + yang menunggu keputusan.
   *
   * Digabung karena keduanya sama-sama berarti "ada yang belum Anda
   * lihat"; yang dibedakan isi dropdownnya, bukan angkanya.
   */
  const badge = computed(
    () => bell.value.unreadCount + bell.value.waitingForMe,
  )

  async function load(force = false) {
    if (!auth.isAuthed)
      return

    if (!force && bell.value.loaded)
      return

    bell.value.loading = true

    try {
      const payload = await request<any>(
        `${endpoint}/bell/`,
        { method: 'GET' },
      )

      // `useApi().request` mengembalikan **envelope utuh**
      // (`{success, message, data, ...}`), bukan isinya. Membaca
      // `payload.unread_count` langsung menghasilkan undefined → 0,
      // dan belnya diam tanpa satu pun error: permintaannya 200,
      // datanya ada, lencananya tidak pernah muncul.
      const result = payload?.data ?? payload

      bell.value = {
        loaded: true,
        loading: false,
        unreadCount: result?.unread_count ?? 0,
        waitingForMe: result?.waiting_for_me ?? 0,
        items: Array.isArray(result?.items) ? result.items : [],
      }
    }
    catch {
      // Bel yang gagal memuat tidak boleh menjatuhkan header. Dibiarkan
      // kosong tanpa lencana — tidak ada angka lebih jujur daripada
      // angka yang salah.
      bell.value = { ...emptyState(), loaded: true }
    }
  }

  async function markRead(id: number) {
    const item = bell.value.items.find(row => row.id === id)

    if (!item || item.is_read)
      return

    // Ditandai di layar lebih dulu supaya belnya tidak terasa
    // tertinggal; kalau permintaannya gagal, `load(true)` di bawah
    // mengembalikannya ke keadaan yang sebenarnya.
    item.is_read = true
    bell.value.unreadCount = Math.max(0, bell.value.unreadCount - 1)

    try {
      await request(`${endpoint}/${id}/read/`, { method: 'POST' })
    }
    catch {
      await load(true)
    }
  }

  async function markAllRead() {
    if (!bell.value.unreadCount)
      return

    for (const item of bell.value.items)
      item.is_read = true

    bell.value.unreadCount = 0

    try {
      await request(`${endpoint}/mark-all-read/`, { method: 'POST' })
    }
    catch {
      await load(true)
    }
  }

  function reset() {
    bell.value = emptyState()
  }

  return {
    items: computed(() => bell.value.items),
    unreadCount: computed(() => bell.value.unreadCount),
    waitingForMe: computed(() => bell.value.waitingForMe),
    loading: computed(() => bell.value.loading),
    badge,
    load,
    markRead,
    markAllRead,
    reset,
  }
}
