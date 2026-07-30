<script setup lang="ts">
import { ChevronRight, Folder, FileText } from "lucide-vue-next"
import { Checkbox } from "@/components/ui/checkbox"
import type { MenuTreeItem } from "../types"

const props = defineProps<{
  item: MenuTreeItem
  level: number
  expanded: Set<number>
}>()

const emit = defineEmits<{
  (e: "toggle", item: MenuTreeItem, checked: boolean): void
  (e: "expand", id: number): void
}>()

const isOpen = computed(() => props.expanded.has(props.item.id))
const hasChildren = computed(() => Boolean(props.item.children?.length))
</script>

<template>
  <div>
    <div
      class="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2"
      :style="{ marginLeft: `${level * 22}px` }"
    >
      <button
        type="button"
        class="flex size-5 items-center justify-center"
        @click="hasChildren && emit('expand', item.id)"
      >
        <ChevronRight
          v-if="hasChildren"
          class="size-4 transition-transform"
          :class="{ 'rotate-90': isOpen }"
        />
      </button>

      <Checkbox
        :model-value="item.checked"
        @update:model-value="(v) => emit('toggle', item, v === true)"
      />

      <Folder v-if="hasChildren || item.is_group" class="size-4 text-primary" />
      <FileText v-else class="size-4 text-muted-foreground" />

      <div class="min-w-0">
        <div class="font-medium">
          {{ item.title }}
        </div>
        <div v-if="item.route" class="text-xs text-muted-foreground">
          {{ item.route }}
        </div>
      </div>
    </div>

    <div v-if="hasChildren && isOpen" class="mt-2 space-y-2">
      <MenuTreeNode
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :level="level + 1"
        :expanded="expanded"
        @toggle="(item, checked) => emit('toggle', item, checked)"
        @expand="(id) => emit('expand', id)"
      />
    </div>
  </div>
</template>