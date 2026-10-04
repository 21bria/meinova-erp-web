import { useApi } from '@/composables/useApi'

/**
 * Endpoint notifikasi yang **bukan** CRUD.
 *
 * Ditulis tangan dan tinggal di luar folder modul hasil generate, jadi
 * `pnpm meinova generate administration/email-templates` tidak
 * menimpanya. Pola yang sama dengan `useHelpCenter`.
 */
export function useNotificationAdmin() {
  const { request } = useApi()

  /**
   * Katalog event beserta placeholder-nya.
   *
   * Diturunkan backend dari registry, bukan dari tabel: daftar event
   * ditentukan kode yang memicunya, dan baris database tidak bisa
   * mengarang pemicu. Tanpa endpoint ini, satu-satunya cara mengetahui
   * kunci apa yang tersedia untuk sebuah event adalah membaca kode
   * pengirimnya — dan orang yang menyunting kalimat surat tidak
   * membuka repo.
   */
  function getEvents(module?: string) {
    return request('/api/notifications/events/', {
      method: 'GET',
      query: module ? { module } : {},
    })
  }

  /**
   * Pratinjau tanpa menyimpan dan tanpa mengirim.
   *
   * Backend merender dengan **contoh nilai** dari registry, bukan data
   * sungguhan — yang sedang disunting adalah kalimatnya, dan menariknya
   * dari satu pegawai nyata membuat pratinjaunya bergantung baris mana
   * yang kebetulan pertama di tabel.
   */
  function preview(payload: {
    event: string
    subject?: string
    body?: string
  }) {
    return request('/api/notifications/templates/preview/', {
      method: 'POST',
      body: payload,
    })
  }

  /** Kirim ulang satu baris log yang gagal. */
  function resendLog(id: string | number) {
    return request(`/api/notifications/logs/${id}/resend/`, {
      method: 'POST',
    })
  }

  return {
    getEvents,
    preview,
    resendLog,
  }
}
