<script setup lang="ts">
import { computed } from 'vue'
import { ChevronDown, ChevronRight } from 'lucide-vue-next'
import { Checkbox } from '@/components/ui/checkbox'

export interface PermissionNode {
  id: string | number
  label: string
  code?: string
  checked?: boolean
  is_group?: boolean
  children?: PermissionNode[]
}

const props = defineProps<{
  node: PermissionNode
  level?: number
  expanded: Set<string | number>
  search?: string
}>()

const emit = defineEmits<{
  toggle: [node: PermissionNode, checked: boolean]
  expand: [id: string | number]
}>()

const hasChildren = computed(() => Boolean(props.node.children?.length))
const isOpen = computed(() => props.expanded.has(props.node.id))

/**
 * Pencarian mencocokkan simpul **atau keturunannya**.
 *
 * Mencocokkan simpulnya saja membuat mengetik "employee" menyembunyikan
 * seluruh grup HR yang justru memuatnya — dan yang dicari orang di
 * layar ini hampir selalu nama modelnya, bukan nama app-nya.
 */
const matches = computed(() => {
  const term = (props.search ?? '').trim().toLowerCase()

  if (!term)
    return true

  const hit = (node: PermissionNode): boolean =>
    node.label.toLowerCase().includes(term)
    || String(node.code ?? '').toLowerCase().includes(term)
    || (node.children ?? []).some(hit)

  return hit(props.node)
})

// Sebagian tercentang: kotak induk tidak boleh terlihat "semua boleh"
// padahal cuma View yang dicentang.
const partial = computed(() => {
  if (!hasChildren.value)
    return false

  const leaves: PermissionNode[] = []

  const walk = (node: PermissionNode) => {
    if (node.children?.length)
      node.children.forEach(walk)
    else
      leaves.push(node)
  }

  walk(props.node)

  const on = leaves.filter(item => item.checked).length

  return on > 0 && on < leaves.length
})
</script>

<template>
  <div v-if="matches">
    <div
      class="flex items-center gap-2 rounded-md py-1.5 pr-2 text-sm hover:bg-muted"
      :style="{ paddingLeft: `${(level ?? 0) * 20 + 8}px` }"
    >
      <button
        v-if="hasChildren"
        type="button"
        class="flex size-5 shrink-0 items-center justify-center rounded hover:bg-background"
        @click="emit('expand', node.id)"
      >
        <ChevronDown v-if="isOpen || search" class="size-4" />
        <ChevronRight v-else class="size-4" />
      </button>

      <span v-else class="size-5 shrink-0" />

      <Checkbox
        :model-value="partial ? 'indeterminate' : Boolean(node.checked)"
        @update:model-value="value => emit('toggle', node, value === true)"
      />

      <span :class="node.is_group ? 'font-medium' : 'text-muted-foreground'">
        {{ node.label }}
      </span>
    </div>

    <div v-if="hasChildren && (isOpen || search)">
      <PermissionTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="(level ?? 0) + 1"
        :expanded="expanded"
        :search="search"
        @toggle="(n, c) => emit('toggle', n, c)"
        @expand="id => emit('expand', id)"
      />
    </div>
  </div>
</template>
