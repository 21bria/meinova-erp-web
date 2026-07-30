<script setup lang="ts">
import { computed, onMounted } from "vue"
import type { DateRange } from "reka-ui"
import type { DateValue } from "@internationalized/date"
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  toCalendarDate,
  today,
} from "@internationalized/date"
import { Calendar as CalendarIcon } from "lucide-vue-next"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RangeCalendar } from "@/components/ui/range-calendar"
import { cn } from "@/lib/utils"

type Model = { start: string | null; end: string | null }

const model = defineModel<Model>({
  default: {
    start: null,
    end: null,
  },
})

const props = defineProps<{
  label?: string
  numberOfMonths?: number
}>()

const tz = getLocalTimeZone()
const todayDate = today(tz)
const firstDayOfMonth = new CalendarDate(todayDate.year, todayDate.month, 1)

function pad(n: number) {
  return String(n).padStart(2, "0")
}

const defaultStart = `${firstDayOfMonth.year}-${pad(firstDayOfMonth.month)}-${pad(firstDayOfMonth.day)}`
const defaultEnd = `${todayDate.year}-${pad(todayDate.month)}-${pad(todayDate.day)}`
// default value for current month on first mount
onMounted(() => {
  if (!model.value?.start && !model.value?.end) {
    model.value = {
      start: defaultStart,
      end: defaultEnd,
    }
  }
})

const df = new DateFormatter("en-US", { dateStyle: "medium" })

function fromISO(iso: string | null): CalendarDate | undefined {
  if (!iso) return undefined
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) return undefined
  return new CalendarDate(y, m, d)
}

function toISO(value: DateValue | null | undefined): string | null {
  if (!value) return null
  const cd = toCalendarDate(value)
  const y = String(cd.year).padStart(4, "0")
  const m = String(cd.month).padStart(2, "0")
  const d = String(cd.day).padStart(2, "0")
  return `${y}-${m}-${d}`
}

const value = computed<DateRange>({
  get() {
    return {
      start: fromISO(model.value?.start || defaultStart),
      end: fromISO(model.value?.end || defaultEnd),
    }
  },
  set(v) {
    model.value = {
      start: toISO(v?.start),
      end: toISO(v?.end),
    }
  },
})

const pretty = computed(() => {
  const start = value.value?.start
  const end = value.value?.end

  if (!start) return ""
  if (!end) return df.format(start.toDate(tz))
  return `${df.format(start.toDate(tz))} - ${df.format(end.toDate(tz))}`
})
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        class="h-9 justify-start text-left font-normal"
        :class="cn(!value?.start && 'text-muted-foreground')"
        type="button"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        <span v-if="value?.start">{{ pretty }}</span>
        <span v-else>{{ props.label ?? 'Pick date range' }}</span>
      </Button>
    </PopoverTrigger>

    <PopoverContent class="w-auto p-0" align="end">
      <RangeCalendar
        v-model="value"
        weekday-format="short"
        :number-of-months="props.numberOfMonths ?? 2"
        initial-focus
        :placeholder="value?.start"
      />
    </PopoverContent>
  </Popover>
</template>