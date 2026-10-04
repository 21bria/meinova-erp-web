<script setup lang="ts">
import type { SelfAttendanceRow, SelfPageMeta } from '../types'

import { codeLabel } from '@framework'
/**
 * Riwayat kehadiran — tabel di layar lebar, kartu di ponsel.
 *
 * **Bukan versi kecil tabel HR Attendance.** Yang di HR punya kolom
 * keputusan (`approval_status`, `review_decision`, catatan peninjau) dan
 * jejak perangkat; itu alat kerja admin. Yang dijawab di sini satu
 * pertanyaan pegawai: "hari itu saya masuk jam berapa, dan tercatat
 * apa". Backend sudah memilihkan kolomnya; layar ini tidak bisa
 * memunculkan yang tidak dikirim.
 *
 * Di bawah `md` tabelnya **diganti**, bukan digulung ke samping. Tabel
 * sembilan kolom pada lebar 390px menghasilkan gulir horizontal yang
 * menyembunyikan justru kolom terpenting (Status, Masuk) di luar layar,
 * dan tidak ada yang menemukannya tanpa diberi tahu.
 *
 * Kata-kata status, sumber, dan keadaan izin dibaca `codeLabel()`, yang
 * mencoba katalog **ber-field** (`codes.<field>.<kode>`) lebih dulu lalu
 * jatuh ke `common.status.*`. Katalog tandingan di bawah `me.*` sengaja
 * tidak dibuat: "Mesin Kehadiran" di sini dan di layar Attendance harus
 * selalu berbunyi sama.
 *
 * `permission_state` justru **wajib** ber-field, dan itu bukan kerapian:
 * kodenya `partial`, yang di domain lain berarti "Partially Paid".
 *
 * Paginasi **server-side**: `meta` datang dari amplop balasan, dan
 * menekan halaman berikutnya mengirim permintaan baru. Memotong daftar
 * di sini akan menuntut seluruh periode ditarik lebih dulu — persis yang
 * membuat rentang 90 hari jadi satu balasan besar.
 */
import { CalendarSearch, ChevronLeft, ChevronRight } from 'lucide-vue-next'

import { useI18n } from 'vue-i18n'

import AttendanceStatusBadge from './AttendanceStatusBadge.vue'

const props = defineProps<{
  rows: SelfAttendanceRow[]
  meta: SelfPageMeta
  pageSizes: number[]
  busy?: boolean
}>()

const emit = defineEmits<{
  (event: 'page', value: number): void
  (event: 'pageSize', value: number): void
}>()

const { t, locale } = useI18n()

const formatter = computed(() =>
  new Intl.DateTimeFormat(locale.value === 'id' ? 'id-ID' : 'en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }),
)

function when(iso: string): string {
  return formatter.value.format(new Date(`${iso}T00:00:00`))
}

function minutes(value: number): string {
  return value > 0 ? t('me.attendance.history.minutes', { minutes: value }) : '—'
}

function clock(value: string | null): string {
  return value ?? t('me.attendance.history.noTime')
}

const from = computed(() =>
  props.meta.count === 0
    ? 0
    : (props.meta.page - 1) * props.meta.page_size + 1,
)

const to = computed(() =>
  Math.min(props.meta.page * props.meta.page_size, props.meta.count),
)
</script>

<template>
  <Card class="gap-0 py-5">
    <CardContent class="space-y-3">
      <h3 class="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        {{ t('me.attendance.history.title') }}
      </h3>

      <div
        v-if="!rows.length"
        class="flex flex-col items-start gap-2.5 py-4"
        data-testid="history-empty"
      >
        <span
          class="flex size-9 items-center justify-center rounded-lg border border-dashed text-muted-foreground/60"
        >
          <CalendarSearch class="size-4" aria-hidden="true" />
        </span>

        <div class="space-y-0.5">
          <p class="text-sm text-muted-foreground">
            {{ t('me.attendance.history.empty') }}
          </p>

          <p class="text-xs text-muted-foreground/80">
            {{ t('me.attendance.history.emptyHint') }}
          </p>
        </div>
      </div>

      <template v-else>
        <!-- Layar lebar: tabel. -->
        <div class="hidden md:block" data-testid="history-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{{ t('me.attendance.history.columns.date') }}</TableHead>
                <TableHead>{{ t('me.attendance.history.columns.shift') }}</TableHead>
                <TableHead>{{ t('me.attendance.history.columns.status') }}</TableHead>
                <TableHead class="hidden lg:table-cell">
                  {{ t('me.attendance.history.columns.source') }}
                </TableHead>
                <TableHead class="text-right">
                  {{ t('me.attendance.history.columns.checkIn') }}
                </TableHead>
                <TableHead class="text-right">
                  {{ t('me.attendance.history.columns.checkOut') }}
                </TableHead>
                <TableHead class="text-right">
                  {{ t('me.attendance.history.columns.worked') }}
                </TableHead>
                <TableHead class="text-right">
                  {{ t('me.attendance.history.columns.late') }}
                </TableHead>
                <TableHead class="text-right">
                  {{ t('me.attendance.history.columns.overtime') }}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow v-for="row in rows" :key="row.id">
                <TableCell class="font-medium whitespace-nowrap">
                  {{ when(row.work_date) }}
                </TableCell>

                <TableCell class="text-muted-foreground">
                  {{ row.shift ?? '—' }}
                </TableCell>

                <TableCell>
                  <div class="flex flex-wrap items-center gap-1.5">
                    <AttendanceStatusBadge
                      :status="row.status"
                      :label="row.status_label"
                    />

                    <!--
                      Satu-satunya hal yang membedakan "terlambat 59
                      menit" dari "terlambat 59 menit dan sudah ada
                      izinnya". Tanpanya barisnya terbaca sebagai
                      tuduhan.
                    -->
                    <Badge
                      v-if="row.permission_state"
                      variant="outline"
                      class="font-normal"
                    >
                      {{ codeLabel('permission_state', row.permission_state) }}
                    </Badge>
                  </div>
                </TableCell>

                <TableCell class="hidden text-muted-foreground lg:table-cell">
                  {{ codeLabel('source', row.source, row.source_label) }}
                </TableCell>

                <TableCell class="text-right tabular-nums whitespace-nowrap">
                  {{ clock(row.check_in) }}
                </TableCell>

                <TableCell class="text-right tabular-nums whitespace-nowrap">
                  {{ clock(row.check_out) }}
                </TableCell>

                <TableCell class="text-right tabular-nums">
                  {{ minutes(row.worked_minutes) }}
                </TableCell>

                <TableCell
                  class="text-right tabular-nums"
                  :class="row.late_minutes > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'"
                >
                  {{ minutes(row.late_minutes) }}
                </TableCell>

                <TableCell class="text-right tabular-nums">
                  {{ minutes(row.overtime_minutes) }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Ponsel: satu kartu per hari. -->
        <ul class="space-y-2 md:hidden" data-testid="history-cards">
          <li
            v-for="row in rows"
            :key="row.id"
            class="rounded-lg border p-3"
          >
            <div class="flex items-start justify-between gap-2">
              <p class="text-sm font-medium">
                {{ when(row.work_date) }}
              </p>

              <AttendanceStatusBadge
                :status="row.status"
                :label="row.status_label"
              />
            </div>

            <p class="mt-1 text-sm tabular-nums">
              {{ clock(row.check_in) }} – {{ clock(row.check_out) }}
            </p>

            <p class="mt-0.5 text-xs text-muted-foreground">
              <span>{{ t('me.attendance.history.columns.worked') }} {{ minutes(row.worked_minutes) }}</span>

              <span v-if="row.late_minutes > 0">
                · {{ t('me.attendance.history.columns.late') }} {{ minutes(row.late_minutes) }}
              </span>

              <span v-if="row.overtime_minutes > 0">
                · {{ t('me.attendance.history.columns.overtime') }} {{ minutes(row.overtime_minutes) }}
              </span>
            </p>

            <p v-if="row.permission_state" class="mt-1 text-xs text-muted-foreground">
              {{ codeLabel('permission_state', row.permission_state) }}
            </p>
          </li>
        </ul>

        <div class="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div class="flex items-center gap-2">
            <Select
              :model-value="String(meta.page_size)"
              :disabled="busy"
              @update:model-value="value => emit('pageSize', Number(value))"
            >
              <SelectTrigger size="sm" class="w-auto" data-testid="page-size">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem
                  v-for="size in pageSizes"
                  :key="size"
                  :value="String(size)"
                >
                  {{ t('me.attendance.pagination.perPage', { count: size }) }}
                </SelectItem>
              </SelectContent>
            </Select>

            <p class="text-xs text-muted-foreground">
              {{ t('me.attendance.pagination.summary', { from, to, count: meta.count }) }}
            </p>
          </div>

          <div class="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              :disabled="busy || meta.page <= 1"
              data-testid="page-prev"
              @click="emit('page', meta.page - 1)"
            >
              <ChevronLeft class="size-4" />
              <span class="hidden sm:inline">{{ t('me.attendance.pagination.previous') }}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              :disabled="busy || meta.page >= meta.total_pages"
              data-testid="page-next"
              @click="emit('page', meta.page + 1)"
            >
              <span class="hidden sm:inline">{{ t('me.attendance.pagination.next') }}</span>
              <ChevronRight class="size-4" />
            </Button>
          </div>
        </div>
      </template>
    </CardContent>
  </Card>
</template>
