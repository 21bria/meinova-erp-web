/**
 * Foto pegawai dalam bentuk yang sudah siap dipasang layar.
 *
 * Dirakit backend (`resolve_employee_avatar`), bukan di sini: urutan
 * bacanya `avatar_file` → `avatar` lama → inisial, dan urutan yang
 * disalin ke frontend adalah cara dua layar mulai menampilkan foto
 * berbeda untuk orang yang sama.
 *
 * `url` sudah berupa alamat `preview/` yang berautentikasi — lihat
 * `framework/core/utils/authedImage.ts` soal kenapa ia tidak bisa
 * langsung dipasang ke `<img src>`.
 */
export type EmployeeAvatarDisplay = {
  url: string | null
  source: "upload" | "legacy" | null
  initials: string
}

/**
 * Berkas foto untuk widget unggah di form (`detailField` field
 * `avatar_file`). Versi referensi dari backend: tanpa `file_url` /
 * `thumbnail_url` — jalur `MEDIA_URL` statis — hanya alamat
 * berautentikasi.
 */
export type EmployeeAvatarFileDetail = {
  id: number
  public_id: string
  original_name: string
  extension?: string | null
  mime_type?: string | null
  file_type?: string | null
  category?: string | null
  size?: number | null
  size_display?: string | null
  preview_url?: string | null
  download_url?: string | null
  updated_at?: string | null
}

export type EmployeesRow = {
  id: number
  user: number | null
  user_name?: string | null
  employee_number: string
  nik: string
  passport_number: string
  tax_number: string
  first_name: string
  last_name: string
  gender: number | null
  gender_name?: string | null
  religion: number | null
  religion_name?: string | null
  nationality: number | null
  nationality_name?: string | null
  blood_type: number | null
  blood_type_name?: string | null
  marital_status: number | null
  marital_status_name?: string | null
  birth_place: string
  birth_date: string
  address: string
  province: number | null
  province_name?: string | null
  city: number | null
  city_name?: string | null
  district: number | null
  district_name?: string | null
  village: number | null
  village_name?: string | null
  personal_email: string
  work_email: string
  phone: string
  mobile: string
  emergency_contact_phone: string
  emergency_contact_name: string
  avatar: string
  avatar_file: number | null
  avatar_file_detail?: EmployeeAvatarFileDetail | null
  avatar_display?: EmployeeAvatarDisplay | null
  notes: string
  is_active: boolean
  auto_generate_employee_number: boolean
  nationality_code: string
  company: number | null
  company_name?: string | null
  branch: number | null
  branch_name?: string | null
  location: number | null
  location_name?: string | null
  division: number | null
  division_name?: string | null
  department: number | null
  department_name?: string | null
  section: number | null
  section_name?: string | null
  position: number | null
  position_name?: string | null
  job_level: number | null
  job_level_name?: string | null
  job_grade: number | null
  job_grade_name?: string | null
  reports_to: number | null
  reports_to_name?: string | null
  cost_center: number | null
  cost_center_name?: string | null
  organization_effective_date: string
  organization_notes: string
  employment_status: number | null
  employment_status_name?: string | null
  employment_type: number | null
  employment_type_name?: string | null
  employment_type_requires_contract: boolean
  employee_group: number | null
  employee_group_name?: string | null
  contract_type: number | null
  contract_type_name?: string | null
  probation_type: number | null
  probation_type_name?: string | null
  employment_effective_date: string
  join_date: string
  confirmation_date: string
  probation_start: string
  probation_end: string
  contract_start: string
  contract_end: string
  job_location: string
  point_of_hire: number | null
  point_of_hire_name?: string | null
  work_schedule: number | null
  work_schedule_name?: string | null
  working_calendar: number | null
  working_calendar_name?: string | null
  shift: number | null
  shift_name?: string | null
  roster_crew: number | null
  roster_crew_name?: string | null
  roster_crew_work_schedule: string
  roster_start_override: string
  roster_policy: number | null
  roster_policy_name?: string | null
  roster_policy_cycle_length: string
  roster_start_basis_label: string
  roster_cycle_start: string
  back_to_back_partner: number | null
  back_to_back_partner_name?: string | null
  travel_days_override: number
  notice_period_days: number
  employment_notes: string
  payroll_group: string
  salary_grade: string
  salary_level: string
  currency: string
  payment_method: string
  tax_status: string
  tax_number_payroll: string
  bpjs_kesehatan_number: string
  bpjs_ketenagakerjaan_number: string
  overtime_eligible: string
  overtime_group: string
  basic_salary: string
  allowance_template: string
  deduction_template: string
  effective_from: string
  effective_to: string
  payroll_notes: string
  full_name: string
  display_name: string
  employee_group_shift_applicable: boolean
  employee_group_roster_applicable: boolean
}

export type EmployeesPayload = {
  id?: number
  user: number | null
  employee_number: string
  nik: string
  passport_number: string
  tax_number: string
  first_name: string
  last_name: string
  gender: number | null
  religion: number | null
  nationality: number | null
  blood_type: number | null
  marital_status: number | null
  birth_place: string
  birth_date: string
  address: string
  province: number | null
  city: number | null
  district: number | null
  village: number | null
  personal_email: string
  work_email: string
  phone: string
  mobile: string
  emergency_contact_phone: string
  emergency_contact_name: string
  avatar_file: number | null
  notes: string
  is_active: boolean
  auto_generate_employee_number: boolean
  company: number | null
  branch: number | null
  location: number | null
  division: number | null
  department: number | null
  section: number | null
  position: number | null
  job_level: number | null
  job_grade: number | null
  reports_to: number | null
  cost_center: number | null
  organization_effective_date: string
  organization_notes: string
  employment_status: number | null
  employment_type: number | null
  employee_group: number | null
  contract_type: number | null
  probation_type: number | null
  employment_effective_date: string
  join_date: string
  confirmation_date: string
  probation_start: string
  probation_end: string
  contract_start: string
  contract_end: string
  job_location: string
  point_of_hire: number | null
  work_schedule: number | null
  working_calendar: number | null
  shift: number | null
  roster_crew: number | null
  roster_start_override: string
  roster_policy: number | null
  roster_cycle_start: string
  back_to_back_partner: number | null
  travel_days_override: number
  notice_period_days: number
  employment_notes: string
  payroll_group: string
  salary_grade: string
  salary_level: string
  currency: string
  payment_method: string
  tax_status: string
  tax_number_payroll: string
  bpjs_kesehatan_number: string
  bpjs_ketenagakerjaan_number: string
  overtime_eligible: string
  overtime_group: string
  basic_salary: string
  allowance_template: string
  deduction_template: string
  effective_from: string
  effective_to: string
  payroll_notes: string
}