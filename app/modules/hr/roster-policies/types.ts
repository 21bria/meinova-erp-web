export type RosterPoliciesRow = {
  id: number
  is_active: boolean
  company: number | null
  company_name?: string | null
  location: number | null
  location_name?: string | null
  code: string
  name: string
  description: string
  is_default: boolean
  cycle_work_days: string
  cycle_off_days: string
  roster_start_basis: string
  rolling_horizon_months: string
  min_rest_hours: string
  default_travel_out_days: string
  default_travel_in_days: string
  travel_day_mode: string
  travel_creates_segment: boolean
  travel_out_counts_as_roster_day: boolean
  travel_in_counts_as_roster_day: boolean
  count_transit_overnight: boolean
  travel_variance_credit_eligible: boolean
  travel_variance_credit_max_days: string
  credit_enabled: boolean
  conversion_ratio: string
  credit_rounding: string
  credit_carry_remainder: boolean
  credit_max_balance_days: string
  credit_expiry_months: string
  credit_allow_negative: boolean
  request_lead_days: string
  notify_lead_days: string
  urgent_purposes: number[]
  travel_day_count: string
  cycle_length: string
  derived_ratio: string
  has_cycle_pattern: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type RosterPoliciesPayload = {
  id?: number
  is_active: boolean
  company: number | null
  location: number | null
  code: string
  name: string
  description: string
  is_default: boolean
  cycle_work_days: string
  cycle_off_days: string
  roster_start_basis: string
  rolling_horizon_months: string
  min_rest_hours: string
  default_travel_out_days: string
  default_travel_in_days: string
  travel_day_mode: string
  travel_creates_segment: boolean
  travel_out_counts_as_roster_day: boolean
  travel_in_counts_as_roster_day: boolean
  count_transit_overnight: boolean
  travel_variance_credit_eligible: boolean
  travel_variance_credit_max_days: string
  credit_enabled: boolean
  conversion_ratio: string
  credit_rounding: string
  credit_carry_remainder: boolean
  credit_max_balance_days: string
  credit_expiry_months: string
  credit_allow_negative: boolean
  request_lead_days: string
  notify_lead_days: string
  urgent_purposes: number[]
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}