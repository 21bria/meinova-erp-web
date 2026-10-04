<script setup lang="ts">
import { CircleDashed, CircleCheck, CircleX, MinusCircle, Undo2 } from 'lucide-vue-next'
import WorkflowStatusBadge from './WorkflowStatusBadge.vue'

/**
 * Kotak tanda tangan satu dokumen.
 *
 * Menampilkan **semua** baris sejak awal, termasuk yang dilewati —
 * backend memang membuatnya di depan supaya formulir tercetak
 * memperlihatkan seluruh kotak. Baris yang dilewati ikut membawa
 * alasannya; kotak kosong tanpa penjelasan adalah keluhan yang paling
 * sering sampai ke HR.
 */
export interface ApprovalRow {
  id?: number
  sequence?: number
  name?: string
  status?: string
  status_label?: string
  approver_name?: string | null
  approver_number?: string | null
  acted_by_name?: string | null
  delegated_from?: string | null
  comment?: string
  assignment_reference?: string
  acted_at?: string | null
}

const props = withDefaults(
  defineProps<{
    rows?: ApprovalRow[]
    loading?: boolean
    currentStep?: string | null
  }>(),
  {
    rows: () => [],
    loading: false,
    currentStep: null,
  },
)

const ICONS: Record<string, any> = {
  approved: CircleCheck,
  rejected: CircleX,
  returned: Undo2,
  skipped: MinusCircle,
  cancelled: MinusCircle,
  pending: CircleDashed,
}

const ICON_CLASS: Record<string, string> = {
  approved: 'text-emerald-600',
  rejected: 'text-destructive',
  returned: 'text-orange-500',
  pending: 'text-amber-500',
}

function icon(status?: string) {
  return ICONS[String(status ?? '').toLowerCase()] ?? CircleDashed
}

function iconClass(status?: string) {
  return ICON_CLASS[String(status ?? '').toLowerCase()] ?? 'text-muted-foreground'
}

function formatDate(value?: string | null) {
  if (!value)
    return null

  return new Date(value).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Baris yang dilewati tetap menyimpan alasannya di
// `assignment_reference`; baris yang diputuskan menyimpan catatan
// approver di `comment`. Yang ditampilkan yang relevan, bukan keduanya.
function note(row: ApprovalRow) {
  if (row.comment)
    return row.comment

  return row.assignment_reference || null
}

const sorted = computed(() =>
  [...props.rows].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0)),
)
</script>

<template>
  <div class="space-y-3">
    <div v-if="loading" class="space-y-3">
      <Skeleton v-for="n in 3" :key="n" class="h-16 w-full" />
    </div>

    <div
      v-else-if="!sorted.length"
      class="flex min-h-32 items-center justify-center rounded-md border border-dashed"
    >
      <p class="text-sm text-muted-foreground">
        Dokumen ini belum pernah diajukan ke alur persetujuan.
      </p>
    </div>

    <ol v-else class="relative space-y-0">
      <li
        v-for="(row, index) in sorted"
        :key="row.id ?? index"
        class="relative flex gap-4 pb-5 last:pb-0"
      >
        <!-- Garis penyambung antar kotak, dipotong di baris terakhir -->
        <span
          v-if="index < sorted.length - 1"
          class="absolute left-[11px] top-7 h-[calc(100%-1.25rem)] w-px bg-border"
          aria-hidden="true"
        />

        <component
          :is="icon(row.status)"
          class="relative z-10 mt-0.5 h-6 w-6 shrink-0 bg-background"
          :class="iconClass(row.status)"
        />

        <div class="min-w-0 flex-1 space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm font-medium">
              #{{ row.sequence }} {{ row.name }}
            </span>

            <WorkflowStatusBadge
              :status="row.status"
              :label="row.status_label"
            />

            <Badge
              v-if="currentStep && row.name === currentStep && row.status === 'pending'"
              variant="outline"
              class="border-amber-300 text-amber-700 dark:text-amber-300"
            >
              Menunggu sekarang
            </Badge>
          </div>

          <p class="text-sm text-muted-foreground">
            {{ row.approver_name || 'Approver tidak ditemukan' }}
            <span v-if="row.approver_number" class="text-xs">
              ({{ row.approver_number }})
            </span>
          </p>

          <!-- Yang menandatangani atas nama orang lain harus terbaca,
               bukan disamarkan jadi seolah atasannya sendiri. -->
          <p v-if="row.delegated_from" class="text-xs text-orange-600 dark:text-orange-400">
            Diputuskan {{ row.acted_by_name }} atas nama {{ row.delegated_from }}
          </p>

          <p v-if="note(row)" class="text-sm">
            {{ note(row) }}
          </p>

          <p v-if="formatDate(row.acted_at)" class="text-xs text-muted-foreground">
            {{ formatDate(row.acted_at) }}
          </p>
        </div>
      </li>
    </ol>
  </div>
</template>
