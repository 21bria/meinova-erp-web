/*
 * Bentuk respons `GET /api/hr/shift-calendar/`.
 *
 * Ditulis tangan, bukan hasil generator: endpoint ini **bukan** CRUD —
 * ia merakit tiga sumber backend (rotation, penugasan shift, master
 * Shift) jadi satu jawaban per tanggal, dan generator hanya mengenal
 * resource yang punya list/detail/create.
 *
 * Setiap kunci di sini ada di respons apa adanya. Tidak ada satu pun
 * nilai turunan — kalau sebuah angka tidak ada di bawah, artinya
 * backend memang tidak mengirimkannya, dan itu gap yang dilaporkan,
 * bukan isyarat untuk menghitungnya di sini.
 */

/*
 * Delapan keadaan, dan sel kosong bukan salah satunya.
 *
 * Nilainya **semantik backend** dan tidak boleh diterjemahkan sebelum
 * dibandingkan; yang manusiawi cuma labelnya, dan labelnya pun sudah
 * dikirim backend (`rotation_state_label`).
 *
 * `recovery` adalah hari kerja menurut roster yang **sengaja
 * dikosongkan**: jeda antar pergantian shift tidak memenuhi Minimum
 * Rest policy-nya. Sengaja bukan `off` maupun `field_break` — blok
 * kerjanya utuh, dan yang berubah rencana shift-nya.
 */
export type RotationState
  = | 'work'
    | 'field_break'
    | 'travel_out'
    | 'travel_in'
    | 'off'
    | 'holiday'
    | 'recovery'
    | 'unplanned'
    | 'not_applicable'

/*
 * Dari mana jam kerja hari itu datang. `override` dan `baseline` lahir
 * dari `EmployeeShiftAssignment`; dua sisanya jalur cadangan backend
 * (shift permanen pegawai, lalu Work Schedule per hari-dalam-minggu).
 */
export type ShiftSource
  = | 'override'
    | 'baseline'
    | 'employment'
    | 'work_schedule'

export interface ShiftCalendarDay {
  date: string
  /** ISO: Senin=1 … Minggu=7. */
  weekday: number

  rotation_state: RotationState
  rotation_state_label: string

  /** Ada kewajiban presensi pada tanggal ini? */
  is_scheduled: boolean

  shift_id: number | null
  shift_code: string
  shift_name: string

  /**
   * Jam dinding — **ini** yang dirender di sel.
   *
   * `scheduled_check_in`/`_out` di bawahnya UTC dan akan tampil
   * bergeser tujuh jam kalau dirender dengan jam browser.
   */
  scheduled_start: string | null
  scheduled_end: string | null

  scheduled_check_in: string | null
  scheduled_check_out: string | null

  crosses_midnight: boolean

  /** Sudah lengkap dengan tanda `(+1)`; jangan disusun ulang di sini. */
  scheduled_label: string

  shift_source: ShiftSource | null

  /**
   * Sebutan yang dibaca orang — "Roster", "Adjustment", "Employee
   * Default", "Work Schedule". Dirakit backend, sama seperti
   * `rotation_state_label`: nilai di `shift_source` adalah semantik,
   * dan menerjemahkannya sendiri di sini membuat dua daftar istilah
   * yang harus dijaga tetap sama.
   */
  shift_source_label: string

  is_override: boolean

  /** Baris `EmployeeShiftAssignment` yang memenangkan tanggal ini. */
  assignment_id: number | null

  /** Alasan tertulis penyesuaian; kosong kalau tanggalnya ikut roster. */
  assignment_reason: string
}

export interface ShiftCalendarEmployee {
  id: number
  employee_number: string
  name: string
  company: string
  location: string
  roster_policy: string
  roster_crew: string
  employee_group: string
}

export interface ShiftCalendarRange {
  start: string
  end: string
  days: number
}

export interface ShiftCalendarResponse {
  employee: ShiftCalendarEmployee
  range: ShiftCalendarRange
  is_roster: boolean
  attendance_applicable: boolean
  scheduled_days: number

  /**
   * Hari kerja yang dikosongkan aturan Minimum Rest. Dihitung backend —
   * jangan disimpulkan ulang dari `days`, karena baris pemulihan boleh
   * membentang melewati blok off dan pada tanggal itu tidak berarti
   * apa-apa.
   */
  recovery_days: number

  days: ShiftCalendarDay[]
}

/** Payload `POST /api/hr/shift-assignments/` untuk satu penyesuaian. */
export interface ShiftOverridePayload {
  employee: number
  shift: number
  layer: 'override'
  start_date: string
  end_date: string
  reason: string
}

/*
 * Bentuk respons `GET /api/hr/shift-calendar/access/`.
 *
 * Kesimpulan, bukan aturan: backend yang memutuskan siapa boleh melihat
 * siapa dan siapa boleh mengubah, dan yang dikirim ke sini hanya
 * hasilnya. Menyimpulkannya di frontend — dari jumlah baris dropdown,
 * dari kode role, dari apa pun — berarti menyalin aturan cakupan ke
 * tempat kedua, dan salinan kedua akan menyimpang tanpa ada yang
 * menyadarinya.
 */
export interface ShiftCalendarEmployeeBrief {
  id: number
  employee_number: string
  name: string
  location: string | null
}

export interface ShiftCalendarAccess {
  /** Kartu pegawai milik akun yang membuka layar; `null` untuk akun non-pegawai. */
  self_employee: ShiftCalendarEmployeeBrief | null

  /** Yang dipilihkan saat layar dibuka. `null` = biarkan kosong. */
  default_employee: ShiftCalendarEmployeeBrief | null

  /**
   * `false` = orang ini hanya boleh melihat satu kalender, jadi
   * penyaring pegawai tidak perlu ditampilkan sama sekali.
   */
  selector_required: boolean

  /** `hr.add_employeeshiftassignment` — izin **mengubah**, bukan melihat. */
  can_adjust: boolean
}
