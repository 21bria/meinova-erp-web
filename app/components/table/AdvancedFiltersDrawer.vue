<script setup lang="ts">
import { computed, watch } from "vue"
import type { FilterSchema } from "@/types/table"

import LookupSelect from "./LookupSelect.vue"
import MultiLookupFilter from "./MultiLookupFilter.vue"
import DateRangePicker from "./DateRangePicker.vue"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"

const props = defineProps<{
  title?: string
  filters: FilterSchema[]
  loading?: boolean

  /**
   * Filters to show in drawer (advanced).
   * If empty/undefined -> it will show all filters.
   * If you want "top filters" outside drawer, pass only the rest here.
   */
  includeKeys?: string[]

  /**
   * Optional: hide these keys from drawer
   */
  excludeKeys?: string[]

  /**
   * Optional: if depends missing -> disable controls
   */
  disableOnMissingDepends?: boolean
}>()

// v-model drawer open
const open = defineModel<boolean>("open", { default: false })

// v-model filter values (Record)
const model = defineModel<Record<string, any>>("modelValue", { default: {} })

function isMulti(f: FilterSchema) {
  return f.kind === "select" && (f as any).multiple === true
}

function initValueForFilter(f: FilterSchema) {
  if (f.kind === "daterange") return null
  if (isMulti(f)) return []
  return null
}

function getDependsObject(keys?: string[]) {
  if (!keys?.length) return undefined
  return Object.fromEntries(keys.map((k) => [k, model.value[k]]))
}

function isDependsMissing(keys?: string[]) {
  if (!props.disableOnMissingDepends) return false
  return !!keys?.some((k) => !model.value[k])
}

const shownFilters = computed(() => {
  let fs = props.filters

  if (props.includeKeys?.length) {
    const set = new Set(props.includeKeys)
    fs = fs.filter((f) => (f.kind === "daterange" ? (set.has(f.startKey) || set.has(f.endKey)) : set.has(f.key)))
  }

  if (props.excludeKeys?.length) {
    const set = new Set(props.excludeKeys)
    fs = fs.filter((f) => (f.kind === "daterange" ? (!set.has(f.startKey) && !set.has(f.endKey)) : !set.has(f.key)))
  }

  return fs
})

// ensure model has keys
watch(
  () => props.filters,
  () => {
    const next = { ...model.value }
    for (const f of props.filters) {
      if (f.kind === "daterange") {
        if (!(f.startKey in next)) next[f.startKey] = null
        if (!(f.endKey in next)) next[f.endKey] = null
      } else {
        if (!(f.key in next)) next[f.key] = initValueForFilter(f)
      }
    }
    model.value = next
  },
  { immediate: true }
)

// reset chain generic (depends)
watch(
  () => props.filters,
  () => {
    for (const f of props.filters) {
      if (f.kind !== "select" || !f.depends?.length) continue

      watch(
        () => f.depends!.map((k) => model.value[k]),
        () => {
          model.value[f.key] = isMulti(f) ? [] : null
        },
        { deep: true }
      )
    }
  },
  { immediate: true }
)

function clearAll() {
  for (const f of props.filters) {
    if (f.kind === "daterange") {
      model.value[f.startKey] = null
      model.value[f.endKey] = null
    } else {
      model.value[f.key] = initValueForFilter(f)
    }
  }
}

// for daterange object binding
function rangeValue(startKey: string, endKey: string) {
  return computed({
    get: () => ({ start: model.value[startKey] ?? null, end: model.value[endKey] ?? null }),
    set: (v: { start: string | null; end: string | null }) => {
      model.value[startKey] = v?.start ?? null
      model.value[endKey] = v?.end ?? null
    },
  })
}

const emit = defineEmits<{
  (e: "apply"): void
  (e: "reset"): void
}>()

function applyAndClose() {
  emit("apply")
  open.value = false
}
</script>

<template>
  <Sheet v-model:open="open">
    <SheetTrigger as-child>
      <Button variant="outline" class="h-9" type="button" :disabled="loading">
        <Icon name="i-radix-icons-mixer-horizontal" class="h-4 w-4 mr-2" />
        Advanced
      </Button>
    </SheetTrigger>

   <SheetContent side="right" class="w-[420px] sm:w-[520px] p-0">
    <div class="h-full flex flex-col">
      <SheetHeader class="px-6 pt-6">
        <SheetTitle>{{ props.title ?? "Advanced Filters" }}</SheetTitle>
      </SheetHeader>
 <!-- BODY -->
    <div class="flex-1 overflow-auto px-6 pb-6 pt-4">
      <div class="mt-4 space-y-3">
        <template v-for="f in shownFilters" :key="f.kind === 'daterange' ? (f.startKey + '_' + f.endKey) : f.key">
          <!-- STATIC -->
          <div v-if="f.kind === 'static-select'" class="space-y-1">
            <div class="text-sm font-medium">{{ f.label }}</div>
            <select class="h-9 w-full rounded-md border bg-background px-2 text-sm" v-model="model[f.key]">
              <option :value="null">All</option>
              <option v-for="o in f.options" :key="o.value" :value="o.value">
                {{ o.label }}
              </option>
            </select>
          </div>

          <!-- MULTI -->
          <div v-else-if="f.kind === 'select' && f.multiple" class="space-y-1">
            <div class="text-sm font-medium">{{ f.label }}</div>
            <MultiLookupFilter
              v-model="model[f.key]"
              :title="f.label"
              :endpoint="f.endpoint"
              :depends="getDependsObject(f.depends)"
              :disabled="loading || isDependsMissing(f.depends)"
              variant="field"
            />
          </div>

          <!-- SINGLE -->
          <div v-else-if="f.kind === 'select'" class="space-y-1">
            <div class="text-sm font-medium">{{ f.label }}</div>
            <LookupSelect
              v-model="model[f.key]"
              :label="f.label"
              :endpoint="f.endpoint"
              :depends="getDependsObject(f.depends)"
              :disabled="loading || isDependsMissing(f.depends)"
              variant="field"
            />
          </div>

          <!-- TEXT -->
          <div v-else-if="f.kind === 'text'" class="space-y-1">
            <div class="text-sm font-medium">{{ f.label }}</div>
            <Input class="h-9 w-full" :placeholder="f.placeholder ?? f.label" v-model="model[f.key]" />
          </div>

          <!-- DATE -->
          <div v-else-if="f.kind === 'date'" class="space-y-1">
            <div class="text-sm font-medium">{{ f.label }}</div>
            <Input type="date" class="h-9 w-full" v-model="model[f.key]" />
          </div>

          <!-- DATERANGE modern -->
          <div v-else-if="f.kind === 'daterange'" class="space-y-1">
            <div class="text-sm font-medium">{{ f.label }}</div>
            <DateRangePicker v-model="rangeValue(f.startKey, f.endKey).value" :label="f.label" :number-of-months="2" />
          </div>

          <Separator />
        </template>
      </div>
      </div>
    <!-- FOOTER -->
    <div class="border-t px-6 py-4 bg-background">
      <SheetFooter class="mt-4 flex gap-2">
        <Button variant="outline" class="w-full" type="button" @click="clearAll(); emit('reset')">
          Clear All
        </Button>
        <Button class="w-full" type="button" :disabled="loading" @click="applyAndClose">
          Apply
        </Button>
      </SheetFooter>
 </div>
 </div>
    </SheetContent>
  </Sheet>
</template>