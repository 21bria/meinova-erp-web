<script setup lang="ts">
import { ref, watch, computed } from "vue"
import { useApi } from "@/composables/useApi"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type LookupItem = { value: number; label: string }
type ApiList<T> = { count: number; next: string | null; results: T[] }

const props = defineProps<{
    label: string
    endpoint: string
    depends?: Record<string, any>
    disabled?: boolean
    variant?: "compact" | "field"
}>()

const model = defineModel<number | null>({ default: null })
const { request } = useApi()

const open = ref(false)
const search = ref("")
const page = ref(1)
const loading = ref(false)
const items = ref<LookupItem[]>([])
const MIN_SEARCH = 2
const DEBOUNCE_MS = 300

const searchInput = ref("")   // v-model Input
const searchQuery = ref("")   // yang dipakai untuk request (setelah debounce)
let debounceTimer: any = null
const hasNext = ref(true)

const isField = computed(() => (props.variant ?? "compact") === "field")

const dependsQuery = computed(() => {
    const d = props.depends || {}
    const q: any = {}
    for (const k of Object.keys(d)) q[k] = (d[k]?.value ?? d[k]) ?? undefined
    return q
})

/**
 * label cache supaya preview tidak balik ke ID
 */
const labelCache = ref<Record<number, string>>({})

function remember(it: LookupItem) {
    if (it?.value != null) labelCache.value[it.value] = it.label
}

/**
 * ambil 1 label untuk id yang sedang terpilih
 * Pilih salah satu cara:
 * A) retrieve: GET `${endpoint}${id}/`
 * B) filter:  GET endpoint + ?id=id
 */
async function fetchLabelById(id: number) {
    if (!id) return
    if (labelCache.value[id]) return

    try {
        // A) retrieve style (paling enak)
        const detail = await request<any>(`${props.endpoint}${id}/`, { method: "GET" })
        // sesuaikan field label/value kalau berbeda
        const value = Number(detail?.value ?? detail?.id ?? id)
        const label = String(detail?.label ?? detail?.name ?? detail?.title ?? id)
        labelCache.value[value] = label
        return
    } catch {
        // B) fallback: filter by id (kalau endpoint kamu support ?id=)
        try {
            const res = await request<ApiList<any>>(props.endpoint, {
                method: "GET",
                query: { page: 1, page_size: 1, id },
            })
            const it = res?.results?.[0]
            if (it) {
                const value = Number(it?.value ?? it?.id ?? id)
                const label = String(it?.label ?? it?.name ?? it?.title ?? id)
                labelCache.value[value] = label
            }
        } catch {
            // terakhir: biarkan tampil ID
        }
    }
}

watch(
    () => model.value,
    (v) => {
        if (v != null) fetchLabelById(Number(v))
    },
    { immediate: true }
)

watch(dependsQuery, () => {
    items.value = []
    page.value = 1
    hasNext.value = true
    if (open.value) load(true)
})

async function load(reset = false) {
    if (props.disabled) return
    if (loading.value) return
    if (!hasNext.value && !reset) return

    loading.value = true
    try {
        const res = await request<ApiList<LookupItem>>(props.endpoint, {
            method: "GET",
            query: {
                page: page.value,
                page_size: 10,
                // search: search.value || undefined,
                search: searchQuery.value || undefined,
                ...dependsQuery.value,
            },
        })
        hasNext.value = !!res.next
        const newItems = (res.results ?? [])
        newItems.forEach(remember) // ✅ cache label dari list
        items.value = reset ? newItems : [...items.value, ...newItems]
    } finally {
        loading.value = false
    }
}

function toggleOpen() {
    if (props.disabled) return
    open.value = !open.value
    if (open.value && items.value.length === 0) load(true)
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

    // min char
    if (s.length > 0 && s.length < MIN_SEARCH) {
        // jangan hit API
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

const selectedLabel = computed(() => {
    const v = model.value
    if (v == null) return undefined
    return (
        items.value.find(i => i.value === v)?.label ||
        labelCache.value[v] ||
        undefined
    )
})
</script>
<template>
    <div :class="isField ? 'relative w-full' : 'relative'">
        <Button type="button" variant="outline" :disabled="disabled" @click="toggleOpen" :class="[
            'h-9',
            isField ? 'w-full justify-between px-3' : '',
        ]">
            <!-- <span class="truncate">
                <span class="font-medium">{{ label }}:</span>
                {{ model ? (selectedLabel ?? model) : "All" }}
            </span> -->
            <span class="truncate">
                <template v-if="!isField">
                    <span class="font-medium">{{ label }}:</span>
                </template>

                {{ model ? (selectedLabel ?? model) : "All" }}
            </span>
            <Icon name="i-radix-icons-chevron-down" class="ml-2 h-4 w-4 opacity-70" />
        </Button>

        <div v-if="open" :class="[
            'absolute z-50 mt-2 rounded-md border bg-background shadow',
            isField ? 'w-full' : 'w-[260px]'
        ]">
            <div class="p-2 border-b">
                <Input placeholder="Search..." v-model="searchInput" class="h-9" />
            </div>

            <div class="max-h-[240px] overflow-auto" @scroll="onScroll">
                <button class="w-full text-left px-3 py-2 text-sm hover:bg-muted" type="button"
                    @click="model = null; open = false">
                    All
                </button>


                <button v-for="it in items" :key="it.value" class="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                    type="button" @click="remember(it); model = it.value; open = false">
                    {{ it.label }}
                </button>
                <div v-if="searchInput.trim().length > 0 && searchInput.trim().length < MIN_SEARCH"
                    class="px-3 py-2 text-xs text-muted-foreground">
                    Type at least {{ MIN_SEARCH }} characters...
                </div>
                <div v-if="loading" class="px-3 py-2 text-xs text-muted-foreground">Loading...</div>
                <div v-else-if="!items.length" class="px-3 py-2 text-xs text-muted-foreground">No results</div>
            </div>
        </div>
    </div>
</template>