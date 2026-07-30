<script setup lang="ts">
import { ArrowRight, GripVertical, Star } from 'lucide-vue-next'
import draggable from 'vuedraggable'
import type { FavoriteApplication } from '../types'

const props = defineProps<{
  items: FavoriteApplication[]
  isCustomizing?: boolean
}>()

const emit = defineEmits<{
  'update:items': [value: FavoriteApplication[]]
  'toggle-favorite': [code: string]
}>()

const localItems = computed({
  get: () => props.items,
  set: value => emit('update:items', value),
})
</script>

<template>
  <section>
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-lg font-semibold">Applications</h2>
    </div>

    <draggable
      v-if="isCustomizing"
      v-model="localItems"
      item-key="code"
      handle=".app-drag-handle"
      class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      ghost-class="opacity-40"
    >
      <template #item="{ element: app }">
        <div
          class="group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all hover:shadow-xl"
          :class="!app.favorite ? 'opacity-50 grayscale' : ''"
        >
          <div :class="`absolute inset-0 bg-gradient-to-br opacity-80 ${app.color}`" />

          <div class="relative">
            <div class="mb-6 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="app-drag-handle rounded-md border bg-background/80 p-2 text-muted-foreground hover:text-foreground"
                >
                  <GripVertical class="h-4 w-4" />
                </button>

                <div class="rounded-2xl border bg-background/80 p-3 shadow-sm">
                  <component :is="app.icon" v-if="app.icon" class="h-7 w-7" />
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                @click="emit('toggle-favorite', app.code)"
              >
                <Star
                  class="h-4 w-4"
                  :class="app.favorite ? 'fill-current text-yellow-500' : 'text-muted-foreground'"
                />
              </Button>
            </div>

            <h3 class="text-lg font-semibold">{{ app.title }}</h3>
            <p class="mt-1 text-sm text-muted-foreground">{{ app.description }}</p>
            <p class="mt-5 text-xs font-medium">
              {{ app.favorite ? 'Available in workspace' : 'Hidden from workspace' }}
            </p>
          </div>
        </div>
      </template>
    </draggable>

    <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <NuxtLink
        v-for="app in items"
        :key="app.code"
        :to="app.href"
        class="group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-xl"
      >
        <div :class="`absolute inset-0 bg-gradient-to-br opacity-80 ${app.color}`" />

        <div class="relative">
          <div class="mb-6 flex items-center justify-between">
            <div class="rounded-2xl border bg-background/80 p-3 shadow-sm">
              <component :is="app.icon" v-if="app.icon" class="h-7 w-7" />
            </div>

            <ArrowRight class="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1" />
          </div>

          <h3 class="text-lg font-semibold">{{ app.title }}</h3>
          <p class="mt-1 text-sm text-muted-foreground">{{ app.description }}</p>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>