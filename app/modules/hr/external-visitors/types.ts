export type ExternalVisitorsRow = {
  id: number
  is_active: boolean
  visitor_number: string
  full_name: string
  identity_type: string
  identity_number: string
  gender: number | null
  gender_name?: string | null
  date_of_birth: string
  nationality: number | null
  nationality_name?: string | null
  email: string
  phone: string
  mobile: string
  organization_name: string
  position: string
  city: number | null
  city_name?: string | null
  country: number | null
  country_name?: string | null
  address: string
  emergency_contact_name: string
  emergency_contact_phone: string
  notes: string
  is_blacklisted: boolean
  blacklist_reason: string
  identity_type_label: string
  visit_count: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type ExternalVisitorsPayload = {
  id?: number
  is_active: boolean
  full_name: string
  identity_type: string
  identity_number: string
  gender: number | null
  date_of_birth: string
  nationality: number | null
  email: string
  phone: string
  mobile: string
  organization_name: string
  position: string
  city: number | null
  country: number | null
  address: string
  emergency_contact_name: string
  emergency_contact_phone: string
  notes: string
  is_blacklisted: boolean
  blacklist_reason: string
}