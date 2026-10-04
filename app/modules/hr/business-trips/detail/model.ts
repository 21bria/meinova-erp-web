/*
|--------------------------------------------------------------------------
| Business Trip — pembacaan record untuk tab detail (BT-5)
|--------------------------------------------------------------------------
|
| Fungsi murni, tanpa DOM, supaya bisa diuji di lingkungan `node`.
|
| **Tidak ada aturan siklus hidup yang ditulis di sini.** Yang dibaca
| hanya yang sudah diputuskan backend: `status`, jejak waktu, `is_editable`,
| blok `approval`, dan izin model. Tombol aksinya sendiri datang dari
| `schema.actions` (`actions.ts`) dan ditolak/diterima service.
|
| Berkas ini di luar daftar yang ditulis generator, jadi regenerate modul
| tidak menimpanya — pola yang sama dengan `attendance-permissions/review/`.
*/

import type { ApprovalRow } from '@/modules/workflow/components/WorkflowApprovalTrail.vue'

export const BUSINESS_TRIP_ENDPOINT = '/api/hr/business-trips/'
export const BUSINESS_TRIP_LEG_ENDPOINT = '/api/hr/business-trip-legs/'

/** Jalur normal dokumen, urut. Ditolak/dibatalkan adalah ujung samping. */
export const LIFECYCLE = [
  'draft',
  'submitted',
  'approved',
  'on_trip',
  'completed',
] as const

export type LifecycleKey = typeof LIFECYCLE[number]

export type StepState = 'done' | 'current' | 'upcoming'

export interface LifecycleStep {
  key: LifecycleKey
  state: StepState
}

export interface BusinessTripRecord {
  id?: number
  status?: string | null
  is_editable?: boolean | null

  submitted_at?: string | null
  approved_at?: string | null
  rejected_at?: string | null
  departed_at?: string | null
  completed_at?: string | null
  cancelled_at?: string | null

  actual_departure_datetime?: string | null
  actual_return_datetime?: string | null
  cancellation_reason?: string | null

  supersedes?: number | null
  supersedes_number?: string | null
  supersede_type?: string | null
  supersede_type_label?: string | null
  superseded_by?: Array<{
    id: number
    document_number?: string | null
    supersede_type?: string | null
    status?: string | null
  }> | null

  legs?: Array<Record<string, any>> | null
  approval?: Record<string, any> | null

  [key: string]: any
}

/*
| Langkah terjauh yang sudah dicapai dokumen yang berakhir di samping.
| Dibaca dari jejak waktunya, bukan ditebak dari status.
*/
function reachedBeforeTerminal(record: BusinessTripRecord): LifecycleKey {
  if (record.status === 'rejected')
    return 'submitted'

  // Pembatalan hanya mungkin dari Approved / On Trip (service).
  if (record.departed_at || record.actual_departure_datetime)
    return 'on_trip'

  if (record.approved_at)
    return 'approved'

  return record.submitted_at ? 'submitted' : 'draft'
}

/** Ujung samping, kalau dokumennya berhenti di luar jalur normal. */
export function terminalState(
  record: BusinessTripRecord | null | undefined,
): 'rejected' | 'cancelled' | null {
  if (record?.status === 'rejected' || record?.status === 'cancelled')
    return record.status

  return null
}

/** Approved → On Trip → Completed, dengan posisi dokumen ini. */
export function lifecycleSteps(
  record: BusinessTripRecord | null | undefined,
): LifecycleStep[] {
  const status = String(record?.status ?? 'draft')

  const terminal = terminalState(record)

  const current: LifecycleKey = terminal
    ? reachedBeforeTerminal(record ?? {})
    : (LIFECYCLE as readonly string[]).includes(status)
        ? status as LifecycleKey
        : 'draft'

  const at = LIFECYCLE.indexOf(current)

  return LIFECYCLE.map((key, index) => ({
    key,
    state: index < at
      ? 'done'
      : index === at
        // Dokumen yang berhenti di samping tidak "sedang" di langkah
        // itu lagi — langkahnya selesai, lalu berhenti.
        ? (terminal || key === 'completed' ? 'done' : 'current')
        : 'upcoming',
  }))
}

export interface TimelineEvent {
  key: string
  at: string
}

/*
| Jejak waktu yang memang dikirim API. Waktu berangkat/kembali
| **aktual** ikut, karena itu yang membedakan "disetujui" dari "benar-
| benar berangkat".
*/
const TIMELINE_FIELDS = [
  'submitted_at',
  'approved_at',
  'rejected_at',
  'actual_departure_datetime',
  'actual_return_datetime',
  'completed_at',
  'cancelled_at',
] as const

export function timeline(record: BusinessTripRecord | null | undefined): TimelineEvent[] {
  if (!record)
    return []

  return TIMELINE_FIELDS
    .filter(key => Boolean(record[key]))
    .map(key => ({ key, at: String(record[key]) }))
    .sort((left, right) => Date.parse(left.at) - Date.parse(right.at))
}

/*
| Blok `approval` serializer → bentuk `WorkflowApprovalTrail`. Pemetaan
| yang sama dengan Attendance Permission (kunci serializer dokumen ≠ kunci
| endpoint trail engine).
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

/** Ruas perjalanan, urut seperti itinerary: sequence lalu id. */
export function orderedLegs<T extends Record<string, any>>(legs: T[] | null | undefined): T[] {
  return [...(legs ?? [])].sort((left, right) =>
    (Number(left.sequence ?? 0) - Number(right.sequence ?? 0))
    || (Number(left.id ?? 0) - Number(right.id ?? 0)),
  )
}

export interface TripLink {
  id: number
  number: string
  type: string | null
  status?: string | null
}

/** Dokumen yang digantikan / diperpanjang dokumen ini, dan sebaliknya. */
export function relationships(record: BusinessTripRecord | null | undefined): {
  supersedes: TripLink | null
  supersededBy: TripLink[]
} {
  const supersedes = record?.supersedes
    ? {
        id: Number(record.supersedes),
        number: record.supersedes_number || `#${record.supersedes}`,
        type: record.supersede_type ?? null,
      }
    : null

  const supersededBy = (record?.superseded_by ?? []).map(row => ({
    id: Number(row.id),
    number: row.document_number || `#${row.id}`,
    type: row.supersede_type ?? null,
    status: row.status ?? null,
  }))

  return { supersedes, supersededBy }
}

/** Salinan organisasi (read-only), urut seperti di dokumen. */
export const SNAPSHOT_FIELDS = [
  'company',
  'branch',
  'location',
  'division',
  'department',
  'section',
  'position',
  'cost_center',
  'origin_location',
] as const

export function snapshotItems(record: BusinessTripRecord | null | undefined) {
  return SNAPSHOT_FIELDS.map(key => ({
    key,
    value: (record?.[`${key}_name`] as string | null | undefined) || null,
  }))
}

export interface LegAccess {
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
}

/*
| Ruas bisa diubah hanya selama **backend** menyatakan dokumennya
| `is_editable`, dan hanya oleh pemegang izin model ruas. Peta izinnya
| `null` = belum/gagal dimuat → tidak menyembunyikan apa pun (konvensi
| `useResourceAccess`); API tetap penjaganya.
*/
export function legAccess(
  record: BusinessTripRecord | null | undefined,
  access: { create: boolean, update: boolean, delete: boolean } | null,
): LegAccess {
  const editable = record?.is_editable === true

  return {
    canCreate: editable && (access?.create ?? true),
    canEdit: editable && (access?.update ?? true),
    canDelete: editable && (access?.delete ?? true),
  }
}

/** Warna lencana status — tampilan saja, bukan aturan. */
export function statusTone(status: string | null | undefined): string {
  switch (status) {
    case 'submitted':
      return 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300'
    case 'approved':
      return 'border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-300'
    case 'on_trip':
      return 'border-indigo-300 bg-indigo-50 text-indigo-800 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-300'
    case 'completed':
      return 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300'
    case 'rejected':
      return 'border-destructive/40 bg-destructive/10 text-destructive'
    case 'cancelled':
      return 'border-muted-foreground/30 bg-muted text-muted-foreground line-through'
    default:
      return 'border-border bg-muted/40 text-foreground'
  }
}
