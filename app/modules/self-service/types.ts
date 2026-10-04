/*
|--------------------------------------------------------------------------
| Kontrak Self Service
|--------------------------------------------------------------------------
|
| Padanan TypeScript dari `SelfProfileSerializer` (Stage 4). Ditulis
| tangan, **bukan** diturunkan dari schema HR: itu justru intinya. Kontrak
| employee-facing punya umurnya sendiri, dan frontend tidak perlu tahu
| apa pun tentang tata letak CRUD Employee Master.
|
| Nol `any`. Field yang backend boleh kosongkan ditulis nullable di sini,
| supaya yang lupa menanganinya ketahuan saat typecheck — bukan saat
| halamannya mencetak "null" ke layar orang.
*/

/** Master yang ditunjuk: `{id, code, name}`. */
export interface Reference {
  id: number
  code: string
  name: string
}

/** Pegawai lain yang disebut di profil — hari ini hanya atasan. */
export interface PersonRef {
  id: number
  employee_number: string
  full_name: string
}

/**
 * Foto beserta fallback-nya.
 *
 * `url` menunjuk `/api/me/avatar/` — rute Self Service yang dijaga
 * identitas — atau `null` kalau memang tidak ada foto. `initials`
 * **tidak pernah** null, jadi layar selalu punya sesuatu untuk
 * ditampilkan.
 */
export interface SelfPhoto {
  url: string | null
  source: 'upload' | 'legacy' | null
  initials: string
}

export interface SelfIdentity {
  id: number
  employee_number: string
  first_name: string
  last_name: string
  full_name: string
  is_active: boolean
}

export interface SelfPersonal {
  gender: Reference | null
  birth_place: string
  birth_date: string | null
  marital_status: Reference | null
  nationality: Reference | null
  blood_type: Reference | null
  religion: Reference | null
}

export interface SelfContact {
  personal_email: string
  work_email: string
  phone: string
  mobile: string
  address: string
  province: Reference | null
  city: Reference | null
  district: Reference | null
  village: Reference | null
}

export interface SelfEmployment {
  status: Reference | null
  type: Reference | null
  join_date: string | null
  effective_date: string | null
  confirmation_date: string | null
  job_location: string
}

export interface SelfOrganization {
  company: Reference | null
  branch: Reference | null
  location: Reference | null
  division: Reference | null
  department: Reference | null
  section: Reference | null
  position: Reference | null
  job_level: Reference | null
  job_grade: Reference | null
  cost_center: Reference | null
  supervisor: PersonRef | null
  effective_date: string | null
}

export interface SelfEmergencyContact {
  name: string
  phone: string
}

/** Bentuk utuh `GET /api/me/profile/`. */
export interface SelfProfile {
  identity: SelfIdentity
  photo: SelfPhoto
  personal: SelfPersonal
  contact: SelfContact
  employment: SelfEmployment
  organization: SelfOrganization
  emergency_contact: SelfEmergencyContact
}

/** Bentuk `GET /api/me/`. */
export interface SelfContext {
  id: number
  employee_number: string
  full_name: string
  is_active: boolean
  photo?: SelfPhoto
  avatar?: SelfPhoto
}

/*
|--------------------------------------------------------------------------
| Ruang Kerja Saya — `GET /api/me/workspace/`
|--------------------------------------------------------------------------
|
| Kontrak **terpisah** dari profil, dan itu bukan kerapian: keduanya
| berubah dengan irama yang sangat berbeda. Kartu kepegawaian berubah
| beberapa kali setahun; hari kerja berubah setiap hari.
|
| Tiga keadaan, dan layar wajib membedakan ketiganya — kalau tidak,
| "belum ada catatan kehadiran hari ini" dan "Anda tidak berhak"
| terbaca sama persis.
*/

export type SelfSectionState = 'ready' | 'empty' | 'restricted'

/**
 * Tombol yang **backend** putuskan layak tampil.
 *
 * `null` = tidak layak untuk akun ini, dan layar menghilangkannya —
 * bukan menampilkannya kelabu. Tombol mati di dashboard pribadi tidak
 * memberi tahu apa pun yang bisa ditindaklanjuti pemiliknya.
 *
 * Rutenya datang dari backend, tidak dipetakan di sini: dua peta rute
 * yang harus tetap sepakat adalah cara sebuah tombol diam-diam mendarat
 * di halaman yang salah setelah rute modulnya dipindah.
 */
export interface SelfAction {
  code: string
  route: string
}

/** Konteks kerja di kepala dashboard. Enam field, sengaja. */
export interface SelfHero {
  position: Reference | null
  department: Reference | null
  company: Reference | null
  location: Reference | null
  employment_status: Reference | null
  employment_type: Reference | null
}

export interface SelfSchedule {
  state: SelfSectionState
  /** Kode stabil (`work`, `off`, `holiday`, `unplanned`, …). */
  rotation_state: string | null
  /** Label bawaan backend; dipakai kalau katalog belum punya kodenya. */
  rotation_state_label: string
  shift_name: string
  time_label: string
  location: Reference | null
  action: SelfAction | null
}

export interface SelfAttendance {
  state: SelfSectionState
  status: string | null
  status_label: string
  /** Jam dinding kantor `"HH:MM"`, sudah dirakit backend. */
  check_in: string | null
  check_out: string | null
  late_minutes: number
  early_leave_minutes: number
  action: SelfAction | null
}

export interface SelfRequests {
  state: SelfSectionState
  waiting_for_me: number
  my_open_submissions: number
  approvals_action: SelfAction | null
  submissions_action: SelfAction | null
}

export interface SelfLeaveBalance {
  leave_type: Reference | null
  remaining: number
  year: number
}

export interface SelfLeave {
  state: SelfSectionState
  year: number
  balances: SelfLeaveBalance[]
  action: SelfAction | null
}

export interface SelfPermissionLatest {
  date: string
  permission_type: string
  permission_type_label: string
  status: string
  status_label: string
}

export interface SelfPermission {
  state: SelfSectionState
  pending_count: number
  latest: SelfPermissionLatest | null
  action: SelfAction | null
}

export interface SelfOvertime {
  state: SelfSectionState
  /** Tanggal pertama bulan berjalan, patokan label periode. */
  period: string
  total_minutes: number
  action: SelfAction | null
}

export interface SelfPayslipLatest {
  period: Reference | null
  period_start: string | null
  issue_date: string | null
  document_number: string
}

export interface SelfPayslip {
  state: SelfSectionState
  latest: SelfPayslipLatest | null
  action: SelfAction | null
}

/** Bentuk utuh `GET /api/me/workspace/`. */
export interface SelfWorkspace {
  identity: SelfIdentity & { avatar: SelfPhoto }
  hero: SelfHero
  as_of: string
  schedule: SelfSchedule
  attendance: SelfAttendance
  requests: SelfRequests
  leave: SelfLeave
  permission: SelfPermission
  overtime: SelfOvertime
  payslip: SelfPayslip
  quick_actions: SelfAction[]
}

/* ---------------------------------------------------------------------
| Kehadiran Saya — `GET /api/me/attendance/`
|
| Halaman periode, bukan kartu hari ini. Bentuknya sengaja berbeda dari
| `SelfAttendance` di atas: yang itu menjawab "hari ini bagaimana", yang
| di bawah menjawab "periode ini bagaimana", dan menyatukannya berarti
| satu tipe yang separuh fieldnya selalu kosong.
--------------------------------------------------------------------- */

/**
 * Satu angka ringkasan, beserta **apakah ia berlaku**.
 *
 * `available: false` bukan sinonim nol. Pegawai yang Employee Group-nya
 * mematikan proses Attendance tidak punya angka hadir — bukan punya
 * angka hadir yang kebetulan nol — dan kartu yang menampilkan "0" untuk
 * keduanya berbohong kepada salah satunya.
 */
export interface SelfMetric {
  value: number
  available: boolean
}

export interface SelfAttendanceSummary {
  work_days: SelfMetric
  present: SelfMetric
  late: SelfMetric
  absent: SelfMetric
  /** Hari dinas tanpa tap — tidak ikut `present` (BT-3R). */
  business_trip?: SelfMetric
  leave_days: SelfMetric
  worked_minutes: SelfMetric
  overtime_minutes: SelfMetric
}

/** Rentang tanggal `YYYY-MM-DD`, bentuk yang dikirim dan diterima. */
export interface SelfDateRange {
  date_from: string
  date_to: string
}

export interface SelfAttendanceRange extends SelfDateRange {
  days: number
  max_days: number
  page_sizes: number[]
  previous: SelfDateRange
  /** `null` saat periodenya sudah menyentuh hari ini. */
  next: SelfDateRange | null
}

/** Hasil satu hari, sudah diklasifikasi backend. */
export type SelfDayOutcome
  = | 'present'
    | 'late'
    | 'absent'
    | 'leave'
    | 'business_trip'
    | 'extra'
    | 'off'

export interface SelfAttendanceDay {
  date: string
  outcome: SelfDayOutcome
}

export interface SelfAttendanceRow {
  id: number
  work_date: string
  shift: string | null
  status: string
  status_label: string
  source: string
  source_label: string
  /** Jam dinding kantor `"HH:MM"`, sudah dirakit backend. */
  check_in: string | null
  check_out: string | null
  worked_minutes: number
  late_minutes: number
  early_leave_minutes: number
  overtime_minutes: number
  /** `pending` / `excused` / `partial` / `unauthorized`, atau null. */
  permission_state: string | null
}

export interface SelfAttendanceData {
  range: SelfAttendanceRange
  summary: SelfAttendanceSummary
  daily: SelfAttendanceDay[]
  history: SelfAttendanceRow[]
}

/** Paginasi, dari `meta` amplop — bukan dari `data`. */
export interface SelfPageMeta {
  count: number
  total_pages: number
  page: number
  page_size: number
}

export interface SelfAttendancePage {
  data: SelfAttendanceData
  meta: SelfPageMeta
}

/** Parameter yang boleh dikirim. Tidak satu pun menyebut pegawai. */
export interface SelfAttendanceQuery {
  date_from?: string
  date_to?: string
  page?: number
  page_size?: number
}

/**
 * Sebab kegagalan, dibaca dari `code` backend.
 *
 * Bercabang pada `code`, **bukan** pada kalimatnya: satu perbaikan tata
 * bahasa di backend tidak boleh mematahkan satu cabang di sini. Dan
 * bukan pada status HTTP sendirian — 404 di `/me` berarti "akun belum
 * ditautkan", yang sama sekali berbeda dari 404 di endpoint lain.
 */
export type SelfErrorCode
  = | 'employee_not_linked'
    | 'employee_inactive'
    | 'avatar_not_set'
    | 'avatar_unavailable'
    | 'not_authenticated'
    | 'unknown'

export interface SelfError {
  code: SelfErrorCode
  status: number
}
