<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { translate } from "../../core/utils/i18n"
import type { TreeNode, TreeConfig } from "@framework"
import MTreeToolbar from './MTreeToolbar.vue'
import MTreeSearch from './MTreeSearch.vue'
import MTreeNode from './MTreeNode.vue'
import { useApi } from '@/composables/useApi'
import { useNotify } from '@/composables/useNotify'
import { apiErrorMessage } from '@framework'

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

/**
 * Syarat tambahan per simpul (`{id: rule}`), untuk layar yang
 * memakainya — hari ini Menu Permissions.
 *
 * Dikirim apa adanya ke `save_endpoint`; layar tree yang simpulnya
 * tidak punya `rule_options` menghasilkan objek kosong dan tidak
 * berubah perilakunya sama sekali.
 */
const nodeRules = ref<Record<string, string>>({})

const title = computed(() => schema.value?.title ?? 'Tree Builder')
const description = computed(() => schema.value?.description ?? '')
const selectedCount = computed(() => checkedKeys.value.length)

/**
 * Layar yang hanya boleh dibaca.
 *
 * Dua sumber, dan keduanya harus dihormati: `ui.readonly` (pilihan
 * layarnya) dan `save_endpoint` yang tidak ada sama sekali (backend
 * memang tidak punya jalur simpan). Sebelum ini tombol Save tetap
 * terbit di keduanya dan `saveTree()` diam-diam `return` — orang
 * mencentang, menekan Save, dan **tidak ada apa pun yang terjadi**,
 * tanpa satu pesan pun. Itu kegagalan yang paling mahal: yang
 * menyimpan pulang dengan yakin tersimpan.
 */
const readOnly = computed(
  () => Boolean(schema.value?.ui?.readonly) || !schema.value?.save_endpoint,
)

/** Filter wajib yang belum diisi — penyebab paling umum pohon kosong. */
const missingQuery = computed(() => {
  const fields = schema.value?.query ?? {}

  return Object.entries<any>(fields)
    .filter(([key, field]) => field?.required && !query.value[key])
    .map(([key, field]) => String(field?.label ?? key))
})
const expandAll = ref(schema.value?.ui?.expand_all ?? true)

async function loadSchema() {
  loading.value = true
  try {
    schema.value = await request(props.config.endpoint, {
      method: 'GET',
    })
  }
  catch (e: any) {
    notify.error(apiErrorMessage(e, translate("common.errors.loadSchema", "Failed to load schema.")))
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
    nodeRules.value = collectRules(nodes.value)
  }
  catch (e: any) {
    notify.error(apiErrorMessage(e, translate("common.errors.loadData", "Failed to load data.")))
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
        rules: nodeRules.value,
      },
    })

    notify.success('Tree data saved')
  }
  catch (e: any) {
    notify.error(apiErrorMessage(e, translate("common.errors.save", "Failed to save record.")))
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

function collectRules(items: TreeNode[]) {
  const result: Record<string, string> = {}

  function walk(list: TreeNode[]) {
    for (const item of list) {
      if ((item as any).rule_options?.length && (item as any).rule)
        result[String(item.id)] = (item as any).rule

      if (item.children?.length)
        walk(item.children)
    }
  }

  walk(items)
  return result
}

function setNodeRule(node: TreeNode, rule: string) {
  nodeRules.value = {
    ...nodeRules.value,
    [String(node.id)]: rule,
  }
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
      :read-only="readOnly"
      @load="loadTree"
      @save="saveTree"
    />

      <div class="flex items-center space-x-4">
        <span class="text-sm font-medium">Selected: {{ selectedCount }}</span>
        <button type="button" class="btn btn-outline btn-sm" @click="expandTree">Expand All</button>
        <button type="button" class="btn btn-outline btn-sm" @click="collapseTree">Collapse All</button>
        <button
          v-if="!readOnly"
          type="button"
          class="btn btn-primary btn-sm"
          :disabled="saving"
          @click="saveTree"
        >
          Save
        </button>
        <span v-else class="text-sm text-muted-foreground">
          Read-only
        </span>
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

      <!--
        Dipisah dari "tidak ada data". Sebelumnya keduanya menulis
        "No resources found.", jadi layar yang belum dipilih filternya
        terbaca seperti master yang kosong — dan orang mencari sebabnya
        di tempat yang salah.
      -->
      <div v-else-if="missingQuery.length" class="text-sm text-muted-foreground">
        Pilih {{ missingQuery.join(' dan ') }} lebih dulu, lalu tekan Load Tree.
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
          :rules="nodeRules"
          @toggle="toggleNode"
          @rule-change="setNodeRule"
        />
      </div>
    </div>
  </div>
</template>