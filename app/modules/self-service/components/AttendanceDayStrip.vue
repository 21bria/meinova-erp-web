<script setup lang="ts">
import type { SelfAttendanceDay, SelfDayOutcome } from '../types'

/**
 * Ringkasan periode: satu petak per hari, diwarnai hasil harinya.
 *
 * **Bukan grafik batang, dan itu keputusan.** Dalam pandangan pribadi
 * tiap hari bernilai persis satu — batang setinggi 1 berjajar tiga puluh
 * kali tidak menyampaikan apa pun yang tidak sudah tertulis di kartunya.
 * Yang justru tidak terbaca dari angka adalah **polanya**: tiga
 * keterlambatan berturut-turut, atau dua hari mangkir yang mengapit
 * akhir pekan. Petak per hari menunjukkan itu dalam sekali lihat.
 *
 * Klasifikasinya datang **jadi** dari backend (`outcome`), dari daftar
 * tanggal yang sama yang dipakai kartu di atasnya. Merakitnya di sini
 * dari baris presensi — betapapun mudahnya kelihatan — adalah salinan
 * kedua aturan hadir/telat/mangkir, dan salinan kedua akan berbeda.
 */
import { useI18n } from 'vue-i18n'

const props = defineProps<{ days: SelfAttendanceDay[] }>()

const { t, locale } = useI18n()

/*
 * Warna per hasil. Sengaja sejalan dengan `ATTENDANCE_TINTS`:
 * hijau hadir, amber terlambat, merah mangkir. Yang tidak dijadwalkan
 * dibiarkan netral — ia bukan kabar baik maupun buruk, dan mewarnainya
 * membuat akhir pekan ikut menarik perhatian.
 */
const TONES: Record<SelfDayOutcome, string> = {
  present: 'bg-emerald-500 dark:bg-emerald-600',
  late: 'bg-amber-400 dark:bg-amber-500',
  absent: 'bg-destructive',
  leave: 'bg-sky-400 dark:bg-sky-500',
  // Dinas tanpa tap: hari kerja yang diizinkan, bukan hadir fisik (BT-3R).
  business_trip: 'bg-teal-500 dark:bg-teal-600',
  extra: 'bg-violet-400 dark:bg-violet-500',
  off: 'bg-muted',
}

/** Hanya hasil yang **benar-benar muncul** yang masuk legenda. */
const legend = computed(() => {
  const seen = new Set(props.days.map(day => day.outcome))

  return (Object.keys(TONES) as SelfDayOutcome[]).filter(code => seen.has(code))
})

const formatter = computed(() =>
  new Intl.DateTimeFormat(locale.value === 'id' ? 'id-ID' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }),
)

function title(day: SelfAttendanceDay): string {
  const when = formatter.value.format(new Date(`${day.date}T00:00:00`))

  return `${when} — ${t(`me.attendance.outcome.${day.outcome}`)}`
}

function dayNumber(day: SelfAttendanceDay): string {
  return String(new Date(`${day.date}T00:00:00`).getDate())
}
</script>

<template>
  <Card class="gap-0 py-5">
    <CardContent class="space-y-3">
      <h3 class="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        {{ t('me.attendance.chart.title') }}
      </h3>

      <p v-if="!days.length" class="py-2 text-sm text-muted-foreground">
        {{ t('me.attendance.chart.empty') }}
      </p>

      <template v-else>
        <!--
          `flex-wrap`, bukan grid berkolom tetap: rentangnya bisa 7 hari
          atau 90, dan kolom tetap membuat yang pendek meregang jadi
          petak selebar telapak tangan. Lebar petak dikunci (`w-7`) dan
          barisnya mengalir — 7 hari jadi satu baris pendek, 90 hari jadi
          beberapa baris rapi.
        -->
        <div class="flex flex-wrap gap-1" data-testid="day-strip">
          <div
            v-for="day in days"
            :key="day.date"
            class="flex h-8 w-7 flex-col items-center justify-center rounded-sm text-[10px] font-medium"
            :class="[
              TONES[day.outcome],
              day.outcome === 'off'
                ? 'text-muted-foreground'
                : 'text-white',
            ]"
            :title="title(day)"
            :data-outcome="day.outcome"
          >
            {{ dayNumber(day) }}
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1">
          <span
            v-for="code in legend"
            :key="code"
            class="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span class="size-2.5 rounded-[3px]" :class="TONES[code]" />
            {{ t(`me.attendance.outcome.${code}`) }}
          </span>
        </div>
      </template>
    </CardContent>
  </Card>
</template>
