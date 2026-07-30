<template>
  <div :class="isField ? 'relative w-full' : 'relative'">
    <Button
      type="button"
      variant="outline"
      :disabled="disabled"
      @click="toggleOpen"
      :class="[
        'h-9',
        isField ? 'w-full justify-between px-3' : '',
      ]"
    >
      <span class="truncate">
        <template v-if="!isField">
          <span class="font-medium">{{ label }}:</span>
        </template>

        {{ modelValue ?? nullLabel }}
      </span>

      <Icon name="i-radix-icons-chevron-down" class="ml-2 h-4 w-4 opacity-70" />
    </Button>

    <div
      v-if="open"
      :class="[
        'absolute z-50 mt-2 rounded-md border bg-background shadow',
        isField ? 'w-full' : 'w-[260px]'
      ]"
    >
      <div class="p-2 border-b">
        <Input placeholder="Search..." v-model="searchInput" class="h-9" />
      </div>

      <div class="max-h-[240px] overflow-auto" @scroll="onScroll">
        <button
          v-if="allowNull"
          class="w-full text-left px-3 py-2 text-sm hover:bg-muted"
          type="button"
          @click="selectItem(null)"
        >
          {{ nullLabel }}
        </button>

        <button
          v-for="it in items"
          :key="it.value"
          class="w-full text-left px-3 py-2 text-sm hover:bg-muted"
          type="button"
          @click="selectItem(it.value)"
        >
          {{ it.label }}
        </button>

        <div
          v-if="searchInput.trim().length > 0 && searchInput.trim().length < MIN_SEARCH"
          class="px-3 py-2 text-xs text-muted-foreground"
        >
          Type at least {{ MIN_SEARCH }} characters...
        </div>

        <div v-if="loading" class="px-3 py-2 text-xs text-muted-foreground">
          Loading...
        </div>

        <div v-else-if="!items.length" class="px-3 py-2 text-xs text-muted-foreground">
          No results
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue"
import { useApi } from "@/composables/useApi"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type LookupItem = { value: string; label: string }
type ApiList<T> = { count: number; next: string | null; results: T[] }

const props = defineProps<{
  modelValue?: string | null
  label: string
  endpoint: string
  depends?: Record<string, any>
  disabled?: boolean
  variant?: "compact" | "field"
  selectedLabel?: string | null
  valueKey?: string
  labelKey?: string
  allowNull?: boolean
  nullLabel?: string
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string | null): void
}>()

const { request } = useApi()

const open = ref(false)
const page = ref(1)
const loading = ref(false)
const items = ref<LookupItem[]>([])
const hasNext = ref(true)

const MIN_SEARCH = 2
const DEBOUNCE_MS = 300

const searchInput = ref("")
const searchQuery = ref("")
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const isField = computed(() => (props.variant ?? "compact") === "field")
const valueKey = computed(() => props.valueKey ?? "value")
const labelKey = computed(() => props.labelKey ?? "label")
const allowNull = computed(() => props.allowNull ?? true)
const nullLabel = computed(() => props.nullLabel ?? (isField.value ? `Select ${props.label}` : "All"))

const dependsQuery = computed(() => {
  const d = props.depends || {}
  const q: Record<string, any> = {}
  for (const k of Object.keys(d)) {
    q[k] = (d[k]?.value ?? d[k]) ?? undefined
  }
  return q
})

function mapItem(raw: any): LookupItem {
  const value = String(raw?.value ?? raw?.[valueKey.value] ?? "")
  const label = String(
    raw?.label ??
    raw?.[labelKey.value] ??
    value
  )
  return { value, label }
}

async function load(reset = false) {
  if (props.disabled || loading.value) return
  if (!hasNext.value && !reset) return

  loading.value = true
  try {
    const res = await request<ApiList<any>>(props.endpoint, {
      method: "GET",
      query: {
        page: page.value,
        page_size: 10,
        search: searchQuery.value || undefined,
        value_key: props.valueKey ?? "oreas_name",
        label_key: props.labelKey ?? "oreas_name",
        ...dependsQuery.value,
      },
    })

    hasNext.value = !!res?.next
    const newItems = (res?.results ?? []).map(mapItem)
    items.value = reset ? newItems : [...items.value, ...newItems]
  } finally {
    loading.value = false
  }
}

function toggleOpen() {
  if (props.disabled) return
  open.value = !open.value
  if (open.value && items.value.length === 0) {
    load(true)
  }
}

function onScroll(e: Event) {
  const el = e.target as HTMLElement
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
    if (hasNext.value && !loading.value) {
      page.value += 1
      load()
    }
  }
}

watch(searchInput, (v) => {
  if (debounceTimer) clearTimeout(debounceTimer)

  const s = (v ?? "").trim()

  if (s.length > 0 && s.length < MIN_SEARCH) {
    items.value = []
    page.value = 1
    hasNext.value = false
    searchQuery.value = ""
    return
  }

  debounceTimer = setTimeout(() => {
    searchQuery.value = s
  }, DEBOUNCE_MS)
})

watch(searchQuery, () => {
  page.value = 1
  hasNext.value = true
  load(true)
})

function selectItem(value: string | null) {
  emit("update:modelValue", value)
  open.value = false
}
</script>