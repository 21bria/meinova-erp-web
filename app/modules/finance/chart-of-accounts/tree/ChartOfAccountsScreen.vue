<script setup lang="ts">
/*
 * Layar Chart of Accounts: pohon + tabel.
 *
 * Dua tampilan atas data yang sama, dan keduanya memang dibutuhkan.
 * Pohon menjawab "susunannya seperti apa" — pertanyaan yang tidak bisa
 * dijawab tabel berhalaman. Tabel menjawab "cari akun ini, ubah
 * kolomnya" — pekerjaan yang di pohon berarti menggulir ratusan baris.
 *
 * **Form-nya dipakai ulang, bukan ditulis dua kali.**
 * `chartOfAccountsForm` adalah keluaran generator yang sama persis
 * dengan yang dipakai tabel; berkas ini cuma merendernya di dialognya
 * sendiri. Menulis form kedua berarti dua daftar field yang harus tetap
 * sama, dan yang satu akan tertinggal begitu ada kolom baru di backend.
 */
import { computed, ref } from "vue"

import { apiErrorMessage, normalizeApiErrors } from "@framework"

import { chartOfAccountsForm } from "../form"
import ChartOfAccountsTable from "../components/ChartOfAccountsTable.vue"
import AccountTree from "./AccountTree.vue"

const api = useApi()
const notify = useNotify()

const view = ref<"tree" | "table">("tree")
const companyId = ref<number | null>(null)

const tree = ref<{ reload: () => Promise<void> } | null>(null)

const dialogOpen = ref(false)
const saving = ref(false)
const mode = ref<"create" | "edit">("create")
const model = ref<Record<string, any>>({})
const errors = ref<Record<string, any> | null>(null)
const editingId = ref<number | null>(null)

const dialogTitle = computed(() =>
  mode.value === "create" ? "New Account" : "Edit Account",
)

function openCreate(parent: any | null) {
  mode.value = "create"
  editingId.value = null
  errors.value = null

  model.value = {
    company: companyId.value,
    parent: parent?.id ?? null,
    /*
     * Golongan akun diwarisi dari induknya, dan itu bukan kemudahan
     * belaka: `Account.clean()` menolak anak yang golongannya berbeda
     * dari induknya. Membiarkannya kosong berarti form yang hampir
     * selalu ditolak sekali sebelum benar.
     */
    account_type: parent?.account_type ?? null,
    posting_allowed: true,
    is_active: true,
  }

  dialogOpen.value = true
}

async function openEdit(node: any) {
  mode.value = "edit"
  editingId.value = node.id
  errors.value = null

  try {
    const response = await api.request<any>(`/finance/accounts/${node.id}/`)

    model.value = { ...(response?.data ?? {}) }

    dialogOpen.value = true
  }
  catch (error: any) {
    notify.error(apiErrorMessage(error))
  }
}

async function save() {
  saving.value = true
  errors.value = null

  try {
    if (mode.value === "create") {
      await api.request("/finance/accounts/", {
        method: "POST",
        body: model.value,
      })
    }
    else {
      await api.request(`/finance/accounts/${editingId.value}/`, {
        method: "PATCH",
        body: model.value,
      })
    }

    notify.success(
      mode.value === "create" ? "Account created." : "Account updated.",
    )

    dialogOpen.value = false

    await tree.value?.reload()
  }
  catch (error: any) {
    /*
     * Error per field ditempelkan ke form; sisanya (403, dan penolakan
     * tanpa nama field seperti "induk membentuk lingkaran") muncul
     * sebagai banner di kaki form lewat kunci `detail`. Tanpa cabang
     * kedua itu, penolakan yang tidak menyebut field hilang tanpa satu
     * pun pesan — kegagalan yang paling sulit dilaporkan pemakai.
     */
    errors.value = normalizeApiErrors(error)

    notify.error(apiErrorMessage(error))
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center gap-3">
      <div class="flex rounded-md border p-0.5">
        <Button
          :variant="view === 'tree' ? 'secondary' : 'ghost'"
          size="sm"
          @click="view = 'tree'"
        >
          Tree
        </Button>
        <Button
          :variant="view === 'table' ? 'secondary' : 'ghost'"
          size="sm"
          @click="view = 'table'"
        >
          Table
        </Button>
      </div>

      <MLookupSelect
        v-if="view === 'tree'"
        v-model="companyId"
        label="Company"
        endpoint="/administration/organization/lookup/companies/"
        value-key="value"
        label-key="label"
        class="max-w-xs"
      />
    </div>

    <AccountTree
      v-if="view === 'tree'"
      ref="tree"
      :company-id="companyId"
      @edit="openEdit"
      @create-child="openCreate"
    />

    <!-- Tabel hasil generator, dipakai apa adanya. Ia membawa filter,
         pencarian, paginasi, export, dan dialog CRUD-nya sendiri. -->
    <ChartOfAccountsTable v-else />

    <MFormDialog
      v-model:open="dialogOpen"
      :title="dialogTitle"
      width="xl"
      :loading="saving"
      @submit="save"
    >
      <MFormBuilder
        v-model="model"
        :schema="chartOfAccountsForm"
        :errors="errors"
        :mode="mode"
      />
    </MFormDialog>
  </div>
</template>
