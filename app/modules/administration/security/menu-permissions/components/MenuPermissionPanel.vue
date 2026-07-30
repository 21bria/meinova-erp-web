<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { ChevronRight, Folder, FileText } from "lucide-vue-next"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import LookupSelect from "@/components/forms/LookupSelect.vue"

import { useApi } from "@/composables/useApi"
import { useNotify } from "@/composables/useNotify"
import { menuPermissionConfig } from "../table"
import type { MenuTreeItem } from "../types"

const { request } = useApi()
const notify = useNotify()

const role = ref<number | null>(null)
const tree = ref<MenuTreeItem[]>([])
const loading = ref(false)
const saving = ref(false)
const expanded = ref<Set<number>>(new Set())

const selectedCount = computed(() => collectChecked(tree.value).length)

function collectChecked(items: MenuTreeItem[]): number[] {
  const ids: number[] = []

  for (const item of items) {
    if (item.checked) ids.push(item.id)
    if (item.children?.length) ids.push(...collectChecked(item.children))
  }

  return ids
}

function setChildrenChecked(item: MenuTreeItem, checked: boolean) {
  item.checked = checked
  item.children?.forEach((child) => setChildrenChecked(child, checked))
}

function syncParentChecked(items: MenuTreeItem[]) {
  for (const item of items) {
    if (item.children?.length) {
      syncParentChecked(item.children)
      item.checked = item.children.some((child) => child.checked)
    }
  }
}

function toggleItem(item: MenuTreeItem, checked: boolean) {
  setChildrenChecked(item, checked)
  syncParentChecked(tree.value)
}

function toggleExpand(id: number) {
  const next = new Set(expanded.value)

  if (next.has(id)) next.delete(id)
  else next.add(id)

  expanded.value = next
}

function expandAll(items = tree.value) {
  const next = new Set<number>()

  function walk(nodes: MenuTreeItem[]) {
    nodes.forEach((item) => {
      if (item.children?.length) {
        next.add(item.id)
        walk(item.children)
      }
    })
  }

  walk(items)
  expanded.value = next
}

async function loadTree() {
  if (!role.value) return

  loading.value = true

  try {
    tree.value = await request(menuPermissionConfig.treeEndpoint, {
      method: "GET",
      query: { role: role.value },
    })

    expandAll()
  } catch (e: any) {
    notify.error(e?.data?.detail || e?.message || "Failed to load menu permissions")
  } finally {
    loading.value = false
  }
}

async function save() {
  if (!role.value) return

  saving.value = true

  try {
    await request(menuPermissionConfig.saveEndpoint, {
      method: "POST",
      body: {
        role: role.value,
        menus: collectChecked(tree.value),
      },
    })

    notify.success("Menu permissions saved")
  } catch (e: any) {
    notify.error(e?.data?.detail || e?.message || "Failed to save menu permissions")
  } finally {
    saving.value = false
  }
}

watch(role, () => {
  tree.value = []
  loadTree()
})
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-end justify-between gap-4">
      <div class="grid w-full max-w-md gap-2">
        <label class="text-sm font-medium">Role</label>
        <LookupSelect
          v-model="role"
          label="Role"
          endpoint="/api/accounts/roles/"
          variant="field"
          label-key="name"
          value-key="id"
        />
      </div>

      <div class="flex items-center gap-3">
        <div class="text-sm text-muted-foreground">
          Selected: {{ selectedCount }}
        </div>

        <Button :disabled="!role || saving" @click="save">
          {{ saving ? "Saving..." : "Save" }}
        </Button>
      </div>
    </div>

    <div class="rounded-lg border p-4">
      <div v-if="!role" class="py-16 text-center text-muted-foreground">
        Select a role to manage menu permissions.
      </div>

      <div v-else-if="loading" class="py-16 text-center text-muted-foreground">
        Loading menu tree...
      </div>

      <div v-else class="space-y-2">
        <template v-for="item in tree" :key="item.id">
          <MenuTreeNode
            :item="item"
            :level="0"
            :expanded="expanded"
            @toggle="toggleItem"
            @expand="toggleExpand"
          />
        </template>
      </div>
    </div>
  </div>
</template>