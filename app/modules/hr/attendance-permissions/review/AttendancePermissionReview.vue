<script setup lang="ts">
import type { ApprovalRow } from '@/modules/workflow/components/WorkflowApprovalTrail.vue'

/**
 * Panel peninjauan satu izin kehadiran.
 *
 * Empat blok yang harus terbaca bersamaan saat approver memutuskan:
 * jadwal yang dimintakan kelonggarannya, presensi sesungguhnya,
 * peringatan tabrakan, dan jejak persetujuan.
 *
 * **Tidak satu angka pun dihitung di sini.** Seluruh isinya dibaca apa
 * adanya dari serializer — `late_minutes`, `excused_late_minutes`, dan
 * selisihnya sudah diputuskan resolver di backend, dan menghitung
 * ulangnya di JavaScript berarti dua sumber untuk satu angka yang
 * cepat atau lambat berbeda. Yang dilakukan berkas ini cuma menata
 * letaknya.
 *
 * Ditaruh di `review/`, bukan di `components/`, karena `components/`
 * milik generator: berkas di sana ditimpa tiap kali module-nya
 * diregenerate.
 */
import { computed } from 'vue'

import WorkflowApprovalTrail from '@/modules/workflow/components/WorkflowApprovalTrail.vue'

const props = withDefaults(
  defineProps<{
    record?: Record<string, any> | null
    loading?: boolean
  }>(),
  {
    record: null,
    loading: false,
  },
)

const shift = computed(() => props.record?.shift ?? null)
const attendance = computed(() => props.record?.attendance ?? null)
const conflicts = computed<any[]>(() => props.record?.conflicts ?? [])
const approval = computed(() => props.record?.approval ?? null)

function clock(value?: string | null) {
  if (!value)
    return '—'

  return new Date(value).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function stamp(value?: string | null) {
  if (!value)
    return '—'

  return new Date(value).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function minutes(value?: number | null) {
  const total = Number(value ?? 0)

  if (!total)
    return '0 menit'

  const hours = Math.floor(total / 60)
  const rest = total % 60

  if (!hours)
    return `${rest} menit`

  return rest ? `${hours} jam ${rest} menit` : `${hours} jam`
}

const shiftWindow = computed(() => {
  const row = shift.value

  if (!row)
    return 'Belum ada jadwal shift untuk tanggal ini.'

  const label = [row.code, row.name].filter(Boolean).join(' — ')

  return `${label} · ${clock(row.start)}–${clock(row.end)}`
})

/*
 * Baris presensi → bentuk yang dibaca `WorkflowApprovalTrail`.
 *
 * Komponen jejaknya dipakai bersama seluruh modul dan bentuknya
 * mengikuti endpoint trail milik engine (`approver_name`, `status`,
 * `acted_at`, `comment`), sementara blok `approval` di serializer
 * memakai penamaan dokumennya sendiri (`approver`, `decision`,
 * `decided_at`, `notes`) — bentuk yang sama persis dipakai Travel
 * Request dan Visitor.
 *
 * Yang dipetakan **frontend**, bukan backend: mengubah kunci di
 * serializer akan membuat tiga modul yang sudah memakainya berbeda
 * bentuk, dan itu harga yang jauh lebih mahal daripada delapan baris
 * di sini.
 */
const trailRows = computed<ApprovalRow[]>(() => {
  const steps = approval.value?.steps ?? []

  return steps.map((step: any) => ({
    id: step.approval_id,
    sequence: step.sequence,
    name: step.name,
    status: step.decision,
    status_label: step.decision_label,
    approver_name: step.approver,
    acted_by_name: step.acted_by,
    comment: step.notes,
    acted_at: step.decided_at,
  }))
})

const currentStepName = computed(
  () => approval.value?.current_step?.name ?? null,
)

const hasAttendance = computed(() => Boolean(attendance.value))
</script>

<template>
  <div class="space-y-4">
    <!-- Peringatan lebih dulu: yang membuat approver ragu harus
         terbaca sebelum angkanya, bukan sesudah. -->
    <Alert
      v-for="conflict in conflicts"
      :key="conflict.code"
      variant="default"
      class="border-amber-300 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10"
    >
      <AlertTitle class="text-amber-900 dark:text-amber-200">
        Perlu diperiksa
      </AlertTitle>
      <AlertDescription class="text-amber-900 dark:text-amber-200">
        {{ conflict.message }}
      </AlertDescription>
    </Alert>

    <div class="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">
            Jadwal
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-2 text-sm">
          <div class="flex justify-between gap-4">
            <span class="text-muted-foreground">Shift terjadwal</span>
            <span class="text-right font-medium">{{ shiftWindow }}</span>
          </div>
          <div
            v-if="shift?.crosses_midnight"
            class="text-xs text-muted-foreground"
          >
            Shift ini melewati tengah malam — jam pulangnya jatuh di
            tanggal berikutnya.
          </div>
          <div class="flex justify-between gap-4">
            <span class="text-muted-foreground">Izin diminta</span>
            <span class="text-right font-medium">
              {{ record?.permission_type_label }} · {{ record?.time_window || "—" }}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">
            Presensi Sesungguhnya
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-2 text-sm">
          <p
            v-if="!hasAttendance"
            class="text-muted-foreground"
          >
            Belum ada baris presensi untuk tanggal ini. Izin tetap
            berlaku dan klasifikasinya menyusul begitu presensinya
            masuk.
          </p>

          <template v-else>
            <div class="flex justify-between gap-4">
              <span class="text-muted-foreground">Check in / out</span>
              <span class="text-right font-medium">
                {{ clock(attendance.check_in) }} – {{ clock(attendance.check_out) }}
              </span>
            </div>
            <div class="flex justify-between gap-4">
              <span class="text-muted-foreground">Status presensi</span>
              <span class="text-right font-medium">
                {{ attendance.status_label }}
              </span>
            </div>

            <Separator class="my-2" />

            <!-- Angka mentah tetap di atas, dan itu disengaja: yang
                 dimaafkan izin adalah **bagian** darinya, bukan
                 penggantinya. -->
            <div class="flex justify-between gap-4">
              <span class="text-muted-foreground">Terlambat</span>
              <span class="text-right font-medium">
                {{ minutes(attendance.late_minutes) }}
              </span>
            </div>
            <div
              v-if="attendance.late_minutes"
              class="flex justify-between gap-4"
            >
              <span class="pl-3 text-muted-foreground">Dimaafkan izin</span>
              <span class="text-right text-emerald-600 dark:text-emerald-400">
                {{ minutes(attendance.excused_late_minutes) }}
              </span>
            </div>
            <div
              v-if="attendance.late_minutes"
              class="flex justify-between gap-4"
            >
              <span class="pl-3 text-muted-foreground">Tanpa izin</span>
              <span
                class="text-right"
                :class="attendance.unauthorized_late_minutes
                  ? 'text-destructive font-medium'
                  : 'text-muted-foreground'"
              >
                {{ minutes(attendance.unauthorized_late_minutes) }}
              </span>
            </div>

            <template v-if="attendance.early_leave_minutes">
              <div class="flex justify-between gap-4">
                <span class="text-muted-foreground">Pulang cepat</span>
                <span class="text-right font-medium">
                  {{ minutes(attendance.early_leave_minutes) }}
                </span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="pl-3 text-muted-foreground">Dimaafkan izin</span>
                <span class="text-right text-emerald-600 dark:text-emerald-400">
                  {{ minutes(attendance.excused_early_leave_minutes) }}
                </span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="pl-3 text-muted-foreground">Tanpa izin</span>
                <span
                  class="text-right"
                  :class="attendance.unauthorized_early_leave_minutes
                    ? 'text-destructive font-medium'
                    : 'text-muted-foreground'"
                >
                  {{ minutes(attendance.unauthorized_early_leave_minutes) }}
                </span>
              </div>
            </template>

            <div
              v-if="attendance.permission_minutes"
              class="flex justify-between gap-4"
            >
              <span class="text-muted-foreground">Keluar sementara</span>
              <span class="text-right font-medium">
                {{ minutes(attendance.permission_minutes) }}
              </span>
            </div>

            <div
              v-if="attendance.is_excused_absence"
              class="flex justify-between gap-4"
            >
              <span class="text-muted-foreground">Ketidakhadiran</span>
              <span class="text-right font-medium text-emerald-600 dark:text-emerald-400">
                Ada izin (bukan mangkir)
              </span>
            </div>

            <div class="flex justify-between gap-4 pt-1">
              <span class="text-muted-foreground">Klasifikasi</span>
              <WorkflowStatusBadge
                :status="attendance.permission_state"
                :label="attendance.permission_state_label"
              />
            </div>
          </template>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base">
          Persetujuan
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-3">
        <p
          v-if="!approval"
          class="text-sm text-muted-foreground"
        >
          Belum diajukan. Jejak persetujuan terbit setelah tombol
          Submit ditekan.
        </p>

        <template v-else>
          <div class="flex flex-wrap items-center gap-2 text-sm">
            <span class="text-muted-foreground">Alur</span>
            <span class="font-medium">{{ approval.flow }}</span>
            <span class="text-muted-foreground">·</span>
            <span class="text-muted-foreground">Diajukan</span>
            <span class="font-medium">{{ stamp(approval.submitted_at) }}</span>
          </div>

          <WorkflowApprovalTrail
            :rows="trailRows"
            :current-step="currentStepName"
            :loading="loading"
          />
        </template>
      </CardContent>
    </Card>
  </div>
</template>
