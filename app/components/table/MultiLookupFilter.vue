<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useDebounceFn } from "@vueuse/core"
import { cn } from "@/lib/utils"
import { useApi } from "@/composables/useApi"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"

type Opt = { value: number; label: string; count?: number }
type ApiList<T> = { count: number; next: string | null; results: T[] }

const model = defineModel<number[]>({ default: [] })

const props = defineProps<{
    title: string
    endpoint: string
    depends?: Record<string, any> // boleh ref reactive
    disabled?: boolean
}>()

const { request } = useApi()
const options = ref<Opt[]>([])
const loading = ref(false)
const term = ref("")
const loadError = ref<string | null>(null)

const dependsQuery = computed(() => {
    const d = props.depends || {}
    const q: any = {}
    for (const k of Object.keys(d)) q[k] = (d[k]?.value ?? d[k]) ?? undefined
    return q
})

const selectedValues = computed(() => new Set(model.value))

async function load() {
    if (props.disabled) return
    loading.value = true
    loadError.value = null
    try {
        const res = await request<ApiList<Opt>>(props.endpoint, {
            query: {
                page: 1,
                page_size: 200,
                search: term.value || undefined,
                with_count: 1,
                ...dependsQuery.value,
            },
        })
        options.value = res.results ?? []
    } catch (e: any) {
        loadError.value = e?.message || "Failed to fetch"
        options.value = []
    } finally {
        loading.value = false
    }
}

const debouncedLoad = useDebounceFn(load, 200)

watch([term, dependsQuery], () => debouncedLoad(), { immediate: true })

function toggle(id: number) {
    const set = new Set(model.value)
    set.has(id) ? set.delete(id) : set.add(id)
    model.value = Array.from(set)
}

function clear() {
    model.value = []
}
</script>

<template>
    <Popover>
        <PopoverTrigger as-child>
            <Button variant="outline" size="sm" class="h-8 border-dashed" :disabled="disabled">
                <Icon name="i-radix-icons-plus-circled" class="mr-2 h-4 w-4" />
                {{ props.title }}

                <template v-if="model.length > 0">
                    <Separator orientation="vertical" class="mx-2 h-4" />
                    <Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">
                        {{ model.length }}
                    </Badge>

                    <div class="hidden lg:flex space-x-1">
                        <Badge v-if="model.length > 2" variant="secondary" class="rounded-sm px-1 font-normal">
                            {{ model.length }} selected
                        </Badge>

                        <template v-else>
                            <Badge v-for="item in options.filter(o => selectedValues.has(o.value))" :key="item.value"
                                variant="secondary" class="rounded-sm px-1 font-normal">
                                {{ item.label }}
                            </Badge>
                        </template>
                    </div>
                </template>
            </Button>
        </PopoverTrigger>

        <PopoverContent class="w-[240px] p-0" align="start">
            <Command :filter-function="(list: Opt[], t: any) =>
                list.filter(i => i.label.toLowerCase().includes(String(t).toLowerCase()))
                ">
                <CommandInput :placeholder="props.title" v-model="term" />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup>
                        <CommandItem v-for="opt in options" :key="opt.value" :value="opt"
                            @select="() => toggle(opt.value)">
                            <div :class="cn(
                                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                selectedValues.has(opt.value)
                                    ? 'bg-primary text-primary-foreground'
                                    : 'opacity-50 [&_svg]:invisible',
                            )">
                                <Icon name="i-radix-icons-check" class="h-4 w-4" />
                            </div>
                            <span>{{ opt.label }}</span>
                            <span v-if="opt.count !== undefined"
                                class="ml-auto h-4 w-6 flex items-center justify-center text-xs font-mono">
                                {{ opt.count }}
                            </span>
                        </CommandItem>
                    </CommandGroup>

                    <template v-if="model.length > 0">
                        <CommandSeparator />
                        <CommandGroup>
                            <CommandItem :value="{ label: 'Clear filters' }" class="justify-center text-center"
                                @select="clear">
                                Clear filters
                            </CommandItem>
                        </CommandGroup>
                    </template>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>