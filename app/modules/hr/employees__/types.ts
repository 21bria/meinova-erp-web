export type EmployeesRow = {
  id: number
  is_active: boolean
  user: number | null
  user_name?: string | null
  employee_number: string
  nik: string
  first_name: string
  middle_name: string
  last_name: string
  preferred_name: string
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
  personal_email: string
  work_email: string
  phone: string
  mobile: string
  avatar: string
  notes: string
}

export type EmployeesPayload = {
  id?: number
  is_active: boolean
  user: number | null
  employee_number: string
  nik: string
  first_name: string
  middle_name: string
  last_name: string
  preferred_name: string
  gender: number | null
  religion: number | null
  nationality: number | null
  blood_type: number | null
  marital_status: number | null
  birth_place: string
  birth_date: string
  personal_email: string
  work_email: string
  phone: string
  mobile: string
  avatar: string
  notes: string
}