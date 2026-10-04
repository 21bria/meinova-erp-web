/*
| Asset Management — penolong tampilan bersama (ASSET-6).
|
| Ditulis tangan; generator tidak menyentuh `app/modules/assets/shared/`
| maupun `app/modules/assets/register/detail/`. **Tidak ada aturan
| bisnis di sini**: boleh-tidaknya sebuah aksi dijawab backend
| (`can_*`, `approval.can_act`), custody dibaca dari baris custody yang
| dikirim API, dan status hanya dipakai untuk memilih warna/kalimat.
*/

import type { ApprovalRow } from '@/modules/workflow/components/WorkflowApprovalTrail.vue'

export const ASSET_ENDPOINT = '/api/assets/assets/'

export type MovementKind = 'assignments' | 'returns' | 'transfers'

export const MOVEMENT_ENDPOINTS: Record<MovementKind, string> = {
  assignments: '/api/assets/assignments/',
  transfers: '/api/assets/transfers/',
  returns: '/api/assets/returns/',
}

/** Rute halaman detail dokumen — sama dengan `register_route` backend. */
export function movementRoute(kind: MovementKind, id: number | string): string {
  return `/assets/${kind}/${id}`
}

export interface CustodyDocument {
  type: string
  type_label: string
  document_id: number | null
  document_number: string | null
  route: string | null
}

export interface CustodyRow {
  id: number
  custody_type: 'EMPLOYEE' | 'ORGANIZATION' | 'STORAGE' | string
  custody_type_label?: string
  holder?: string
  employee?: number | null
  employee_name?: string | null
  department?: number | null
  department_name?: string | null
  pic_employee?: number | null
  pic_employee_name?: string | null
  location?: number | null
  location_name?: string | null
  facility?: number | null
  facility_name?: string | null
  started_on?: string | null
  ended_on?: string | null
  start_condition?: string | null
  end_condition?: string | null
  is_current?: boolean
  opened_by?: CustodyDocument | null
  closed_by?: CustodyDocument | null
}

export interface ConditionRow {
  id: number
  previous_condition?: string
  previous_condition_label?: string
  new_condition: string
  new_condition_label?: string
  source: string
  source_label?: string
  effective_at: string
  recorded_by?: number | null
  recorded_by_name?: string | null
  note?: string
}

/*
| Amplop daftar backend: `{data: [...], meta}` — bukan `{results}`
| bawaan DRF. Halaman tulis tangan yang menebak `results` tampil kosong
| tanpa error, jadi dibaca di satu tempat.
*/
export function rowsOf<T>(response: any): T[] {
  if (Array.isArray(response?.data))
    return response.data as T[]

  if (Array.isArray(response?.results))
    return response.results as T[]

  if (Array.isArray(response?.data?.results))
    return response.data.results as T[]

  return Array.isArray(response) ? (response as T[]) : []
}

const STATUS_TONE: Record<string, string> = {
  draft: 'border-slate-300 text-slate-700 dark:text-slate-300',
  submitted: 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300',
  approved: 'bg-sky-100 text-sky-900 border-sky-200 dark:bg-sky-500/15 dark:text-sky-300',
  completed: 'bg-emerald-600 text-white border-transparent',
  active: 'bg-emerald-600 text-white border-transparent',
  rejected: 'bg-destructive text-white border-transparent',
  cancelled: 'border-slate-300 text-muted-foreground line-through',
}

const CONDITION_TONE: Record<string, string> = {
  good: 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300',
  fair: 'bg-sky-100 text-sky-900 border-sky-200 dark:bg-sky-500/15 dark:text-sky-300',
  damaged: 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300',
  unserviceable: 'bg-destructive text-white border-transparent',
}

const CUSTODY_TONE: Record<string, string> = {
  storage: 'border-slate-300 text-slate-700 dark:text-slate-300',
  employee: 'bg-violet-100 text-violet-900 border-violet-200 dark:bg-violet-500/15 dark:text-violet-300',
  organization: 'bg-teal-100 text-teal-900 border-teal-200 dark:bg-teal-500/15 dark:text-teal-300',
}

export type BadgeKind = 'status' | 'condition' | 'custody'

export function badgeTone(kind: BadgeKind, value: string | null | undefined): string {
  const key = String(value ?? '').toLowerCase()
  const table = kind === 'status' ? STATUS_TONE : kind === 'condition' ? CONDITION_TONE : CUSTODY_TONE

  return table[key] ?? 'border-slate-300'
}

/*
| Blok `approval` serializer → baris `WorkflowApprovalTrail`. Bentuk
| bloknya sama dengan dokumen HR/Payroll (backend `workflow_approval`).
*/
export function trailRows(approval: Record<string, any> | null | undefined): ApprovalRow[] {
  const steps = Array.isArray(approval?.steps) ? approval.steps : []

  return steps.map((step: any) => ({
    id: step.approval_id,
    sequence: step.sequence,
    name: step.name,
    status: step.decision,
    status_label: step.decision_label,
    approver_name: step.approver,
    comment: step.notes,
    acted_at: step.decided_at,
  }))
}

/** Satu sisi dokumen pergerakan (asal/tujuan) siap tampil. */
export interface MovementSide {
  custodyType: string | null
  holder: string | null
  pic: string | null
  location: string | null
  facility: string | null
}

function side(record: Record<string, any>, keys: {
  type: string | null
  fixedType?: string
  employee: string | null
  department: string | null
  pic: string | null
  location: string
  facility: string
}): MovementSide {
  const custodyType = keys.fixedType ?? (keys.type ? record[keys.type] : null) ?? null
  const employee = keys.employee ? record[`${keys.employee}_name`] : null
  const department = keys.department ? record[`${keys.department}_name`] : null

  return {
    custodyType,
    holder: employee || department || null,
    pic: keys.pic ? (record[`${keys.pic}_name`] ?? null) : null,
    location: record[`${keys.location}_name`] ?? null,
    facility: record[`${keys.facility}_name`] ?? null,
  }
}

/*
| Asal dan tujuan tiap jenis dokumen, dari kolom yang dikirim serializer.
| Assignment selalu dari STORAGE; Return selalu ke STORAGE — itu fakta
| semantik dokumennya (backend), bukan tebakan layar.
*/
export function movementSides(kind: MovementKind, record: Record<string, any> | null | undefined): {
  source: MovementSide
  target: MovementSide
} | null {
  if (!record)
    return null

  if (kind === 'assignments') {
    return {
      source: side(record, {
        type: null,
        fixedType: 'STORAGE',
        employee: null,
        department: null,
        pic: null,
        location: 'source_location',
        facility: 'source_facility',
      }),
      target: side(record, {
        type: 'target_custody_type',
        employee: 'employee',
        department: 'department',
        pic: 'pic_employee',
        location: 'location',
        facility: 'facility',
      }),
    }
  }

  if (kind === 'returns') {
    return {
      source: side(record, {
        type: 'source_custody_type',
        employee: 'source_employee',
        department: 'source_department',
        pic: 'source_pic_employee',
        location: 'source_location',
        facility: 'source_facility',
      }),
      target: side(record, {
        type: null,
        fixedType: 'STORAGE',
        employee: null,
        department: null,
        pic: null,
        location: 'destination_location',
        facility: 'destination_facility',
      }),
    }
  }

  return {
    source: side(record, {
      type: 'source_custody_type',
      employee: 'source_employee',
      department: 'source_department',
      pic: 'source_pic_employee',
      location: 'source_location',
      facility: 'source_facility',
    }),
    target: side(record, {
      type: 'target_custody_type',
      employee: 'target_employee',
      department: 'target_department',
      pic: 'target_pic_employee',
      location: 'target_location',
      facility: 'target_facility',
    }),
  }
}

/** Kunci kalimat siklus hidup per status (`assets.ui.lifecycle.hint.*`). */
export const LIFECYCLE_STATUSES = ['draft', 'submitted', 'approved', 'completed', 'rejected', 'cancelled'] as const
