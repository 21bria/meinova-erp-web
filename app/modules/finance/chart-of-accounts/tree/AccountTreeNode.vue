<script setup lang="ts">
/*
 * Satu simpul pohon bagan akun, rekursif.
 *
 * **Komponen ini wajib diimpor eksplisit oleh pemakainya.** Auto-import
 * Nuxt hanya mencakup `app/components/` dan direktori framework yang
 * didaftarkan di `nuxt.config`; apa pun di bawah `app/modules/**` tidak
 * ikut. `MenuTreeNode.vue` pernah kena persis ini: datanya termuat,
 * pohonnya tidak pernah dirender, dan tidak ada satu pun pesan error.
 *
 * Rekursinya lewat `name` di bawah — komponen yang memanggil dirinya
 * sendiri butuh nama, dan `<script setup>` menurunkannya dari nama
 * berkas hanya kalau komponennya terdaftar.
 */
defineOptions({ name: "AccountTreeNode" })

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
  node: AccountNode
  depth: number
  collapsedIds: Set<number>
  searching: boolean
  canWrite: boolean
}>()

const emit = defineEmits<{
  toggle: [node: AccountNode]
  edit: [node: AccountNode]
  createChild: [node: AccountNode]
  toggleActive: [node: AccountNode]
}>()

const hasChildren = computed(() => props.node.children.length > 0)

/* Saat mencari, seluruh cabang dibuka — hasil pencarian yang
 * tersembunyi di balik simpul terlipat sama saja dengan tidak ada
 * hasilnya. */
const isOpen = computed(() => {
  if (props.searching)
    return true

  return !props.collapsedIds.has(props.node.id)
})
</script>

<template>
  <div>
    <div
      class="flex items-center gap-2 border-b px-3 py-2 last:border-0 hover:bg-muted/40"
      :style="{ paddingLeft: `${12 + depth * 20}px` }"
    >
      <button
        v-if="hasChildren"
        type="button"
        class="text-muted-foreground"
        :disabled="searching"
        @click="emit('toggle', node)"
      >
        <span class="inline-block w-4 text-xs">{{ isOpen ? "▾" : "▸" }}</span>
      </button>
      <span v-else class="inline-block w-4" />

      <span class="w-28 shrink-0 font-mono text-xs text-muted-foreground">
        {{ node.code }}
      </span>

      <span
        class="truncate"
        :class="{
          'font-semibold': !node.posting_allowed,
          'text-muted-foreground line-through': !node.is_active,
        }"
      >
        {{ node.name }}
      </span>

      <!-- Pembedaan akun grup vs akun posting **dinyatakan**, bukan
           diserahkan pada tebal-tipisnya huruf. Memposting ke akun grup
           adalah kesalahan yang ditolak backend; layar harus
           memberitahukannya sebelum orang mencoba. -->
      <Badge v-if="!node.posting_allowed" variant="outline" class="text-[10px]">
        Group
      </Badge>
      <Badge v-else variant="secondary" class="text-[10px]">
        Posting
      </Badge>

      <Badge v-if="node.control_account" variant="outline" class="text-[10px]">
        Control
      </Badge>
      <Badge v-if="node.reconciliation_required" variant="outline" class="text-[10px]">
        Recon
      </Badge>
      <Badge v-if="!node.is_active" variant="destructive" class="text-[10px]">
        Inactive
      </Badge>

      <span class="ml-auto flex items-center gap-1">
        <Button
          v-if="canWrite && !node.posting_allowed"
          variant="ghost"
          size="sm"
          @click="emit('createChild', node)"
        >
          Add child
        </Button>

        <Button variant="ghost" size="sm" @click="emit('edit', node)">
          Edit
        </Button>

        <!-- Tombol hapus sengaja tidak ada di sini. Akun yang sudah
             dipakai jurnal tidak boleh hilang — riwayat pembukuan tidak
             boleh kehilangan nama perkiraannya — dan yang benar
             menonaktifkannya. Backend menolaknya juga; ini supaya
             penolakan itu tidak perlu terjadi. -->
        <Button
          v-if="canWrite"
          variant="ghost"
          size="sm"
          @click="emit('toggleActive', node)"
        >
          {{ node.is_active ? "Deactivate" : "Activate" }}
        </Button>
      </span>
    </div>

    <template v-if="hasChildren && isOpen">
      <AccountTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        :collapsed-ids="collapsedIds"
        :searching="searching"
        :can-write="canWrite"
        @toggle="emit('toggle', $event)"
        @edit="emit('edit', $event)"
        @create-child="emit('createChild', $event)"
        @toggle-active="emit('toggleActive', $event)"
      />
    </template>
  </div>
</template>
