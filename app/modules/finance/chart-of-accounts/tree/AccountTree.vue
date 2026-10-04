<script setup lang="ts">
/*
 * Bagan akun sebagai pohon.
 *
 * **Ditulis tangan, dan letaknya di `tree/` bukan `components/`.**
 * Generator menulis `actions.ts`, `columns.ts`, `components/`,
 * `filters.ts`, `form.ts`, `index.ts`, `page.vue`, `table.ts`, dan
 * `types.ts`; ia tidak menghapus apa pun di luar itu. Menaruh berkas
 * ini di `components/` berarti kehilangannya pada regenerate berikutnya,
 * tanpa error — folder itu memang miliknya generator.
 *
 * `MTreeBuilder` sengaja tidak dipakai: ia pohon **centang** untuk
 * layar perizinan (checkedKeys + save_endpoint), dan yang dibutuhkan di
 * sini pohon **jelajah** dengan aksi per simpul. Memaksa keduanya jadi
 * satu komponen berarti satu layar membawa separuh mesin yang tidak
 * pernah dipakainya.
 */
import { computed, onMounted, ref, watch } from "vue"

import { apiErrorMessage } from "@framework"

/*
 * Impor eksplisit, dan itu bukan kerapian: auto-import Nuxt tidak
 * mencakup `app/modules/**`. Tanpa baris ini, datanya termuat dan
 * pohonnya **tidak pernah dirender** — persis kegagalan diam yang
 * pernah terjadi pada `MenuTreeNode.vue`.
 */
import AccountTreeNode from "./AccountTreeNode.vue"

type AccountNode = {
  id: number
  code: string
  name: string
  label: string
  account_type: string
  normal_balance: string
  posting_allowed: boolean
  control_account: boolean
  reconciliation_required: boolean
  is_active: boolean
  level: number
  has_entries: boolean
  children: AccountNode[]
}

const props = defineProps<{
  companyId: number | null
}>()

const emit = defineEmits<{
  edit: [node: AccountNode]
  createChild: [parent: AccountNode | null]
}>()

const api = useApi()
const notify = useNotify()
const { can } = useAccess()

const loading = ref(false)
const nodes = ref<AccountNode[]>([])
const search = ref("")
const collapsed = ref<Set<number>>(new Set())

const canWrite = computed(() => can("finance.change_account"))

async function load() {
  if (!props.companyId) {
    nodes.value = []

    return
  }

  loading.value = true

  try {
    const response = await api.request<any>("/finance/accounts/tree/", {
      query: { company: props.companyId },
    })

    nodes.value = response?.data ?? []
  }
  catch (error: any) {
    nodes.value = []

    notify.error(apiErrorMessage(error))
  }
  finally {
    loading.value = false
  }
}

/*
 * Pencarian mencocokkan simpul **atau keturunannya**.
 *
 * Mencocokkan simpulnya saja membuat mengetik "Kas" menyembunyikan
 * grup "Aset Lancar" yang justru memuatnya — dan yang mencari lalu
 * menyimpulkan akunnya tidak ada. Jebakan yang sama pernah kena di
 * `MTreeBuilder`.
 */
function matches(node: AccountNode, term: string): boolean {
  const haystack = `${node.code} ${node.name}`.toLowerCase()

  if (haystack.includes(term))
    return true

  return node.children.some(child => matches(child, term))
}

function filterTree(items: AccountNode[], term: string): AccountNode[] {
  if (!term)
    return items

  return items
    .filter(node => matches(node, term))
    .map(node => ({
      ...node,
      children: filterTree(node.children, term),
    }))
}

const visible = computed(() =>
  filterTree(nodes.value, search.value.trim().toLowerCase()),
)

function toggle(node: AccountNode) {
  const next = new Set(collapsed.value)

  if (next.has(node.id))
    next.delete(node.id)
  else
    next.add(node.id)

  collapsed.value = next
}

function collapseAll() {
  const ids = new Set<number>()

  const walk = (items: AccountNode[]) => {
    for (const node of items) {
      if (node.children.length) {
        ids.add(node.id)

        walk(node.children)
      }
    }
  }

  walk(nodes.value)

  collapsed.value = ids
}

function expandAll() {
  collapsed.value = new Set()
}

async function toggleActive(node: AccountNode) {
  try {
    await api.request(`/finance/accounts/${node.id}/`, {
      method: "PATCH",
      body: { is_active: !node.is_active },
    })

    notify.success(
      `${node.code} ${node.is_active ? "dinonaktifkan" : "diaktifkan"}.`,
    )

    await load()
  }
  catch (error: any) {
    notify.error(apiErrorMessage(error))
  }
}

defineExpose({ reload: load })

onMounted(load)

watch(() => props.companyId, load)
</script>

<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-center gap-2">
      <Input
        v-model="search"
        placeholder="Cari kode atau nama perkiraan…"
        class="max-w-xs"
      />

      <Button variant="outline" size="sm" @click="expandAll">
        Expand all
      </Button>
      <Button variant="outline" size="sm" @click="collapseAll">
        Collapse all
      </Button>

      <div class="ml-auto flex items-center gap-2">
        <Button
          v-if="canWrite"
          size="sm"
          :disabled="!companyId"
          @click="emit('createChild', null)"
        >
          Add Root Account
        </Button>
        <Button variant="ghost" size="sm" :disabled="loading" @click="load">
          Refresh
        </Button>
      </div>
    </div>

    <p v-if="!companyId" class="py-8 text-center text-sm text-muted-foreground">
      Pilih perusahaan untuk melihat bagan akunnya.
    </p>

    <p v-else-if="loading" class="py-8 text-center text-sm text-muted-foreground">
      Memuat…
    </p>

    <p
      v-else-if="!visible.length"
      class="py-8 text-center text-sm text-muted-foreground"
    >
      <!-- Dibedakan dari "belum dipilih" di atas: pohon kosong karena
           filternya dan pohon kosong karena belum ada datanya menuntut
           dua tindakan yang berbeda. -->
      {{ search ? "Tidak ada perkiraan yang cocok." : "Bagan akun masih kosong." }}
    </p>

    <div v-else class="rounded-md border">
      <AccountTreeNode
        v-for="node in visible"
        :key="node.id"
        :node="node"
        :depth="0"
        :collapsed-ids="collapsed"
        :searching="Boolean(search.trim())"
        :can-write="canWrite"
        @toggle="toggle"
        @edit="emit('edit', $event)"
        @create-child="emit('createChild', $event)"
        @toggle-active="toggleActive"
      />
    </div>
  </div>
</template>
