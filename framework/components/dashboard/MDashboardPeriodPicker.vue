<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { CalendarDate, parseDate } from "@internationalized/date"

import {
  PERIOD_PRESETS,
  fromISODate,
  monthAbbr,
  periodForMode,
  periodModeLabel,
  presetLabel,
  todayISO,
  toISODate,
} from "@framework/core/utils/dashboard"
import { activeIntlLocale, translate } from "@framework/core/utils/i18n"

import type { DateValue } from "@internationalized/date"
import type {
  DashboardPeriodMode,
  DashboardPeriodState,
} from "@framework/core/types/dashboard"

const props = withDefaults(
  defineProps<{
    period: DashboardPeriodState
    modes?: DashboardPeriodMode[]
    label?: string
    title?: string
  }>(),
  {
    modes: () => ["day", "week", "month", "custom"],
    // Judul popover. Dibiarkan kosong supaya bawaannya ikut bahasa
    // aktif; nilai tetap di `withDefaults` dievaluasi sekali saat modul
    // dimuat — sebelum plugin i18n terpasang, dan tidak pernah lagi
    // sesudahnya.
    title: "",
  },
)

const popoverTitle = computed(
  () => props.title || translate("common.labels.period_filter", "Period"),
)

// Kalender reka-ui: nama hari dan bulan ikut bahasa aktif. Awal minggu
// tetap Senin — itu aturan rentang backend, bukan preferensi tampilan.
const calendarLocale = computed(() => activeIntlLocale())

const emit = defineEmits<{
  (e: "update:period", value: DashboardPeriodState): void
  (e: "update:mode", value: DashboardPeriodMode): void
  (e: "move", direction: number): void
}>()

const open = ref(false)

/*
 * Kalender reka-ui bekerja dengan `CalendarDate`, sedangkan periode di
 * seluruh aplikasi berupa ISO `YYYY-MM-DD`. Konversinya ditahan di
 * komponen ini saja supaya tipe kalender tidak bocor ke composable.
 */
function toCalendarDate(value: string): CalendarDate {
  try {
    return parseDate(value)
  }
  catch {
    const today = new Date()

    return new CalendarDate(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate(),
    )
  }
}

function fromCalendarDate(value: DateValue): string {
  return `${value.year}-${String(value.month).padStart(2, "0")}-${String(value.day).padStart(2, "0")}`
}

const startDate = computed(() => toCalendarDate(props.period.start))
const endDate = computed(() => toCalendarDate(props.period.end))

const rangeValue = computed(() => ({
  start: startDate.value,
  end: endDate.value,
}))

// Tahun yang sedang ditampilkan grid bulan/tahun. Disinkronkan tiap kali
// popover dibuka supaya tidak tertinggal di tahun kunjungan sebelumnya.
const viewYear = ref(fromISODate(props.period.start).getFullYear())

watch(open, (isOpen) => {
  if (isOpen) {
    viewYear.value = fromISODate(props.period.start).getFullYear()
  }
})

const availableModes = computed(() =>
  props.modes.map(mode => ({
    value: mode,
    label: periodModeLabel(mode),
  })),
)

const activeMode = computed(() => props.period.mode)

const isToday = computed(() => {
  const today = todayISO()

  return props.period.start <= today && today <= props.period.end
})

const yearOptions = computed(() => {
  const base = viewYear.value - 5

  return Array.from({ length: 12 }, (_, index) => base + index)
})

const monthOptions = computed(() =>
  Array.from({ length: 12 }, (_, index) => ({
    value: index + 1,
    label: monthAbbr(index + 1),
  })),
)

const selectedMonth = computed(() => {
  const start = fromISODate(props.period.start)

  return {
    year: start.getFullYear(),
    month: start.getMonth() + 1,
    quarter: Math.floor(start.getMonth() / 3) + 1,
  }
})

// Rentang bulannya dirakit dari nama bulan yang sudah mengikuti bahasa,
// bukan dari empat string tetap.
const quarterOptions = computed(() =>
  [1, 2, 3, 4].map(value => ({
    value,
    label: `Q${value}`,
    range: `${monthAbbr(value * 3 - 2)} – ${monthAbbr(value * 3)}`,
  })),
)

function apply(period: DashboardPeriodState, close = true) {
  emit("update:period", period)

  if (close) open.value = false
}

function onDayPicked(value: DateValue | undefined) {
  if (!value) return

  // Mode "minggu" tetap memakai kalender harian: user menunjuk tanggal
  // mana pun, sistem yang membulatkannya ke Senin–Minggu. Meminta user
  // menemukan awal minggu sendiri hanya menambah salah pilih.
  apply(periodForMode(activeMode.value, fromCalendarDate(value)))
}

function onRangePicked(value: { start?: DateValue, end?: DateValue }) {
  if (!value?.start || !value?.end) return

  apply({
    mode: "custom",
    start: fromCalendarDate(value.start),
    end: fromCalendarDate(value.end),
  })
}

function onMonthPicked(month: number) {
  apply(
    periodForMode(
      "month",
      toISODate(new Date(viewYear.value, month - 1, 1)),
    ),
  )
}

function onQuarterPicked(quarter: number) {
  apply(
    periodForMode(
      "quarter",
      toISODate(new Date(viewYear.value, (quarter - 1) * 3, 1)),
    ),
  )
}

function onYearPicked(year: number) {
  apply(periodForMode("year", toISODate(new Date(year, 0, 1))))
}

function onPreset(key: string) {
  const preset = PERIOD_PRESETS.find(item => item.key === key)

  if (!preset) return

  const next = preset.build()

  // Preset boleh memindahkan mode (mis. "7 hari terakhir" → kustom),
  // tapi hanya ke mode yang memang ditawarkan dashboard ini.
  if (!props.modes.includes(next.mode)) {
    apply({ ...next, mode: "custom" })

    return
  }

  apply(next)
}

const visiblePresets = computed(() =>
  PERIOD_PRESETS.filter((preset) => {
    const mode = preset.build().mode

    return props.modes.includes(mode) || props.modes.includes("custom")
  }),
)

function onModeChange(mode: DashboardPeriodMode) {
  emit("update:mode", mode)
}

function goToday() {
  apply(periodForMode(activeMode.value, todayISO()))
}
</script>

<template>
  <div class="flex items-center gap-1 rounded-xl border bg-card p-1 shadow-sm">
    <Button
      variant="ghost"
      size="icon"
      class="size-8 shrink-0 text-muted-foreground"
      :aria-label="translate('common.period.previous', 'Previous period')"
      @click="emit('move', -1)"
    >
      <Icon name="i-lucide-chevron-left" class="size-4" />
    </Button>

    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          variant="ghost"
          class="h-8 min-w-0 flex-1 justify-start gap-2 px-2 font-medium"
        >
          <Icon
            name="i-lucide-calendar-days"
            class="size-4 shrink-0 text-muted-foreground"
          />

          <span class="truncate">
            {{ label }}
          </span>

          <Badge
            variant="secondary"
            class="ml-auto hidden shrink-0 px-1.5 text-[10px] font-medium sm:inline-flex"
          >
            {{ periodModeLabel(activeMode) }}
          </Badge>

          <Icon
            name="i-lucide-chevron-down"
            class="size-3.5 shrink-0 text-muted-foreground"
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent class="w-auto max-w-[95vw] p-0" align="end">
        <div class="flex flex-col">
          <div class="flex items-center justify-between gap-3 border-b p-3">
            <p class="text-sm font-medium">
              {{ popoverTitle }}
            </p>

            <Button
              v-if="!isToday"
              variant="ghost"
              size="sm"
              class="h-7 text-xs"
              @click="goToday"
            >
              {{ translate("common.period.goToday", "Go to today") }}
            </Button>
          </div>

          <!-- Satuan periode. Ditaruh paling atas karena pilihan di sini
               yang menentukan bentuk kalender di bawahnya. -->
          <div class="flex gap-1 overflow-x-auto border-b p-2">
            <Button
              v-for="mode in availableModes"
              :key="mode.value"
              :variant="activeMode === mode.value ? 'default' : 'ghost'"
              size="sm"
              class="h-7 shrink-0 px-2.5 text-xs"
              @click="onModeChange(mode.value)"
            >
              {{ mode.label }}
            </Button>
          </div>

          <div class="p-1">
            <!-- `locale` dan `week-starts-on` wajib diset: bawaan reka-ui
                 adalah Inggris dengan minggu mulai Sabtu/Minggu, sedangkan
                 rentang "mingguan" di sistem ini selalu Senin–Minggu.
                 Kalau tidak disamakan, kotak yang tersorot di kalender
                 bukan minggu yang benar-benar dihitung backend. -->
            <RangeCalendar
              v-if="activeMode === 'custom'"
              :model-value="rangeValue as never"
              :locale="calendarLocale"
              weekday-format="short"
              :week-starts-on="1"
              :number-of-months="1"
              class="w-full sm:hidden"
              @update:model-value="onRangePicked as never"
            />

            <RangeCalendar
              v-if="activeMode === 'custom'"
              :model-value="rangeValue as never"
              :locale="calendarLocale"
              weekday-format="short"
              :week-starts-on="1"
              :number-of-months="2"
              class="hidden w-full sm:block"
              @update:model-value="onRangePicked as never"
            />

            <Calendar
              v-else-if="activeMode === 'day' || activeMode === 'week'"
              :model-value="startDate as never"
              :locale="calendarLocale"
              weekday-format="short"
              :week-starts-on="1"
              class="w-full"
              @update:model-value="onDayPicked as never"
            />

            <div
              v-else-if="activeMode === 'month' || activeMode === 'quarter'"
              class="p-2"
            >
              <div class="mb-3 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-7"
                  :aria-label="translate('common.period.previousYear', 'Previous year')"
                  @click="viewYear -= 1"
                >
                  <Icon name="i-lucide-chevron-left" class="size-4" />
                </Button>

                <span class="text-sm font-medium">{{ viewYear }}</span>

                <Button
                  variant="ghost"
                  size="icon"
                  class="size-7"
                  :aria-label="translate('common.period.nextYear', 'Next year')"
                  @click="viewYear += 1"
                >
                  <Icon name="i-lucide-chevron-right" class="size-4" />
                </Button>
              </div>

              <div
                v-if="activeMode === 'month'"
                class="grid grid-cols-3 gap-2 sm:grid-cols-4"
              >
                <Button
                  v-for="month in monthOptions"
                  :key="month.value"
                  :variant="
                    selectedMonth.year === viewYear
                      && selectedMonth.month === month.value
                      ? 'default'
                      : 'outline'
                  "
                  size="sm"
                  class="h-9"
                  @click="onMonthPicked(month.value)"
                >
                  {{ month.label }}
                </Button>
              </div>

              <div v-else class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Button
                  v-for="quarter in quarterOptions"
                  :key="quarter.value"
                  :variant="
                    selectedMonth.year === viewYear
                      && selectedMonth.quarter === quarter.value
                      ? 'default'
                      : 'outline'
                  "
                  size="sm"
                  class="h-auto flex-col gap-0.5 py-2"
                  @click="onQuarterPicked(quarter.value)"
                >
                  <span class="font-medium">{{ quarter.label }}</span>
                  <span class="text-[10px] opacity-70">{{ quarter.range }}</span>
                </Button>
              </div>
            </div>

            <div v-else class="grid grid-cols-3 gap-2 p-3 sm:grid-cols-4">
              <Button
                v-for="year in yearOptions"
                :key="year"
                :variant="
                  selectedMonth.year === year ? 'default' : 'outline'
                "
                size="sm"
                class="h-9"
                @click="onYearPicked(year)"
              >
                {{ year }}
              </Button>
            </div>
          </div>

          <div class="flex flex-wrap gap-1.5 border-t p-2">
            <Button
              v-for="preset in visiblePresets"
              :key="preset.key"
              variant="secondary"
              size="sm"
              class="h-7 rounded-full px-3 text-xs font-normal"
              @click="onPreset(preset.key)"
            >
              {{ presetLabel(preset) }}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>

    <Button
      variant="ghost"
      size="icon"
      class="size-8 shrink-0 text-muted-foreground"
      :aria-label="translate('common.period.next', 'Next period')"
      @click="emit('move', 1)"
    >
      <Icon name="i-lucide-chevron-right" class="size-4" />
    </Button>
  </div>
</template>
