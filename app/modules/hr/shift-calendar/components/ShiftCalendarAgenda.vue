<script setup lang="ts">
import type { CellTone } from '../palette'
import type { ShiftCalendarDay } from '../types'

/*
 * Bentuk daftar untuk layar sempit.
 *
 * Bukan grid yang dipadatkan: tujuh kolom di layar 375px menyisakan
 * ±44px per sel, dan kode shift plus jamnya tidak muat di situ dengan
 * cara apa pun — yang terjadi kalender yang terlihat lengkap tapi
 * tidak bisa dibaca. Daftar bertanggal menjawab pertanyaan yang sama
 * ("tanggal ini shift apa") tanpa satu piksel pun gulir mendatar.
 */

defineProps<{
  days: ShiftCalendarDay[]
  toneFor: (day: ShiftCalendarDay) => CellTone
}>()

const emit = defineEmits<{
  (e: 'select', day: ShiftCalendarDay): void
}>()

const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

function weekdayLabel(day: ShiftCalendarDay): string {
  return WEEKDAYS[day.weekday - 1] ?? ''
}

function dayOfMonth(date: string): string {
  return String(Number(date.slice(8, 10)))
}
</script>

<template>
  <ul class="divide-border divide-y rounded-md border">
    <li
      v-for="day in days"
      :key="day.date"
    >
      <button
        type="button"
        class="
          focus-visible:ring-ring
          flex w-full items-center gap-3 px-3 py-2.5 text-left
          hover:bg-muted/50
          focus-visible:ring-2 focus-visible:outline-none
        "
        @click="emit('select', day)"
      >
        <span class="w-9 shrink-0 text-center">
          <span class="block text-sm font-semibold tabular-nums">
            {{ dayOfMonth(day.date) }}
          </span>
          <span class="text-muted-foreground block text-[10px]">
            {{ weekdayLabel(day) }}
          </span>
        </span>

        <span
          class="size-2 shrink-0 rounded-full"
          :class="toneFor(day).dot"
          aria-hidden="true"
        />

        <span class="min-w-0 flex-1">
          <span class="flex flex-wrap items-center gap-1.5">
            <template v-if="day.rotation_state === 'work'">
              <span
                class="
                  inline-flex items-center rounded px-1.5 py-0.5
                  text-[11px] font-semibold
                "
                :class="toneFor(day).badge"
              >
                {{ day.shift_code || 'Belum ada shift' }}
              </span>

              <span
                v-if="day.scheduled_label"
                class="text-muted-foreground text-xs tabular-nums"
              >
                {{ day.scheduled_label }}
              </span>
            </template>

            <span
              v-else
              class="
                inline-flex items-center rounded px-1.5 py-0.5
                text-[11px] font-medium
              "
              :class="toneFor(day).badge"
            >
              {{ day.rotation_state_label }}
            </span>

            <span
              v-if="day.is_override"
              class="
                bg-primary/15 text-primary inline-flex items-center
                rounded px-1.5 py-0.5 text-[10px] font-semibold
              "
            >
              Adjustment
            </span>
          </span>

          <span
            v-if="day.rotation_state === 'work' && day.shift_name"
            class="text-muted-foreground mt-0.5 block truncate text-xs"
          >
            {{ day.shift_name }}
          </span>
        </span>
      </button>
    </li>
  </ul>
</template>
