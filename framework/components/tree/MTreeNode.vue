<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronDown, ChevronRight } from 'lucide-vue-next'

type TreeNode = {
  id: string | number
  label: string
  type?: string
  checked?: boolean
  disabled?: boolean
  children?: TreeNode[]
  meta?: Record<string, any>
}

const props = defineProps<{
  node: TreeNode
  checkedKeys: (string | number)[]
  search?: string
  level?: number
}>()

const emit = defineEmits<{
  toggle: [node: TreeNode, checked: boolean]
}>()

const open = ref(true)

const hasChildren = computed(() => Boolean(props.node.children?.length))
const isChecked = computed(() => props.checkedKeys.includes(props.node.id))

const visible = computed(() => {
  if (!props.search)
    return true

  return props.node.label
    .toLowerCase()
    .includes(props.search.toLowerCase())
})

function toggleChecked(event: Event) {
  const target = event.target as HTMLInputElement
  emit('toggle', props.node, target.checked)
}

function onChildToggle(node: TreeNode, checked: boolean) {
  emit('toggle', node, checked)
}
</script>

<template>
  <div v-if="visible" class="select-none">
    <div
      class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
      :style="{ paddingLeft: `${(level ?? 0) * 18 + 8}px` }"
    >
      <button
        v-if="hasChildren"
        type="button"
        class="flex size-5 items-center justify-center rounded hover:bg-background"
        @click="open = !open"
      >
        <ChevronDown v-if="open" class="size-4" />
        <ChevronRight v-else class="size-4" />
      </button>

      <span v-else class="size-5" />

      <input
        type="checkbox"
        class="size-4"
        :checked="isChecked"
        :disabled="node.disabled"
        @change="toggleChecked"
      >

      <span class="font-medium">
        {{ node.label }}
      </span>

      <span
        v-if="node.type"
        class="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground"
      >
        {{ node.type }}
      </span>
    </div>

    <div v-if="open && hasChildren">
      <MTreeNode
        v-for="child in node.children"
        :key="`${child.type}-${child.id}`"
        :node="child"
        :search="search"
        :checked-keys="checkedKeys"
        :level="(level ?? 0) + 1"
        @toggle="onChildToggle"
      />
    </div>
  </div>
</template>