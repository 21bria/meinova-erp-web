import type { CellTone } from '../palette'
import type {
  ShiftCalendarAccess,
  ShiftCalendarDay,
  ShiftCalendarResponse,
} from '../types'

import { apiErrorMessage, reportApiError } from '@framework'

import { computed, onMounted, ref, watch } from 'vue'

import {

  MISSING_SHIFT_TONE,
  NEUTRAL_TONE,
  SHIFT_TONES,
  STATE_TONES,
} from '../palette'
import { calendarRequest, resolveSelfMode } from '../selfMode'

/*
 * Satu-satunya pemegang state layar Shift Calendar.
 *
 * Yang **tidak** dilakukan di sini, dan itu inti kontraknya: tidak ada
 * satu pun shift yang diturunkan dari pola siklus, nomor minggu, kode
 * shift, atau lokasi pegawai. Backend sudah meresolusi tiap tanggal;
 * berkas ini memuatnya, mengingat bulan mana yang sedang dibuka, dan
 * membagikan warna. Begitu ada yang menambahkan perhitungan shift di
 * sini, layar dan mesin presensi bisa berbeda tanpa satu pun dari
 * keduanya terlihat salah.
 */

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

/** `YYYY-MM` dari sebuah `Date`, tanpa lewat UTC. */
export function toMonthKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
}

export function shiftMonth(monthKey: string, delta: number): string {
  const [year, month] = monthKey.split('-').map(Number)

  // `Date` menormalkan bulan 0 dan 13 sendiri, jadi tidak perlu cabang
  // khusus untuk Desember → Januari.
  const moved = new Date(
    (year ?? 1970), (month ?? 1) - 1 + delta, 1)

  return toMonthKey(moved)
}

export function monthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number)

  if (!year || !month)
    return monthKey

  return new Date(year, month - 1, 1).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  })
}

export function useShiftCalendar(options: { selfMode?: boolean } = {}) {
  const { request } = useApi()

  /*
   * Niat "Jadwal Saya" — dari `?mode=my` atau checkbox. Bukan identitas:
   * dalam mode pribadi permintaan kalender tidak membawa pegawai sama
   * sekali (lihat `../selfMode.ts`).
   */
  const requestedSelf = ref<boolean>(options.selfMode === true)

  const employeeId = ref<number | null>(null)
  const locationId = ref<number | null>(null)
  const month = ref<string>(toMonthKey(new Date()))

  const loading = ref(false)
  const data = ref<ShiftCalendarResponse | null>(null)

  /*
   * Bentuk layar ditentukan backend, bukan disimpulkan di sini.
   *
   * Satu pintu melayani empat kursi — pegawai (dirinya sendiri), atasan
   * langsung (dirinya + timnya), Admin Department/Section (cakupan
   * organisasinya), dan HR (Data Permission-nya). Yang membedakan
   * bentuk layarnya cuma dua hal, dan keduanya dijawab
   * `GET /api/hr/shift-calendar/access/`: perlu penyaring pegawai atau
   * tidak, dan boleh menekan Adjust Shift atau tidak.
   *
   * `null` selama belum dimuat: itu **bukan** "tidak boleh apa-apa".
   * Menganggapnya begitu membuat layar berkedip dari read-only ke
   * penuh tiap kali dibuka.
   */
  const access = ref<ShiftCalendarAccess | null>(null)

  /*
   * Sebelum jawabannya datang, penyaring **ditampilkan**. Kursi yang
   * paling banyak jumlahnya justru yang tidak membutuhkannya, tapi
   * menyembunyikan lebih dulu lalu memunculkannya terbaca seperti
   * layar yang berubah sendiri — sedangkan menampilkan lebih dulu lalu
   * menyembunyikannya cuma menghilangkan satu penyaring yang belum
   * sempat disentuh siapa pun.
   */
  const selectorRequired = computed(
    () => access.value?.selector_required !== false,
  )

  const selfState = computed(
    () => resolveSelfMode(requestedSelf.value, access.value),
  )

  const selfMode = computed(() => selfState.value.selfMode)

  const toggleVisible = computed(() => selfState.value.toggleVisible)

  /*
   * Kegagalan muat ditahan di layar, bukan cuma di-toast.
   *
   * Kalender kosong tanpa satu kalimat pun terbaca persis seperti
   * "orang ini memang belum punya jadwal" — kesimpulan yang salah dan
   * tidak bisa dibedakan dari yang benar.
   */
  const error = ref<string | null>(null)

  const days = computed<ShiftCalendarDay[]>(() => data.value?.days ?? [])

  /*
   * Peta `shift_id → slot warna`, dibangun dari bulan yang sedang
   * dimuat.
   *
   * Diurutkan menurut id supaya hasilnya deterministik: dua kali muat
   * bulan yang sama menghasilkan warna yang sama, dan pegawai yang
   * shift-nya tetap tidak berubah warnanya dari bulan ke bulan.
   * Menurut urutan kemunculan akan menggeser seluruh warna hanya karena
   * blok kerjanya mulai di shift yang berbeda.
   */
  const shiftTone = computed<Record<number, CellTone>>(() => {
    const ids = Array.from(
      new Set(
        days.value
          .map(day => day.shift_id)
          .filter((id): id is number => typeof id === 'number'),
      ),
    ).sort((a, b) => a - b)

    const map: Record<number, CellTone> = {}

    ids.forEach((id, index) => {
      map[id] = SHIFT_TONES[index % SHIFT_TONES.length] as CellTone
    })

    return map
  })

  /*
   * Hari kerja tanpa shift. Bukan sekadar warna — ini yang dihitung
   * jadi peringatan di kepala kalender, karena satu sel oranye di
   * tengah tiga puluh sel mudah terlewat.
   */
  const missingShiftDays = computed(
    () => days.value.filter(day => day.is_scheduled && !day.shift_code),
  )

  const overrideDays = computed(
    () => days.value.filter(day => day.is_override),
  )

  function toneFor(day: ShiftCalendarDay): CellTone {
    if (day.rotation_state === 'work') {
      if (!day.shift_code)
        return MISSING_SHIFT_TONE

      if (day.shift_id != null && shiftTone.value[day.shift_id])
        return shiftTone.value[day.shift_id] as CellTone

      return NEUTRAL_TONE
    }

    return STATE_TONES[day.rotation_state] ?? NEUTRAL_TONE
  }

  async function load() {
    const target = calendarRequest({
      selfMode: selfMode.value,
      employeeId: employeeId.value,
      month: month.value,
    })

    if (!target) {
      data.value = null
      error.value = null

      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await request<
        ShiftCalendarResponse | { data: ShiftCalendarResponse }
      >(
        target.path,
        {
          method: 'GET',
          query: target.query,
        },
      )

      /*
       * `useApi().request` mengembalikan envelope apa adanya —
       * `{success, message, data}` — dan **tidak** membukanya. Endpoint
       * kalender memakai envelope, jadi tanpa baris ini `days` selalu
       * kosong dan layarnya berbunyi "tidak ada data" untuk pegawai
       * yang jadwalnya jelas-jelas ada. Idiom yang sama dipakai
       * `useDashboard`; dua bentuk diterima supaya composable ini tidak
       * ikut rusak kalau envelope-nya berubah.
       */
      data.value
        = (response as { data?: ShiftCalendarResponse })?.data
          ?? (response as ShiftCalendarResponse)
          ?? null
    }
    catch (caught: any) {
      data.value = null

      // Cakupan organisasi ditolak backend sebagai 400, bukan kalender
      // kosong — jadi pesannya memang punya isi dan layak ditampilkan
      // apa adanya alih-alih diganti kalimat karangan sendiri.
      error.value = apiErrorMessage(
        caught,
        'Kalender shift gagal dimuat.',
      )

      reportApiError(caught, 'Kalender shift gagal dimuat.')
    }
    finally {
      loading.value = false
    }
  }

  /*
   * Dipanggil sekali saat layar dibuka.
   *
   * Kegagalannya sengaja **tidak** menutup layar: kalau endpoint ini
   * gagal, kalendernya masih bisa dipakai dengan penyaring penuh —
   * dan backend tetap yang menolak apa pun yang tidak boleh. Yang
   * hilang cuma kenyamanan memilihkan pegawainya.
   */
  async function loadAccess() {
    try {
      const response = await request<
        ShiftCalendarAccess | { data: ShiftCalendarAccess }
      >('/api/hr/shift-calendar/access/', { method: 'GET' })

      const payload
        = (response as { data?: ShiftCalendarAccess })?.data
          ?? (response as ShiftCalendarAccess)
          ?? null

      access.value = payload

      /*
       * Pegawai biasa mendapat kalendernya sendiri **tanpa memilih
       * apa pun**. Id-nya datang dari backend, bukan ditebak dari
       * `/auth/me` — akun dan kartu pegawai adalah dua hal berbeda,
       * dan yang kedua yang dipakai kalender.
       */
      if (payload?.default_employee && !employeeId.value)
        employeeId.value = payload.default_employee.id
    }
    catch (caught: any) {
      reportApiError(caught, 'Akses kalender shift gagal dibaca.')
    }
  }

  /*
   * Mengganti Location mengosongkan Employee.
   *
   * Kalau tidak, pegawai yang sudah terpilih tetap tinggal sementara
   * dropdown-nya sudah menyaring lokasi lain — dan kalendernya
   * memperlihatkan orang yang tidak ada di daftar yang sedang dibuka.
   */
  watch(locationId, () => {
    employeeId.value = null
  })

  // `onMounted`, bukan langsung saat setup: di SSR request-nya jalan
  // tanpa membawa sesi pemakainya, dan jawabannya jadi jawaban untuk
  // orang yang salah. Di dalam composable, bukan di komponen — state
  // layar ini dipegang satu tempat, dan pemanggilan yang tersebar di
  // dua berkas adalah cara urutannya mulai berbeda antar-halaman.
  //
  // Mode pribadi tidak menunggu pegawai terpilih, jadi kalendernya dimuat
  // di sini juga — bersamaan dengan `access/`, bukan sesudahnya.
  onMounted(() => {
    loadAccess()

    if (selfMode.value)
      load()
  })

  watch(
    () => [selfMode.value, employeeId.value, month.value] as const,
    () => {
      load()
    },
  )

  return {
    employeeId,
    locationId,
    month,

    access,
    selectorRequired,

    requestedSelf,
    selfMode,
    toggleVisible,

    loading,
    error,
    data,
    days,

    missingShiftDays,
    overrideDays,

    toneFor,
    load,
    loadAccess,
  }
}
