<script setup lang="ts">
import type { CellTone } from '../palette'

import type { ShiftCalendarDay } from '../types'
import { computed } from 'vue'

/*
 * Grid bulanan — **desktop saja**.
 *
 * Pasangannya `ShiftCalendarAgenda` untuk layar sempit, dan keduanya
 * dipisah lewat CSS (`hidden md:block` / `md:hidden`) di pemanggilnya,
 * bukan lewat `useMediaQuery`: itu polanya `MDashboard` dan
 * `DashboardKpi`, dan alasannya render pertama tidak boleh salah bentuk
 * sebelum ukuran layar diketahui.
 *
 * Tujuh kolom tetap dengan `minmax(0, 1fr)` — bukan lebar minimum dalam
 * piksel. Lebar minimum membuat seluruh halaman tergulir mendatar
 * begitu sidebar terbuka di layar 1024px, dan gulir mendatar pada
 * halaman adalah persis yang dilarang.
 */

const props = defineProps<{
  days: ShiftCalendarDay[]
  toneFor: (day: ShiftCalendarDay) => CellTone
}>()

const emit = defineEmits<{
  (e: 'select', day: ShiftCalendarDay): void
}>()

const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

/*
 * Sel kosong sebelum tanggal 1.
 *
 * `weekday` datang dari backend dalam ISO (Senin=1), jadi tidak ada
 * `getDay()` di sini sama sekali — `Date.getDay()` memakai Minggu=0 dan
 * menggeser seluruh kalender satu kolom kalau keduanya tercampur.
 */
const leadingBlanks = computed(() => {
  const first = props.days[0]

  if (!first)
    return []

  return Array.from({ length: first.weekday - 1 }, (_, index) => index)
})

function dayOfMonth(date: string): string {
  return String(Number(date.slice(8, 10)))
}
</script>

<template>
  <div>
    <div
      class="
        text-muted-foreground mb-2 grid
        grid-cols-[repeat(7,minmax(0,1fr))] gap-1.5 text-center
        text-xs font-medium
      "
    >
      <div
        v-for="label in WEEKDAYS"
        :key="label"
      >
        {{ label }}
      </div>
    </div>

    <div class="grid grid-cols-[repeat(7,minmax(0,1fr))] gap-1.5">
      <div
        v-for="blank in leadingBlanks"
        :key="`blank-${blank}`"
        aria-hidden="true"
      />

      <button
        v-for="day in days"
        :key="day.date"
        type="button"
        class="
          focus-visible:ring-ring
          flex min-h-24 flex-col gap-1 rounded-md border p-2 text-left
          transition-colors
          hover:brightness-105
          focus-visible:ring-2 focus-visible:outline-none
          dark:hover:brightness-125
        "
        :class="toneFor(day).cell"
        @click="emit('select', day)"
      >
        <div class="flex items-start justify-between gap-1">
          <span class="text-sm font-semibold tabular-nums">
            {{ dayOfMonth(day.date) }}
          </span>

          <!--
            Penanda adjustment. Sengaja titik berkontras tinggi dan
            bukan warna sel yang berbeda: warna sel sudah dipakai
            membedakan shift, dan menumpuk dua arti ke satu isyarat
            membuat keduanya tidak terbaca.
          -->
          <span
            v-if="day.is_override"
            class="
              bg-primary mt-1 inline-block size-1.5 shrink-0
              rounded-full
            "
            title="Adjustment"
          />
        </div>

        <template v-if="day.rotation_state === 'work'">
          <span
            v-if="day.shift_code"
            class="
              inline-flex w-fit max-w-full items-center rounded px-1.5
              py-0.5 text-[11px] font-semibold
            "
            :class="toneFor(day).badge"
          >
            <span class="truncate">{{ day.shift_code }}</span>
          </span>

          <span
            v-else
            class="
              inline-flex w-fit items-center rounded px-1.5 py-0.5
              text-[11px] font-semibold
            "
            :class="toneFor(day).badge"
          >
            Belum ada shift
          </span>

          <!--
            `scheduled_label` sudah membawa tanda `(+1)` dari backend.
            Menyusunnya sendiri dari dua kolom jam akan jadi aturan
            kedua tentang lewat tengah malam.
          -->
          <span
            v-if="day.scheduled_label"
            class="
              text-muted-foreground text-[11px] leading-tight
              tabular-nums
            "
          >
            {{ day.scheduled_label }}
          </span>
        </template>

        <span
          v-else
          class="
            inline-flex w-fit max-w-full items-center rounded px-1.5
            py-0.5 text-[11px] font-medium
          "
          :class="toneFor(day).badge"
        >
          <span class="truncate">{{ day.rotation_state_label }}</span>
        </span>
      </button>
    </div>
  </div>
</template>
