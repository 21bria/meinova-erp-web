<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'

const props = defineProps<{
    page: number              // 1-based
    pageSize: number
    total: number
    loading?: boolean
    pageSizeOptions?: number[]
}>()

const emit = defineEmits<{
    (e: 'update:page', v: number): void
    (e: 'update:pageSize', v: number): void
}>()

const pageSizeOptions = computed(() => props.pageSizeOptions ?? [10, 20, 30, 40, 50])

const totalPages = computed(() =>
    Math.max(1, Math.ceil((props.total || 0) / (props.pageSize || 10)))
)

const canPrev = computed(() => props.page > 1 && !props.loading)
const canNext = computed(() => props.page < totalPages.value && !props.loading)

const from = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1))
const to = computed(() => Math.min(props.total, props.page * props.pageSize))

function first() { if (canPrev.value) emit('update:page', 1) }
function prev() { if (canPrev.value) emit('update:page', props.page - 1) }
function next() { if (canNext.value) emit('update:page', props.page + 1) }
function last() { if (canNext.value) emit('update:page', totalPages.value) }

function setPageSize(v: unknown) {
  const n = Number(v)
  if (!Number.isFinite(n) || n <= 0) return
  emit('update:pageSize', n)
  emit('update:page', 1)
}

</script>

<template>
    <div class="flex items-center justify-between gap-4 border-t px-3 py-2">
        <div class="flex-1 text-sm text-muted-foreground">
            Showing {{ from }}–{{ to }} of {{ total }}
        </div>

        <div class="flex items-center space-x-6 lg:space-x-8">
            <!-- rows per page -->
            <div class="hidden sm:flex items-center space-x-2">
                <p class="text-sm font-medium">Rows</p>

                <Select :model-value="`${pageSize}`" @update:model-value="setPageSize">
                    <SelectTrigger class="h-8 w-[72px]">
                        <SelectValue :placeholder="`${pageSize}`" />
                    </SelectTrigger>
                    <SelectContent side="top">
                        <SelectItem v-for="ps in pageSizeOptions" :key="ps" :value="`${ps}`">
                            {{ ps }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <!-- page info -->
            <div class="w-[130px] flex items-center justify-center text-sm font-medium">
                Page {{ page }} of {{ totalPages }}
            </div>

            <!-- controls -->
            <div class="flex items-center space-x-2">
                <Button variant="outline" class="hidden h-8 w-8 p-0 lg:flex" :disabled="!canPrev" @click="first">
                    <span class="sr-only">First</span>
                    <Icon name="i-radix-icons-double-arrow-left" class="h-4 w-4" />
                </Button>

                <Button variant="outline" class="h-8 w-8 p-0" :disabled="!canPrev" @click="prev">
                    <span class="sr-only">Prev</span>
                    <Icon name="i-radix-icons-chevron-left" class="h-4 w-4" />
                </Button>

                <Button variant="outline" class="h-8 w-8 p-0" :disabled="!canNext" @click="next">
                    <span class="sr-only">Next</span>
                    <Icon name="i-radix-icons-chevron-right" class="h-4 w-4" />
                </Button>

                <Button variant="outline" class="hidden h-8 w-8 p-0 lg:flex" :disabled="!canNext" @click="last">
                    <span class="sr-only">Last</span>
                    <Icon name="i-radix-icons-double-arrow-right" class="h-4 w-4" />
                </Button>
            </div>
        </div>
    </div>
</template>
