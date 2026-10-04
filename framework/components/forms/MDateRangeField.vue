<script setup lang="ts">
/*
|--------------------------------------------------------------------------
| MDateRangeField — periode untuk daftar transaksional
|--------------------------------------------------------------------------
|
| Dua hal yang membedakannya dari sepasang `MDateField`:
|
| 1. **Ia tidak pernah memancarkan rentang setengah jadi.** Memilih
|    rentang di kalender selalu melewati keadaan "mulai sudah, selesai
|    belum", dan setiap keadaan antara itu adalah satu permintaan ke
|    API kalau dipancarkan apa adanya — plus satu permintaan yang
|    periodenya bukan yang dimaksud siapa pun. Pilihannya ditahan
|    sebagai draft dan baru naik begitu kedua ujungnya ada.
|
| 2. **Ia tidak pernah memancarkan rentang kosong.** Daftar tanpa
|    periode berarti seluruh sejarah, dan itu justru yang dihindari
|    layar ini. Yang mengosongkannya dikembalikan ke bawaan.
|
| Kalendernya `RangeCalendar` milik design system, bukan kalender baru —
| komponen yang sama yang sudah dipakai `app/components/table/
| DateRangePicker.vue`.
*/
import { computed, ref, watch } from "vue"
import type { DateRange } from "reka-ui"
import type { DateValue } from "@internationalized/date"
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  toCalendarDate,
} from "@internationalized/date"
import { Calendar as CalendarIcon } from "lucide-vue-next"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RangeCalendar } from "@/components/ui/range-calendar"
import { cn } from "@/lib/utils"

import MFieldLabel from "./MFieldLabel.vue"
import MFieldError from "./MFieldError.vue"
import {
  DATE_RANGE_PRESETS,
  DEFAULT_DATE_RANGE,
  matchPreset,
  rangeDays,
  resolvePreset,
} from "../../core/utils/dateRange"
import type { DateRangeValue } from "../../core/utils/dateRange"
import { translate } from "../../core/utils/i18n"

const props = withDefaults(defineProps<{
  modelValue?: DateRangeValue
  label?: string
  placeholder?: string
  error?: string | null
  disabled?: boolean

  /* Kode preset bawaan, dipakai saat rentangnya dikosongkan. */
  defaultRange?: string | null

  /* Batas panjang rentang menurut kebijakan backend. */
  maxDays?: number | null

  presets?: string[] | null

  /* `panel` memberi judul di atas kontrolnya, `inline` tidak. */
  variant?: "inline" | "panel"
}>(), {
  modelValue: () => ({ from: null, to: null }),
  variant: "inline",
  presets: () => [...DATE_RANGE_PRESETS],
})

const emit = defineEmits<{
  (e: "update:modelValue", value: DateRangeValue): void
}>()

const open = ref(false)

/*
| Pilihan yang sedang berjalan di kalender. Terpisah dari `modelValue`
| justru supaya keadaan antara ("mulai sudah, selesai belum") punya
| tempat tinggal yang tidak ikut terkirim.
*/
const draft = ref<DateRangeValue>({ ...props.modelValue })

/*
| Draft disinkronkan hanya kalau nilainya **benar-benar** berbeda.
|
| `MCrudFilters` mengoper `:model-value="rangeValue(item)"` — objek baru
| tiap render — jadi watcher yang menyamakan identitas akan menembak
| pada render mana pun. Dan yang dibuangnya justru pilihan yang sedang
| berjalan: orang mengklik tanggal mulai, komponen induk kebetulan
| dirender ulang, dan kalendernya kembali ke rentang lama tanpa sebab
| yang terlihat.
*/
watch(
  () => props.modelValue,
  (value) => {
    const next = value ?? { from: null, to: null }

    if (next.from === draft.value.from && next.to === draft.value.to)
      return

    draft.value = { from: next.from ?? null, to: next.to ?? null }
  },
  { deep: true },
)

const tz = getLocalTimeZone()
const formatter = new DateFormatter("en-US", { dateStyle: "medium" })

function fromISO(value: string | null): CalendarDate | undefined {
  if (!value)
    return undefined

  const [year, month, day] = String(value).split("-").map(Number)

  if (!year || !month || !day)
    return undefined

  return new CalendarDate(year, month, day)
}

function toISO(value: DateValue | null | undefined): string | null {
  if (!value)
    return null

  const parsed = toCalendarDate(value)

  return [
    String(parsed.year).padStart(4, "0"),
    String(parsed.month).padStart(2, "0"),
    String(parsed.day).padStart(2, "0"),
  ].join("-")
}

const calendarValue = computed<DateRange>({
  get() {
    return {
      start: fromISO(draft.value.from),
      end: fromISO(draft.value.to),
    }
  },
  set(value) {
    commit({
      from: toISO(value?.start),
      to: toISO(value?.end),
    })
  },
})

const tooLong = computed(() => {
  const limit = props.maxDays ?? 0

  if (!limit || !draft.value.from || !draft.value.to)
    return false

  return rangeDays(draft.value) > limit
})

const pretty = computed(() => {
  const start = fromISO(props.modelValue?.from ?? null)
  const end = fromISO(props.modelValue?.to ?? null)

  if (!start)
    return ""

  const left = formatter.format(start.toDate(tz))

  if (!end)
    return left

  return `${left} — ${formatter.format(end.toDate(tz))}`
})

const activePreset = computed(() =>
  matchPreset(
    {
      from: props.modelValue?.from ?? null,
      to: props.modelValue?.to ?? null,
    },
    props.presets ?? DATE_RANGE_PRESETS,
  ),
)

const presetItems = computed(() =>
  (props.presets ?? DATE_RANGE_PRESETS).filter(code => code !== "custom"),
)

function presetLabel(code: string): string {
  return translate(
    `common.period.${code}`,
    {
      today: "Today",
      last_7_days: "Last 7 Days",
      this_month: "This Month",
      last_month: "Last Month",
    }[code] ?? code,
  )
}

/*
| Satu-satunya jalan keluar dari komponen ini.
|
| Rentang setengah jadi disimpan, tidak dikirim. Rentang kosong
| dikembalikan ke bawaan, tidak dikirim sebagai kosong. Rentang terbalik
| ditukar di sini juga — mengklik tanggal akhir lebih dulu adalah cara
| memakai kalender yang wajar, bukan kesalahan yang pantas dibalas 400.
*/
function commit(value: DateRangeValue) {
  let { from, to } = value

  if (from && to && from > to)
    [from, to] = [to, from]

  draft.value = { from, to }

  if (!from || !to)
    return

  const current = props.modelValue ?? { from: null, to: null }

  if (current.from === from && current.to === to)
    return

  emit("update:modelValue", { from, to })
}

function applyPreset(code: string) {
  commit(resolvePreset(code))

  open.value = false
}

function resetToDefault() {
  commit(resolvePreset(props.defaultRange ?? DEFAULT_DATE_RANGE))

  open.value = false
}
</script>

<template>
  <div :class="variant === 'panel' ? 'grid gap-2' : ''">
    <MFieldLabel v-if="variant === 'panel'" :label="label" />

    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          type="button"
          variant="outline"
          class="h-9 justify-start text-left font-normal"
          :class="cn(!pretty && 'text-muted-foreground')"
          :disabled="disabled"
        >
          <CalendarIcon class="mr-2 size-4" />
          <span v-if="pretty">{{ pretty }}</span>
          <span v-else>{{ placeholder ?? label ?? translate('common.labels.period', 'Period') }}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent class="w-auto p-0" align="start">
        <div class="flex flex-wrap gap-1 border-b p-2">
          <Button
            v-for="code in presetItems"
            :key="code"
            type="button"
            size="sm"
            class="h-7 px-2 text-xs"
            :variant="activePreset === code ? 'default' : 'ghost'"
            @click="applyPreset(code)"
          >
            {{ presetLabel(code) }}
          </Button>
        </div>

        <RangeCalendar
          v-model="calendarValue"
          weekday-format="short"
          :number-of-months="2"
          initial-focus
          :placeholder="calendarValue?.start"
        />

        <div
          v-if="tooLong"
          class="border-t px-3 py-2 text-xs text-destructive"
        >
          {{
            translate(
              'common.period.tooLong',
              `The maximum range is ${maxDays} days. Use Reports or Export for longer histories.`,
              { days: maxDays },
            )
          }}
        </div>

        <div class="flex justify-end border-t p-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            class="h-7 px-2 text-xs"
            @click="resetToDefault"
          >
            {{ translate('common.actions.reset', 'Reset') }}
          </Button>
        </div>
      </PopoverContent>
    </Popover>

    <MFieldError :error="error" />
  </div>
</template>
