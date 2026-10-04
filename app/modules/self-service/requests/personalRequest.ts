/*
|--------------------------------------------------------------------------
| Pengajuan pribadi — My Workspace → Ajukan Cuti / Ajukan Izin
|--------------------------------------------------------------------------
|
| `/hr/leave/create?mode=my` dan `/hr/attendance-permissions/create?mode=my`.
|
| **Tidak ada formulir kedua.** Field-nya diambil dari definisi hasil
| generator (`form.ts` modul HR) lalu disaring ke daftar putih yang sama
| dengan backend (`apps/self_service/services/requests.py`). Yang dikirim
| ke `/api/me/*` **hanya** kolom dari daftar itu — tidak pernah
| `employee`. Backend tetap penjaganya: kolom lain ditolak di sana.
|
| Berkas ini murni supaya aturannya bisa diuji di lingkungan `node`.
*/

export type PersonalRequestKind = 'leave' | 'permission'

export interface PersonalRequestConfig {
  kind: PersonalRequestKind
  endpoint: string
  fields: readonly string[]
  /** Kunci `me.actions.*` — judul sama dengan tombol yang diklik. */
  titleKey: string
  /** Layar HR yang sama, untuk tautan "lihat dokumen". */
  hrRoute: string
}

export const PERSONAL_REQUESTS: Record<PersonalRequestKind, PersonalRequestConfig> = {
  leave: {
    kind: 'leave',
    endpoint: '/api/me/leave-requests/',
    fields: [
      'leave_type',
      'leave_reason',
      'start_date',
      'end_date',
      'is_half_day',
      'uploaded_file',
      'notes',
    ],
    titleKey: 'me.actions.leave_request',
    hrRoute: '/hr/leave',
  },
  permission: {
    kind: 'permission',
    endpoint: '/api/me/attendance-permissions/',
    fields: [
      'permission_type',
      'date',
      'start_time',
      'end_time',
      'reason',
      'supporting_document',
      'notes',
    ],
    titleKey: 'me.actions.permission_request',
    hrRoute: '/hr/attendance-permissions',
  },
}

/** Kunci yang tidak pernah boleh keluar dari formulir pribadi. */
export const IDENTITY_KEYS = [
  'employee',
  'employee_id',
  'user',
  'user_id',
  'id',
  'employee_number',
  'subject',
] as const

interface FieldLike {
  key?: string
  order?: number
  readonlyWhen?: unknown
  readonly_when?: unknown
  [name: string]: unknown
}

/**
 * Field formulir HR yang boleh tampil di jalur pribadi, berurutan.
 *
 * `readonlyWhen` dibuang: kondisinya membaca `can_edit` milik dokumen
 * yang sudah ada, dan pada formulir baru kolom itu tidak ada — tanpa
 * dibuang, seluruh field terkunci.
 */
export function personalFormSchema<F extends FieldLike>(
  schema: readonly F[],
  config: PersonalRequestConfig,
): F[] {
  const allowed = new Set(config.fields)

  return schema
    .filter(field => field?.key && allowed.has(String(field.key)))
    .map((field) => {
      const { readonlyWhen: _a, readonly_when: _b, ...rest } = field

      return rest as F
    })
    .sort(
      (a, b) =>
        config.fields.indexOf(String(a.key)) - config.fields.indexOf(String(b.key)),
    )
}

function normalize(value: unknown): unknown {
  // Nilai lookup kadang tersimpan sebagai objek `{id, ...}`.
  if (value && typeof value === 'object' && !Array.isArray(value) && 'id' in (value as object))
    return (value as { id: unknown }).id

  if (typeof value === 'string')
    return value.trim()

  return value
}

/**
 * Body permintaan: **hanya** kolom daftar putih, tanpa nilai kosong.
 *
 * Nilai kosong dibuang alih-alih dikirim `null`: kolom teks backend
 * menolak `null`, dan kolom opsional yang tidak dikirim memang berarti
 * "tidak diisi".
 */
export function buildPersonalPayload(
  model: Record<string, unknown>,
  config: PersonalRequestConfig,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {}

  for (const key of config.fields) {
    const value = normalize(model?.[key])

    if (value === undefined || value === null || value === '')
      continue

    payload[key] = value
  }

  return payload
}

/** "HO005 — Farah Anindita" */
export function identityLabel(
  context: { employee_number?: string | null, full_name?: string | null } | null,
): string {
  if (!context)
    return ''

  return [context.employee_number, context.full_name].filter(Boolean).join(' — ')
}

export function isPersonalMode(query: Record<string, unknown>): boolean {
  return query?.mode === 'my'
}
