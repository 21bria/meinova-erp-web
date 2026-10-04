/*
|--------------------------------------------------------------------------
| Lapisan data Self Service
|--------------------------------------------------------------------------
|
| Fungsi biasa yang menerima **pengirim permintaan** sebagai argumen,
| bukan composable yang memanggil `useApi()` sendiri. Itu yang membuat
| lapisan ini bisa diuji sungguhan di lingkungan `node` milik repo ini —
| tanpa Nuxt, tanpa DOM, tanpa jaringan — dan yang diuji memang
| bagiannya yang paling gampang salah diam-diam: alamat mana yang
| dipanggil, dan bagaimana galat diterjemahkan.
|
| Alamatnya ditulis sebagai konstanta, bukan disebar sebagai literal di
| komponen. `/api/hr/employees/me/` yang lama **tidak** dipakai di sini
| dan tidak boleh dipakai: ia mengirim 124 kunci bentuk administratif,
| termasuk yang tidak dimaksudkan untuk pegawainya.
*/

import type {
  PunchAvailability,
  PunchInput,
  PunchResult,
} from '../attendance/punch'
import type {
  SelfAttendancePage,
  SelfAttendanceQuery,
  SelfContext,
  SelfError,
  SelfErrorCode,
  SelfProfile,
  SelfWorkspace,
} from '../types'

import { buildPunchBody, SELFIE_CATEGORY } from '../attendance/punch'

export const SELF_ENDPOINTS = {
  context: '/api/me/',
  profile: '/api/me/profile/',
  workspace: '/api/me/workspace/',
  attendance: '/api/me/attendance/',
  avatar: '/api/me/avatar/',
  punch: '/api/me/attendance/punch/',
} as const

/**
 * Jalur unggah bersama (bukan rute `/me`, jadi tidak di `SELF_ENDPOINTS`).
 * Kepemilikan berkasnya dinilai backend saat selfie ditautkan ke tap.
 */
export const UPLOAD_ENDPOINT = '/api/uploads/'

/**
 * Pengirim permintaan yang membawa method dan body — untuk tulis
 * (unggah selfie, tap). Di aplikasi diisi `useApi().request`.
 */
export type Sender = <T>(
  path: string,
  opts: { method: 'POST', body: FormData | Record<string, unknown> },
) => Promise<T>

/** Pengirim permintaan; di aplikasi diisi `useApi().request`. */
export type Requester = <T>(
  path: string,
  opts?: { responseType?: 'json' | 'blob' },
) => Promise<T>

/** Bentuk amplop balasan backend. */
interface Envelope<T> {
  success?: boolean
  message?: string
  data?: T
  meta?: unknown
  code?: string
}

const KNOWN_CODES: readonly SelfErrorCode[] = [
  'employee_not_linked',
  'employee_inactive',
  'avatar_not_set',
  'avatar_unavailable',
  'not_authenticated',
]

/**
 * Galat `$fetch` jadi `SelfError` yang punya arti.
 *
 * Kode yang tidak dikenal jatuh ke `unknown` alih-alih diteruskan apa
 * adanya: layar bercabang atas nilai ini, dan cabang yang menerima
 * sembarang string dari jaringan adalah cabang yang tidak bisa
 * dipastikan lengkap.
 */
export function toSelfError(error: unknown): SelfError {
  const wrapped = error as {
    status?: number
    statusCode?: number
    response?: { status?: number }
    data?: { code?: string }
  }

  const status
    = wrapped?.response?.status
      ?? wrapped?.status
      ?? wrapped?.statusCode
      ?? 0

  const raw = wrapped?.data?.code

  const code = KNOWN_CODES.find(known => known === raw)

  if (code)
    return { code, status }

  // 401 tanpa `code`: handler global DRF tidak menambahkan kunci itu
  // untuk galat autentikasi, dan halamannya tetap perlu tahu bedanya
  // "belum login" dari "gagal jaringan".
  if (status === 401)
    return { code: 'not_authenticated', status }

  return { code: 'unknown', status }
}

/** Isi `data` dari amplop; balasan tanpa amplop diterima apa adanya. */
function unwrap<T>(payload: Envelope<T> | T): T {
  const envelope = payload as Envelope<T>

  if (envelope && typeof envelope === 'object' && 'data' in envelope && envelope.data !== undefined)
    return envelope.data

  return payload as T
}

export async function fetchSelfContext(request: Requester): Promise<SelfContext> {
  return unwrap<SelfContext>(
    await request<Envelope<SelfContext>>(SELF_ENDPOINTS.context),
  )
}

export async function fetchSelfProfile(request: Requester): Promise<SelfProfile> {
  return unwrap<SelfProfile>(
    await request<Envelope<SelfProfile>>(SELF_ENDPOINTS.profile),
  )
}

/**
 * Ringkasan hari kerja.
 *
 * **Satu permintaan, bukan tujuh.** Jadwal, presensi, cuti, izin,
 * lembur, approval, dan slip dirakit backend jadi satu jawaban — layar
 * tidak memanggil satu pun endpoint domain secara langsung. Itu yang
 * membuat `/me` tetap berdiri saat rute admin salah satunya dipindah,
 * dan yang membuat pegawai tanpa izin administratif tetap melihat
 * ringkasannya sendiri.
 */
export async function fetchSelfWorkspace(request: Requester): Promise<SelfWorkspace> {
  return unwrap<SelfWorkspace>(
    await request<Envelope<SelfWorkspace>>(SELF_ENDPOINTS.workspace),
  )
}

/**
 * Query string dari parameter yang **boleh** dikirim.
 *
 * Daftar putih, bukan `Object.entries(query)`. Bedanya bukan gaya: satu
 * pemanggil yang menambahkan `employee` ke objeknya akan mengirimkannya
 * ke jaringan, dan meski backend tidak membacanya, permintaan itu sudah
 * menjadi bukti bahwa frontend mengira identitas bisa dititipkan lewat
 * URL. Yang tidak terdaftar di sini tidak pernah terkirim.
 */
export function attendanceQuery(query: SelfAttendanceQuery = {}): string {
  const params = new URLSearchParams()

  if (query.date_from && query.date_to) {
    params.set('date_from', query.date_from)
    params.set('date_to', query.date_to)
  }

  if (query.page && query.page > 1)
    params.set('page', String(query.page))

  if (query.page_size)
    params.set('page_size', String(query.page_size))

  const text = params.toString()

  return text ? `?${text}` : ''
}

/**
 * Satu halaman Kehadiran Saya.
 *
 * Mengembalikan `data` **beserta** `meta`-nya, tidak seperti pemanggil
 * lain di berkas ini. Paginasi tinggal di `meta` amplop — itu
 * konvensi seluruh API repo ini — dan membuang amplopnya di sini
 * berarti halaman yang memakainya harus menebak jumlah halamannya
 * sendiri dari panjang daftar. Tebakan itu selalu benar di halaman
 * pertama dan selalu salah di halaman terakhir.
 */
export async function fetchSelfAttendance(
  request: Requester,
  query: SelfAttendanceQuery = {},
): Promise<SelfAttendancePage> {
  const payload = await request<Envelope<SelfAttendancePage['data']>>(
    `${SELF_ENDPOINTS.attendance}${attendanceQuery(query)}`,
  )

  return {
    data: unwrap<SelfAttendancePage['data']>(payload),
    meta: (payload?.meta ?? {
      count: 0,
      total_pages: 1,
      page: 1,
      page_size: 10,
    }) as SelfAttendancePage['meta'],
  }
}

/**
 * Foto sebagai blob.
 *
 * **Harus lewat sini, tidak boleh dipasang langsung ke `<img src>`.**
 * `/api/me/avatar/` dijaga JWT, dan `<img>` tidak pernah mengirim header
 * `Authorization` — jadi memasangnya langsung menghasilkan gambar yang
 * selalu gagal, tanpa satu pun pesan yang menyebut sebabnya.
 *
 * `null` berarti "tidak ada foto", dan itu keadaan yang **normal**,
 * bukan galat: pemanggilnya menampilkan inisial. Kegagalan yang bukan
 * 404 dilempar, supaya gangguan sungguhan tidak menyamar jadi "belum
 * punya foto".
 */
export async function fetchSelfAvatarBlob(
  request: Requester,
): Promise<Blob | null> {
  try {
    return await request<Blob>(SELF_ENDPOINTS.avatar, { responseType: 'blob' })
  }
  catch (error) {
    const parsed = toSelfError(error)

    if (parsed.code === 'avatar_not_set' || parsed.status === 404)
      return null

    throw error
  }
}

/* ------------------------------------------------------------------ */
/* Tap kehadiran (ATT-GPS-1)                                           */
/* ------------------------------------------------------------------ */

/** Tersedia atau tidak untuk akun ini — tanpa detail mesinnya. */
export async function fetchPunchAvailability(request: Requester): Promise<PunchAvailability> {
  return unwrap<PunchAvailability>(
    await request<Envelope<PunchAvailability>>(SELF_ENDPOINTS.punch),
  )
}

/**
 * Unggah selfie lewat jalur unggah biasa, kategori `attendance_selfie`.
 * Mengembalikan `id` numeriknya — itu yang ditunjuk kolom `selfie`.
 */
export async function uploadSelfie(send: Sender, file: File): Promise<number> {
  const body = new FormData()

  body.append('file', file, file.name || 'selfie.jpg')
  body.append('metadata', JSON.stringify({ category: SELFIE_CATEGORY }))

  const payload = unwrap<{ id?: number }>(
    await send<Envelope<{ id?: number }>>(UPLOAD_ENDPOINT, { method: 'POST', body }),
  )

  if (typeof payload?.id !== 'number')
    throw new Error('Upload response has no id.')

  return payload.id
}

export async function submitPunch(send: Sender, input: PunchInput): Promise<PunchResult> {
  return unwrap<PunchResult>(
    await send<Envelope<PunchResult>>(SELF_ENDPOINTS.punch, {
      method: 'POST',
      body: buildPunchBody(input),
    }),
  )
}
