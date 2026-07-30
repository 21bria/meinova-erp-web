<script setup lang="ts">
import { ref, watch, computed } from "vue"
import { useApi } from "@/composables/useApi"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type LookupItem = { value: string | number; label: string }
type ApiList<T> = { count: number; next: string | null; results: T[] }

const props = defineProps<{
    label: string
    endpoint: string
    depends?: Record<string, any>
    disabled?: boolean
    variant?: "compact" | "field"
}>()

const model = defineModel<string | number | null>({ default: null })
const { request } = useApi()

const open = ref(false)
const search = ref("")
const page = ref(1)
const loading = ref(false)
const items = ref<LookupItem[]>([])
const hasNext = ref(true)

const isField = computed(() => (props.variant ?? "compact") === "field")

const dependsQuery = computed(() => {
    const d = props.depends || {}
    const q: Record<string, any> = {}
    for (const k of Object.keys(d)) {
        q[k] = (d[k]?.value ?? d[k]) ?? undefined
    }
    return q
})

watch(dependsQuery, () => {
    items.value = []
    page.value = 1
    hasNext.value = true
    if (open.value) load(true)
}, { deep: true })

async function load(reset = false) {
    if (props.disabled) return
    if (loading.value) return
    if (!hasNext.value && !reset) return

    loading.value = true
    try {
        const currentPage = reset ? 1 : page.value

        const res = await request<ApiList<LookupItem>>(props.endpoint, {
            method: "GET",
            query: {
                page: currentPage,
                page_size: 10,
                q: search.value?.trim() || undefined, // <-- ganti search jadi q
                ...dependsQuery.value,
            },
        })

        hasNext.value = !!res?.next
        page.value = currentPage

        items.value = reset
            ? (res?.results ?? [])
            : [...items.value, ...(res?.results ?? [])]
    } finally {
        loading.value = false
    }
}

function toggleOpen() {
    if (props.disabled) return
    open.value = !open.value

    if (open.value) {
        page.value = 1
        hasNext.value = true
        load(true)
    }
}

function onScroll(e: Event) {
    const el = e.target as HTMLElement
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20

    if (nearBottom && hasNext.value && !loading.value) {
        page.value += 1
        load()
    }
}

watch(search, () => {
    page.value = 1
    hasNext.value = true
    load(true)
})

const selectedLabel = computed(() => {
    return items.value.find(i => i.value === model.value)?.label
})
</script>

<template>
    <div :class="isField ? 'relative w-full' : 'relative'">
        <Button type="button" variant="outline" :disabled="disabled" @click="toggleOpen" :class="[
            'h-9',
            isField ? 'w-full justify-between px-3' : '',
        ]">
            <span class="truncate">
                <span class="font-medium">{{ label }}:</span>
                {{ model ? (selectedLabel ?? model) : "All" }}
            </span>

            <Icon name="i-radix-icons-chevron-down" class="ml-2 h-4 w-4 opacity-70" />
        </Button>

        <div v-if="open" :class="[
            'absolute z-50 mt-2 rounded-md border bg-background shadow',
            isField ? 'w-full' : 'w-[260px]',
        ]">
            <div class="p-2 border-b">
                <Input placeholder="Search..." v-model="search" class="h-9" />
            </div>

            <div class="max-h-[240px] overflow-auto" @scroll="onScroll">
                <button class="w-full text-left px-3 py-2 text-sm hover:bg-muted" type="button"
                    @click="model = null; open = false">
                    All
                </button>

                <button v-for="it in items" :key="it.value" class="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                    type="button" @click="model = it.value; open = false">
                    {{ it.label }}
                </button>

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