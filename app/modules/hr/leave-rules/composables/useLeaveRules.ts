import { computed, ref, watch } from 'vue'

import { useApi } from '@/composables/useApi'

/**
 * Aturan cuti yang berlaku untuk satu dokumen — **selalu dari backend**.
 *
 * Ditulis tangan dan tinggal di luar folder modul hasil generate, jadi
 * `pnpm meinova generate hr/leave` tidak menimpanya. Pola yang sama
 * dengan `useNotificationAdmin`.
 *
 * Kenapa preview-nya harus menembak server sama sekali: layar Create
 * belum punya record, jadi tidak ada `policy_rules` untuk dibacakan.
 * Satu-satunya alternatifnya menghitung ulang saldo, hari kerja, dan
 * riwayat di sini — dan sejak itu ada dua penilai untuk satu aturan,
 * yang cepat atau lambat berbeda. Yang berbeda diam-diam: layar bilang
 * boleh, server menolak saat Simpan.
 */

export interface LeaveRuleFinding {
  code: string
  level: 'block' | 'review' | 'warning'
  field: string
  message: string
}

export interface LeaveRuleBalance {
  exists: boolean
  year: number
  entitlement?: string
  carried_over?: string
  opening_balance?: string
  adjustment?: string
  used?: string
  remaining?: string
  available: string
  requested: string
  sufficient: boolean
  eligible_date?: string | null
}

export interface LeaveRuleHistoryRow {
  id: number
  document_number: string | null
  leave_type: string | null
  event_date: string | null
  end_date: string | null
  days: string | null
  status: string
  status_label: string
}

export interface LeaveRulePayload {
  policy_code: string | null
  policy_name: string | null
  uses_balance: boolean
  per_event: boolean
  max_days: string | null
  document_required: boolean
  needs_review: boolean
  findings: LeaveRuleFinding[]
  history: LeaveRuleHistoryRow[]
  history_total: number
  history_evaluated: boolean
  balance: LeaveRuleBalance | null
  balance_evaluated: boolean
}

/** Model form menyimpan lookup sebagai objek atau sebagai id mentah. */
function toId(raw: any): string | number | null {
  if (raw === null || raw === undefined || raw === '')
    return null

  if (typeof raw === 'object')
    return raw.id ?? raw.value ?? null

  return raw
}

export function useLeaveRules() {
  const { request } = useApi()

  function previewRules(payload: Record<string, any>) {
    return request('/api/hr/leaves/preview-rules/', {
      method: 'POST',
      body: payload,
    })
  }

  return { previewRules }
}

/**
 * Penilaian hidup untuk form yang sedang diisi.
 *
 * Di-debounce 400ms: tanpa itu setiap ketikan pada kolom tanggal
 * menembak satu request, dan yang terakhir datang belum tentu yang
 * terakhir dikirim — hasilnya panel berkedip lalu menampilkan penilaian
 * atas isian yang sudah tidak ada lagi di layar.
 */
export function useLeaveRulesPreview(
  model: () => Record<string, any>,
  options: { enabled?: () => boolean, recordId?: () => any } = {},
) {
  const { previewRules } = useLeaveRules()

  const rules = ref<LeaveRulePayload | null>(null)
  const totalDays = ref<string | null>(null)
  const loading = ref(false)

  let timer: ReturnType<typeof setTimeout> | null = null

  // Nomor urut permintaan. Balasan yang datang setelah permintaan yang
  // lebih baru dibuang — jaringan tidak menjamin urutan, dan panel yang
  // menampilkan hasil basi terbaca persis seperti hasil yang benar.
  let ticket = 0

  const key = computed(() => {
    const value = model() ?? {}

    return JSON.stringify({
      employee: toId(value.employee),
      leave_type: toId(value.leave_type),
      start_date: value.start_date ?? null,
      end_date: value.end_date ?? null,
      is_half_day: value.is_half_day ?? false,
      total_days: value.total_days ?? null,
      uploaded_file: toId(value.uploaded_file),
    })
  })

  async function run() {
    if (options.enabled && !options.enabled())
      return

    const value = model() ?? {}

    const employee = toId(value.employee)
    const leaveType = toId(value.leave_type)

    // Form yang baru diisi separuh adalah keadaan normal. Panelnya
    // sekadar tidak tampil — bukan pesan error, dan bukan request.
    if (!employee || !leaveType) {
      rules.value = null
      totalDays.value = null
      return
    }

    const mine = ++ticket

    loading.value = true

    try {
      const res: any = await previewRules({
        id: options.recordId?.() ?? null,
        employee,
        leave_type: leaveType,
        start_date: value.start_date ?? null,
        end_date: value.end_date ?? null,
        is_half_day: Boolean(value.is_half_day),
        total_days: value.total_days ?? null,
        uploaded_file: toId(value.uploaded_file),
      })

      if (mine !== ticket)
        return

      rules.value = res?.data?.rules ?? null
      totalDays.value = res?.data?.total_days ?? null
    }
    catch {
      // Panel pendamping tidak boleh menjatuhkan form yang sedang
      // diisi. Yang menolak sungguhan tetap jalur Simpan, dan
      // pesannya muncul di sana.
      if (mine === ticket) {
        rules.value = null
        totalDays.value = null
      }
    }
    finally {
      if (mine === ticket)
        loading.value = false
    }
  }

  watch(
    key,
    () => {
      if (timer)
        clearTimeout(timer)

      timer = setTimeout(run, 400)
    },
    { immediate: true },
  )

  return { rules, totalDays, loading, refresh: run }
}
