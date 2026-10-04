import type {
  SelfAttendanceData,
  SelfDateRange,
  SelfError,
  SelfPageMeta,
} from '../types'

import { useApi } from '@/composables/useApi'
import { fetchSelfAttendance, toSelfError } from '../api/client'

/**
 * Data layar **Kehadiran Saya** (`/me/attendance`).
 *
 * Satu permintaan per perubahan rentang atau halaman, dan permintaan itu
 * pergi ke `/api/me/attendance/` — bukan ke `/api/hr/attendance/`, yang
 * administratif, menerima `?employee=`, dan tertutup bagi pegawai biasa
 * yang justru audiens halaman ini.
 *
 * **Rentang tidak dipegang di sini sebagai sumber kebenaran.** Yang
 * dikirim permintaan berikutnya selalu `range` yang backend kembalikan,
 * bukan yang diketik pengguna: backend yang memvalidasi batas 90 hari,
 * dan dua salinan aturan batas akan berbeda persis pada hari batasnya
 * diubah.
 *
 * Read-only sepenuhnya: endpoint-nya hanya melayani GET.
 */
export function useSelfAttendance() {
  const { request } = useApi()

  const data = ref<SelfAttendanceData | null>(null)
  const meta = ref<SelfPageMeta | null>(null)
  const pending = ref(false)
  const error = ref<SelfError | null>(null)

  /*
   * Penomoran permintaan, supaya balasan yang datang terlambat tidak
   * menimpa yang lebih baru.
   *
   * Nyata di halaman ini: menekan "7 Hari" lalu "30 Hari" dengan cepat
   * mengirim dua permintaan, dan kalau yang pertama kebetulan pulang
   * belakangan, layar menampilkan 7 hari sementara tombol yang menyala
   * "30 Hari". Tidak ada galat, tidak ada tanda — cuma angka yang tidak
   * cocok dengan pilihannya.
   */
  let ticket = 0

  async function load(
    range?: SelfDateRange,
    page = 1,
    pageSize?: number,
  ) {
    const mine = ++ticket

    pending.value = true
    error.value = null

    try {
      const page_ = await fetchSelfAttendance(request, {
        ...(range ?? {}),
        page,
        page_size: pageSize,
      })

      if (mine !== ticket)
        return

      data.value = page_.data
      meta.value = page_.meta
    }
    catch (caught: unknown) {
      if (mine !== ticket)
        return

      error.value = toSelfError(caught)
      data.value = null
      meta.value = null
    }
    finally {
      if (mine === ticket)
        pending.value = false
    }
  }

  return { data, meta, pending, error, load }
}
