<script setup lang="ts">
/**
 * Pemilih periode: preset, panah geser, dan rentang bebas.
 *
 * **Tidak memutuskan apa pun tentang data.** Yang dikerjakan di sini cuma
 * mengubah tekanan tombol jadi sepasang tanggal lalu meneruskannya ke
 * atas; yang menolak rentang terlalu lebar, yang menghitung hari kerja,
 * dan yang menentukan ada-tidaknya periode berikutnya semuanya backend.
 *
 * Panah **kiri dan kanan tidak simetris**, dan itu disengaja: mundur
 * selalu boleh, maju hanya sampai hari ini. Backend mengirim `next: null`
 * begitu periodenya menyentuh hari berjalan, dan tombolnya ikut mati —
 * bukan karena aturan yang ditulis ulang di sini, tapi karena tidak ada
 * tujuan yang diberikan kepadanya.
 */
import type { DateValue } from '@internationalized/date'
import type { DateRange } from 'reka-ui'
import type { PresetCode } from '../attendance/presets'

import type { SelfAttendanceRange, SelfDateRange } from '../types'
import { CalendarDate, toCalendarDate } from '@internationalized/date'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { PRESETS } from '../attendance/presets'

const props = defineProps<{
  range: SelfAttendanceRange
  preset: PresetCode
  busy?: boolean
}>()

const emit = defineEmits<{
  (event: 'pick', value: SelfDateRange): void
  (event: 'preset', value: PresetCode): void
}>()

const { t, locale } = useI18n()

/*
 * Rentang bebas, disimpan terpisah supaya popover bisa dibatalkan tanpa
 * mengubah apa yang sedang dilihat.
 *
 * `RangeCalendar` dipakai **langsung**, bukan lewat
 * `components/table/DateRangePicker.vue`. Yang itu membungkus dirinya
 * sendiri dalam sebuah Popover, jadi memakainya di sini menghasilkan
 * popover di dalam popover: menekan "Kustom" cuma memunculkan sebuah
 * tombol lain yang harus ditekan lagi sebelum kalendernya terlihat.
 * Dua ketukan untuk satu maksud, dan yang pertama tidak menunjukkan
 * apa-apa.
 */
function fromISO(value: string | null): CalendarDate | undefined {
  if (!value)
    return undefined

  const [year, month, day] = value.split('-').map(Number)

  return year && month && day ? new CalendarDate(year, month, day) : undefined
}

/**
 * `DateValue` → `YYYY-MM-DD`, dirakit dari komponennya langsung.
 *
 * **Tanpa singgah ke `Date`.** `value.toDate('UTC')` lalu membaca
 * `getFullYear()/getMonth()/getDate()` memulangkan tanggal yang benar
 * di Jakarta dan meleset sehari di Lima: tengah malam UTC tanggal 5
 * adalah pukul 19:00 tanggal **4** di sana. Kesalahan itu tidak melempar
 * apa pun — rentangnya cuma bergeser sehari, dan hanya bagi sebagian
 * pembaca.
 */
function calendarToISO(value: DateValue): string {
  const plain = toCalendarDate(value)

  return [
    String(plain.year).padStart(4, '0'),
    String(plain.month).padStart(2, '0'),
    String(plain.day).padStart(2, '0'),
  ].join('-')
}

const draft = ref<DateRange>({
  start: fromISO(props.range.date_from),
  end: fromISO(props.range.date_to),
})

const open = ref(false)

watch(
  () => [props.range.date_from, props.range.date_to],
  ([from, to]) => {
    draft.value = { start: fromISO(from ?? null), end: fromISO(to ?? null) }
  },
)

const formatter = computed(() =>
  new Intl.DateTimeFormat(locale.value === 'id' ? 'id-ID' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
)

function readable(iso: string): string {
  return formatter.value.format(new Date(`${iso}T00:00:00`))
}

/*
 * "1 – 31 Agustus 2026", bukan "1 Agustus 2026 – 31 Agustus 2026".
 *
 * Bulan dan tahun yang sama tidak perlu disebut dua kali; judul periode
 * dibaca puluhan kali sehari dan setengahnya pengulangan.
 */
const label = computed(() => {
  const from = new Date(`${props.range.date_from}T00:00:00`)
  const to = new Date(`${props.range.date_to}T00:00:00`)

  const sameMonth
    = from.getFullYear() === to.getFullYear()
      && from.getMonth() === to.getMonth()

  if (sameMonth)
    return `${from.getDate()} – ${readable(props.range.date_to)}`

  return `${readable(props.range.date_from)} – ${readable(props.range.date_to)}`
})

function choose(code: PresetCode) {
  if (code === 'custom') {
    open.value = true

    return
  }

  emit('preset', code)
}

function apply() {
  const { start, end } = draft.value

  if (!start || !end)
    return

  open.value = false

  emit('pick', {
    date_from: calendarToISO(start),
    date_to: calendarToISO(end),
  })
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="min-w-0">
        <p class="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          {{ t('me.attendance.range.label') }}
        </p>

        <p
          class="truncate text-base font-semibold tracking-tight"
          data-testid="period-label"
        >
          {{ label }}
        </p>
      </div>

      <!--
        Panah selalu berpasangan supaya lebarnya tidak berubah saat yang
        kanan mati — deretan tombol yang melompat tiap kali periodenya
        menyentuh hari ini lebih mengganggu daripada satu tombol kelabu.
      -->
      <div class="flex shrink-0 items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          :disabled="busy"
          :aria-label="t('me.attendance.range.previous')"
          @click="emit('pick', range.previous)"
        >
          <ChevronLeft class="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          :disabled="busy || !range.next"
          :aria-label="t('me.attendance.range.next')"
          @click="range.next && emit('pick', range.next)"
        >
          <ChevronRight class="size-4" />
        </Button>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-1.5">
      <template v-for="code in PRESETS" :key="code">
        <Popover v-if="code === 'custom'" v-model:open="open">
          <PopoverTrigger as-child>
            <Button
              :variant="preset === code ? 'default' : 'outline'"
              size="sm"
              :disabled="busy"
              data-testid="preset-custom"
            >
              {{ t(`me.attendance.presets.${code}`) }}
            </Button>
          </PopoverTrigger>

          <PopoverContent class="w-auto space-y-3 p-3" align="start">
            <RangeCalendar
              v-model="draft"
              weekday-format="short"
              :number-of-months="1"
              initial-focus
            />

            <div class="flex items-center justify-between gap-3">
              <p class="text-xs text-muted-foreground">
                {{ t('me.attendance.range.max', { days: range.max_days }) }}
              </p>

              <Button size="sm" data-testid="range-apply" @click="apply">
                {{ t('me.attendance.range.apply') }}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          v-else
          :variant="preset === code ? 'default' : 'outline'"
          size="sm"
          :disabled="busy"
          :data-testid="`preset-${code}`"
          @click="choose(code)"
        >
          {{ t(`me.attendance.presets.${code}`) }}
        </Button>
      </template>
    </div>
  </div>
</template>
