<script setup lang="ts">
import draggable from 'vuedraggable'
import { ArrowRight, GripVertical } from 'lucide-vue-next'
import type { FavoriteMenu } from '../types'

const props = defineProps<{
  items: FavoriteMenu[]
  isCustomizing?: boolean
}>()

const emit = defineEmits<{
  'update:items': [value: FavoriteMenu[]]
}>()

const localItems = computed({
  get: () => props.items,
  set: value => emit('update:items', value),
})

function handleClick(event: MouseEvent) {
  if (props.isCustomizing)
    event.preventDefault()
}
</script>

<template>
  <section>
    <div class="mb-3 flex items-center gap-2">
      <h2 class="text-lg font-semibold">Favorite Menus</h2>
      <Badge variant="secondary">{{ items.length }}</Badge>
    </div>

    <draggable v-model="localItems" item-key="code" handle=".menu-drag-handle"
      class="grid gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-2 xl:grid-cols-3" ghost-class="opacity-40">
      <template #item="{ element: menu }">
        <NuxtLink :to="menu.href" class="flex items-center gap-3 rounded-xl p-2 transition hover:bg-muted/60"
          @click="handleClick">
          <button v-if="isCustomizing" type="button"
            class="menu-drag-handle rounded-md p-1 text-muted-foreground hover:text-foreground">
            <GripVertical class="h-4 w-4" />
          </button>

         <div
            class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15"
          >
            <component :is="menu.icon" v-if="menu.icon" class="h-5 w-5" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium">{{ menu.title }}</p>
            <p class="truncate text-xs text-muted-foreground">{{ menu.description }}</p>
          </div>

          <ArrowRight v-if="!isCustomizing" class="h-4 w-4 text-muted-foreground" />
        </NuxtLink>
      </template>
    </draggable>
  </section>
</template>