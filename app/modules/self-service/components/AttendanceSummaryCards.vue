<script setup lang="ts">
import type { SelfAttendanceSummary, SelfMetric } from '../types'

/**
 * Delapan angka periode berjalan.
 *
 * **Yang tidak berlaku tidak ditulis nol.** Backend mengirim `available`
 * bersama tiap angka; kartu yang prosesnya dimatikan Employee Group
 * menampilkan "Tidak berlaku" alih-alih angka. Bedanya bukan kosmetik:
 * "Tidak Hadir 0" kepada orang yang memang tidak pernah diabsen adalah
 * pernyataan yang salah, dan ia terbaca sebagai pujian.
 *
 * Lima kartu berupa cacahan hari dan dua berupa durasi; keduanya
 * memakai skala tipografi yang sama supaya barisnya terbaca sebagai satu
 * kelompok, bukan dua.
 */
import {
  BriefcaseBusiness,
  CalendarDays,
  CalendarOff,
  Clock,
  Timer,
  TriangleAlert,
  UserCheck,
  UserX,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { durationText } from '../format'

const props = defineProps<{ summary: SelfAttendanceSummary }>()

const { t } = useI18n()

interface Tile {
  key: string
  label: string
  metric: SelfMetric
  icon: typeof Clock
  duration?: boolean
  tone?: string
}

const tiles = computed<Tile[]>(() => [
  {
    key: 'workDays',
    label: t('me.attendance.summary.workDays'),
    metric: props.summary.work_days,
    icon: CalendarDays,
  },
  {
    key: 'present',
    label: t('me.attendance.summary.present'),
    metric: props.summary.present,
    icon: UserCheck,
  },
  {
    key: 'late',
    label: t('me.attendance.summary.late'),
    metric: props.summary.late,
    icon: TriangleAlert,
    // Amber, bukan merah: terlambat adalah catatan yang perlu terlihat,
    // bukan pelanggaran yang perlu diteriakkan. Nuansa yang sama dengan
    // `ATTENDANCE_TINTS.late`.
    tone: props.summary.late.value > 0
      ? 'text-amber-600 dark:text-amber-400'
      : '',
  },
  {
    key: 'absent',
    label: t('me.attendance.summary.absent'),
    metric: props.summary.absent,
    icon: UserX,
    tone: props.summary.absent.value > 0 ? 'text-destructive' : '',
  },
  {
    // Hari dinas tanpa tap (BT-3R) — bukan "Hadir", bukan "Tidak Hadir".
    // Backend lama yang belum mengirimnya terbaca "tidak berlaku", bukan 0.
    key: 'businessTrip',
    label: t('me.attendance.summary.businessTrip'),
    metric: props.summary.business_trip ?? { value: 0, available: false },
    icon: BriefcaseBusiness,
  },
  {
    key: 'leave',
    label: t('me.attendance.summary.leave'),
    metric: props.summary.leave_days,
    icon: CalendarOff,
  },
  {
    key: 'workedHours',
    label: t('me.attendance.summary.workedHours'),
    metric: props.summary.worked_minutes,
    icon: Clock,
    duration: true,
  },
  {
    key: 'overtime',
    label: t('me.attendance.summary.overtime'),
    metric: props.summary.overtime_minutes,
    icon: Timer,
    duration: true,
  },
])

function shown(tile: Tile): string {
  if (!tile.metric.available)
    return t('me.attendance.summary.notApplicable')

  if (tile.duration) {
    const { key, params } = durationText(tile.metric.value)

    return t(key, params)
  }

  // Cuti bisa setengah hari. `0,5` ditulis apa adanya; `5,0` tidak.
  return String(Number(tile.metric.value))
}
</script>

<template>
  <div
    class="grid grid-cols-2 gap-3 sm:grid-cols-4"
    data-testid="attendance-summary"
  >
    <Card
      v-for="tile in tiles"
      :key="tile.key"
      class="gap-0 py-4"
    >
      <CardContent class="space-y-1.5 px-4">
        <div class="flex items-center gap-1.5 text-muted-foreground">
          <component :is="tile.icon" class="size-3.5 shrink-0" aria-hidden="true" />

          <p class="truncate text-[11px] font-semibold tracking-wider uppercase">
            {{ tile.label }}
          </p>
        </div>

        <p
          v-if="tile.metric.available"
          class="text-xl leading-tight font-semibold tracking-tight break-words"
          :class="tile.tone"
          :data-testid="`metric-${tile.key}`"
        >
          {{ shown(tile) }}
        </p>

        <!--
          Bukan angka, jadi bukan tipografi angka. Ditulis kecil dan
          kelabu supaya tidak ikut terbaca saat mata memindai deretan
          angkanya — yang dicari di baris ini besaran, dan kartu ini
          memang tidak punya besaran.
        -->
        <p
          v-else
          class="text-sm text-muted-foreground"
          :title="t('me.attendance.summary.notApplicableHint')"
          :data-testid="`metric-${tile.key}`"
        >
          {{ shown(tile) }}
        </p>
      </CardContent>
    </Card>
  </div>
</template>
