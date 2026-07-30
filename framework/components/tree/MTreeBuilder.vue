<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { TreeNode, TreeConfig } from "@framework"
import MTreeToolbar from './MTreeToolbar.vue'
import MTreeSearch from './MTreeSearch.vue'
import MTreeNode from './MTreeNode.vue'
import { useApi } from '@/composables/useApi'
import { useNotify } from '@/composables/useNotify'

const props = defineProps<{
  config: TreeConfig
}>()

const { request } = useApi()
const notify = useNotify()

const loading = ref(false)
const saving = ref(false)
const schema = ref<any>(null)
const nodes = ref<TreeNode[]>([])
const search = ref('')
const query = ref<Record<string, any>>({})
const checkedKeys = ref<(string | number)[]>([])

const title = computed(() => schema.value?.title ?? 'Tree Builder')
const description = computed(() => schema.value?.description ?? '')
const selectedCount = computed(() => checkedKeys.value.length)
const expandAll = ref(schema.value?.ui?.expand_all ?? true)

async function loadSchema() {
  loading.value = true
  try {
    schema.value = await request(props.config.endpoint, {
      method: 'GET',
    })
  }
  catch (e: any) {
    notify.error(e?.data?.detail || e?.message || 'Failed to load tree schema')
  }
  finally {
    loading.value = false
  }
}

async function loadTree() {
  if (!schema.value?.endpoint)
    return

  loading.value = true
  try {
    nodes.value = await request(schema.value.endpoint, {
      method: 'GET',
      query: query.value,
    })

    checkedKeys.value = collectChecked(nodes.value)
  }
  catch (e: any) {
    notify.error(e?.data?.detail || e?.message || 'Failed to load tree data')
  }
  finally {
    loading.value = false
  }
}

async function saveTree() {
  if (!schema.value?.save_endpoint)
    return

  saving.value = true
  try {
    await request(schema.value.save_endpoint, {
      method: 'POST',
      body: {
        ...query.value,
        resources: checkedKeys.value,
      },
    })

    notify.success('Tree data saved')
  }
  catch (e: any) {
    notify.error(e?.data?.detail || e?.message || 'Failed to save tree data')
  }
  finally {
    saving.value = false
  }
}

function collectChecked(items: TreeNode[]) {
  const result: (string | number)[] = []

  function walk(list: TreeNode[]) {
    for (const item of list) {
      if (item.checked)
        result.push(item.id)

      if (item.children?.length)
        walk(item.children)
    }
  }

  walk(items)
  return result
}

function toggleNode(node: TreeNode, checked: boolean) {
  if (checked) {
    if (!checkedKeys.value.includes(node.id))
      checkedKeys.value.push(node.id)
  }
  else {
    checkedKeys.value = checkedKeys.value.filter(id => id !== node.id)
  }
}

// TODO: Implement expand/collapse logic delegating to MTreeNode components
function expandTree() {
  // Placeholder for expand all nodes logic
}

// TODO: Implement collapse logic delegating to MTreeNode components
function collapseTree() {
  // Placeholder for collapse all nodes logic
}

// TODO: Implement generic query fields in MTreeToolbar from schema metadata

// TODO: Implement cascade check and indeterminate state handling based on schema metadata

onMounted(loadSchema)
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <!-- <div>
        <h2 class="text-lg font-semibold">
          {{ title }}
        </h2>
        <p v-if="description" class="text-sm text-muted-foreground">
          {{ description }}
        </p>
      </div> -->
    <MTreeToolbar
      v-model:query="query"
      :schema="schema"
      :loading="loading"
      :saving="saving"
      @load="loadTree"
      @save="saveTree"
    />

      <div class="flex items-center space-x-4">
        <span class="text-sm font-medium">Selected: {{ selectedCount }}</span>
        <button type="button" class="btn btn-outline btn-sm" @click="expandTree">Expand All</button>
        <button type="button" class="btn btn-outline btn-sm" @click="collapseTree">Collapse All</button>
        <button type="button" class="btn btn-primary btn-sm" :disabled="saving" @click="saveTree">
          Save
        </button>
      </div>
    </div>


    <div class="max-w-lg">
      <MTreeSearch v-model="search" />
    </div>

    <div class="rounded-lg border bg-card p-4">
      <div v-if="!schema" class="text-sm text-muted-foreground">
        Loading tree schema...
      </div>

      <div v-else-if="loading" class="text-sm text-muted-foreground">
        Loading tree data...
      </div>

      <div v-else-if="!nodes.length" class="text-sm text-muted-foreground">
        No resources found.
      </div>

      <div v-else class="space-y-1">
        <MTreeNode
          v-for="node in nodes"
          :key="`${node.type}-${node.id}`"
          :node="node"
          :search="search"
          :checked-keys="checkedKeys"
          @toggle="toggleNode"
        />
      </div>
    </div>
  </div>
</template>