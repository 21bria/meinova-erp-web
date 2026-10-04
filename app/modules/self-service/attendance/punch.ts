/*
|--------------------------------------------------------------------------
| Tap kehadiran Self Service — logika murni (ATT-GPS-1)
|--------------------------------------------------------------------------
|
| Semua yang bisa salah diam-diam ditaruh di sini, bukan di `<template>`,
| supaya teruji di lingkungan `node` repo ini tanpa DOM: opsi geolokasi,
| penerjemahan galatnya, dan isi permintaan yang benar-benar terkirim.
|
| **Browser tidak memutuskan apa pun.** Ia hanya mengambil koordinat dan
| akurasi yang dilaporkan perangkat. Di dalam/di luar area kerja, akurasi
| cukup atau tidak, dan apakah tap menjadi kehadiran — semuanya dijawab
| backend. Peringatan akurasi di layar hanya petunjuk sebelum mengirim.
*/

/**
 * Dua niat pegawai, dua alamat (ATT-UX-1): absen di halaman aksi,
 * melihat kehadiran di halaman laporan.
 */
export const PUNCH_ROUTE = '/me/attendance/punch'
export const REPORT_ROUTE = '/me/attendance'

/** Opsi `getCurrentPosition` yang disepakati: GPS sungguhan, tanpa cache. */
export const GEO_OPTIONS: PositionOptions = Object.freeze({
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
})

export type GeoFailure
  = | 'insecure_context'
    | 'unsupported'
    | 'permission_denied'
    | 'position_unavailable'
    | 'timeout'

export interface GeoReading {
  latitude: number
  longitude: number
  /** Meter, seperti dilaporkan perangkat. Bukan bukti anti-pemalsuan. */
  accuracy: number
}

/** Bagian `window`/`navigator` yang dipakai — bisa diganti di test. */
export interface GeoEnvironment {
  isSecureContext: boolean
  geolocation?: Pick<Geolocation, 'getCurrentPosition'>
}

export class GeoError extends Error {
  constructor(public readonly code: GeoFailure) {
    super(code)
  }
}

/** `GeolocationPositionError.code` → kode layar. */
export function geoErrorCode(error: { code?: number } | null | undefined): GeoFailure {
  switch (error?.code) {
    case 1:
      return 'permission_denied'
    case 3:
      return 'timeout'
    default:
      return 'position_unavailable'
  }
}

/**
 * Satu pembacaan lokasi.
 *
 * Konteks tidak aman (HTTP biasa, bukan `localhost`) diperiksa **lebih
 * dulu**: browser modern menolak geolokasi di sana tanpa memunculkan
 * dialog izin, dan galatnya terbaca seperti "izin ditolak" — padahal
 * yang salah alamat situsnya, bukan pilihan pegawai.
 */
export function acquirePosition(env: GeoEnvironment): Promise<GeoReading> {
  if (!env.isSecureContext)
    return Promise.reject(new GeoError('insecure_context'))

  if (!env.geolocation)
    return Promise.reject(new GeoError('unsupported'))

  return new Promise((resolve, reject) => {
    env.geolocation!.getCurrentPosition(
      position => resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      }),
      error => reject(new GeoError(geoErrorCode(error))),
      GEO_OPTIONS,
    )
  })
}

/** Akurasi lebih buruk dari batas server? (petunjuk saja) */
export function isLowAccuracy(reading: GeoReading | null, limit: number | null | undefined): boolean {
  if (!reading || !limit)
    return false

  return reading.accuracy > limit
}

/** Presisi yang disimpan backend: 7 desimal koordinat, 2 desimal akurasi. */
export function coordinate(value: number): string {
  return value.toFixed(7)
}

export function meters(value: number): string {
  return value.toFixed(2)
}

export interface PunchInput {
  clientPunchId: string
  punchType: 'in' | 'out'
  reading: GeoReading
  selfieId: number | null
}

/**
 * Isi `POST /api/me/attendance/punch/`.
 *
 * Daftar putih kolom yang diterima endpoint. Pegawai, tanggal kerja, jam
 * server, dan hasil pemeriksaan **tidak pernah** dikirim — backend
 * menolaknya, dan mengirimnya berarti layar ini mengira identitas atau
 * hasil bisa dititipkan.
 */
export function buildPunchBody(input: PunchInput): Record<string, string | number | null> {
  return {
    client_punch_id: input.clientPunchId,
    punch_type: input.punchType,
    latitude: coordinate(input.reading.latitude),
    longitude: coordinate(input.reading.longitude),
    location_accuracy: meters(input.reading.accuracy),
    selfie: input.selfieId,
  }
}

/** Kategori unggahan selfie — menentukan folder dan aturan lampirannya di backend. */
export const SELFIE_CATEGORY = 'attendance_selfie'

export interface PunchAvailability {
  available: boolean
  trial: boolean
  max_gps_accuracy_m?: number
}

export interface PunchTrialResult {
  mode: 'gps_trial'
  location_result: string
  accuracy_m: string | null
  geofence_result: string
  distance_m: string | null
  radius_m: string | null
  selfie_stored: boolean
  biometric_verification: 'unavailable'
  attendance_recorded: false
}

export interface PunchResult {
  result: 'accepted' | 'rejected' | 'review_required'
  punch_type: 'in' | 'out'
  recorded_at: string | null
  work_date: string | null
  reason_code: string | null
  message: string
  replayed: boolean
  attendance: null | {
    work_date: string
    status: string
    check_in: string | null
    check_out: string | null
  }
  trial?: PunchTrialResult
}

export type PunchTone = 'success' | 'warning' | 'error'

/**
 * Nada panel hasil, **dari jawaban server**.
 *
 * Uji coba selalu `warning`: tap-nya ditolak dan kehadiran tidak dicatat,
 * jadi tidak boleh terbaca sebagai sukses walau GPS-nya lolos. Hanya
 * `accepted` di luar uji coba yang `success`.
 */
export function resultTone(result: Pick<PunchResult, 'result' | 'trial'>): PunchTone {
  if (result.trial)
    return 'warning'

  if (result.result === 'accepted')
    return 'success'

  if (result.result === 'review_required')
    return 'warning'

  return 'error'
}
