// framework/core/composables/dashboardSession.ts

/*
| Periode dan filter dashboard yang **bertahan melewati remount**.
|
| Kenapa ada: `app/layouts/default.vue` memasang `:key="locale"` pada isi
| halaman supaya label yang dihitung sekali di `setup` (judul kolom, label
| field, opsi filter) ikut berganti bahasa. Konsekuensinya seluruh state
| lokal halaman lahir ulang — termasuk periode laporan. Pengguna yang
| sedang membaca Agustus 2026 lalu mengganti bahasa mendarat di bulan
| berjalan, dan angkanya ikut berubah tanpa ada yang memberitahu.
|
| Memperbaikinya dengan membuang `:key` berarti setengah layar tetap
| berbahasa lama; yang benar adalah **state-nya yang tidak boleh ikut
| mati**. Jadi periode dan filter disimpan di luar siklus hidup komponen,
| dan komponen yang lahir kembali membacanya lagi.
|
| Bukan state bahasa dan bukan state autentikasi: isinya cuma dua tanggal,
| mode, dan pilihan filter — persis yang dikirim sebagai query.
|
| **Client saja.** Di server satu proses melayani banyak request, dan
| variabel modul seperti ini dipakai bersama — alasan yang sama dengan
| `registerFrameworkI18n()` di `utils/i18n.ts`. Di SSR fungsi baca
| mengembalikan `null` dan fungsi tulis tidak melakukan apa pun, jadi
| render pertama selalu memakai periode bawaan schema.
*/

import type { DashboardPeriodState } from "../types/dashboard"

export type DashboardFilterState = Record<
  string,
  string | number | number[] | null
>

export interface DashboardSession {
  period: DashboardPeriodState
  filters: DashboardFilterState
}

export function dashboardSessionKey(schema: {
  module?: string
  endpoint?: string
}): string {
  return `dashboard:${schema.module ?? schema.endpoint ?? "unknown"}`
}

function enabled(): boolean {
  // `import.meta.server` hanya benar di jalur render server Nuxt. Di
  // browser dan di unit test nilainya undefined.
  return (import.meta as { server?: boolean }).server !== true
}

const store = new Map<string, DashboardSession>()

export function readDashboardSession(key: string): DashboardSession | null {
  if (!enabled()) return null

  return store.get(key) ?? null
}

export function writeDashboardSession(
  key: string,
  session: DashboardSession,
): void {
  if (!enabled()) return

  // Disalin, bukan disimpan sebagai referensi: yang dioper adalah
  // `ref.value` milik komponen yang sebentar lagi dibuang, dan menyimpan
  // referensinya berarti isinya masih bisa berubah sesudah komponennya
  // mati.
  store.set(key, {
    period: { ...session.period },
    filters: { ...session.filters },
  })
}

/** Dipakai test; tidak dipanggil aplikasi. */
export function clearDashboardSessions(): void {
  store.clear()
}
