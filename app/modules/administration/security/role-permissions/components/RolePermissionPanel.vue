<script setup lang="ts">
/*
 | Ditulis tangan, bukan hasil generator.
 |
 | Form Role hasil generate tidak punya pemilih permission sama sekali,
 | jadi `Role.permissions` — 708 baris yang menentukan siapa boleh
 | mengubah apa — hanya bisa diisi lewat shell. Layar ini yang
 | memberinya kenop.
 */
import { computed, ref, watch } from 'vue'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import LookupSelect from '@/components/forms/LookupSelect.vue'
import { useApi } from '@/composables/useApi'
import { useNotify } from '@/composables/useNotify'

import PermissionTreeNode from './PermissionTreeNode.vue'
import type { PermissionNode } from './PermissionTreeNode.vue'
import { apiErrorMessage } from '@framework'

const { request } = useApi()
const notify = useNotify()

const role = ref<number | null>(null)
const tree = ref<PermissionNode[]>([])
const expanded = ref<Set<string | number>>(new Set())
const search = ref('')
const loading = ref(false)
const saving = ref(false)

function leaves(nodes: PermissionNode[]): PermissionNode[] {
  const result: PermissionNode[] = []

  const walk = (node: PermissionNode) => {
    if (node.children?.length)
      node.children.forEach(walk)
    else
      result.push(node)
  }

  nodes.forEach(walk)

  return result
}

const selectedCount = computed(
  () => leaves(tree.value).filter(item => item.checked).length,
)

const totalCount = computed(() => leaves(tree.value).length)

function setBranch(node: PermissionNode, checked: boolean) {
  node.checked = checked
  node.children?.forEach(child => setBranch(child, checked))
}

function syncGroups(nodes: PermissionNode[]) {
  for (const node of nodes) {
    if (node.children?.length) {
      syncGroups(node.children)
      node.checked = node.children.every(child => child.checked)
    }
  }
}

function toggle(node: PermissionNode, checked: boolean) {
  setBranch(node, checked)
  syncGroups(tree.value)
}

function toggleExpand(id: string | number) {
  const next = new Set(expanded.value)

  next.has(id) ? next.delete(id) : next.add(id)

  expanded.value = next
}

function expandAll() {
  const next = new Set<string | number>()

  const walk = (nodes: PermissionNode[]) => {
    nodes.forEach((node) => {
      if (node.children?.length) {
        next.add(node.id)
        walk(node.children)
      }
    })
  }

  walk(tree.value)
  expanded.value = next
}

function collapseAll() {
  expanded.value = new Set()
}

async function loadTree() {
  if (!role.value) {
    tree.value = []
    return
  }

  loading.value = true

  try {
    tree.value = await request('/api/accounts/role-permissions/tree/', {
      method: 'GET',
      query: { role: role.value },
    })

    // Sengaja tertutup: sembilan app terbuka sekaligus berarti ratusan
    // baris, dan yang dicari orang selalu satu modul.
    collapseAll()
  }
  catch (e: any) {
    notify.error(apiErrorMessage(e, 'Gagal memuat izin role.'))
  }
  finally {
    loading.value = false
  }
}

async function save() {
  if (!role.value)
    return

  saving.value = true

  try {
    await request('/api/accounts/role-permissions/save/', {
      method: 'POST',
      body: {
        role: role.value,
        permissions: leaves(tree.value)
          .filter(item => item.checked)
          .map(item => String(item.id)),
      },
    })

    notify.success('Izin role tersimpan. Berlaku pada request berikutnya.')
  }
  catch (e: any) {
    notify.error(apiErrorMessage(e, 'Gagal menyimpan izin role.'))
  }
  finally {
    saving.value = false
  }
}

watch(role, loadTree)
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div class="grid w-full max-w-md gap-2">
        <label class="text-sm font-medium">Role</label>
        <LookupSelect
          v-model="role"
          label="Role"
          endpoint="/api/accounts/lookup/roles/"
          variant="field"
          label-key="label"
          value-key="value"
        />
      </div>

      <div class="flex items-center gap-3">
        <span class="text-sm text-muted-foreground">
          {{ selectedCount }} / {{ totalCount }} izin
        </span>

        <Button :disabled="!role || saving" @click="save">
          {{ saving ? 'Menyimpan...' : 'Save' }}
        </Button>
      </div>
    </div>

    <div v-if="role" class="flex flex-wrap items-center gap-2">
      <Input
        v-model="search"
        placeholder="Cari modul atau data..."
        class="max-w-xs"
      />

      <Button variant="outline" size="sm" @click="expandAll">
        Expand All
      </Button>

      <Button variant="outline" size="sm" @click="collapseAll">
        Collapse All
      </Button>
    </div>

    <div class="rounded-lg border p-4">
      <div v-if="!role" class="py-16 text-center text-muted-foreground">
        Pilih role untuk mengatur izinnya.
      </div>

      <div v-else-if="loading" class="py-16 text-center text-muted-foreground">
        Memuat daftar izin...
      </div>

      <div v-else-if="!tree.length" class="py-16 text-center text-muted-foreground">
        Tidak ada izin yang bisa diatur.
      </div>

      <div v-else class="space-y-0.5">
        <PermissionTreeNode
          v-for="node in tree"
          :key="node.id"
          :node="node"
          :level="0"
          :expanded="expanded"
          :search="search"
          @toggle="toggle"
          @expand="toggleExpand"
        />
      </div>
    </div>

    <p class="text-xs text-muted-foreground">
      Izin ini menentukan siapa boleh <strong>menambah, mengubah, dan menghapus</strong>.
      Membaca sengaja dibiarkan terbuka — dropdown dan lookup dipakai lintas modul
      oleh orang yang tidak berkepentingan mengubahnya. Siapa boleh melihat
      <em>baris mana</em> diatur di tab Data Permissions.
    </p>
  </div>
</template>
