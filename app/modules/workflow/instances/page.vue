<script setup lang="ts">
import {
  normalizeApiErrors,
} from "@framework"

import type {
  FormField,
} from "@framework"

import InstancesTable from "./components/InstancesTable.vue"
import InstancesWorkspace from "./components/InstancesWorkspace.vue"

import {
  instancesForm,
} from "./form"

import {
  useInstancesDetail,
} from "./composables/useInstancesDetail"

import {
  useInstancesWorkspace,
} from "./composables/useInstancesWorkspace"

import type {
  InstancesPayload,
  InstancesRow,
} from "./types"

import type {
  InstancesWorkspaceMode,
} from "./composables/useInstancesWorkspace"

type PageMode = InstancesWorkspaceMode

type SaveAction =
  | "stay"
  | "new"
  | "close"

const props = withDefaults(
  defineProps<{
    mode?: PageMode
  }>(),
  {
    mode: "list",
  },
)

const route = useRoute()
const router = useRouter()

/*
|--------------------------------------------------------------------------
| Form state
|--------------------------------------------------------------------------
*/

const formPayload = ref<
  Record<string, any>
>({})

const formErrors = ref<
  Record<string, any>
>({})

const validationVersion = ref(0)
const saving = ref(false)

/*
|--------------------------------------------------------------------------
| Route record ID
|--------------------------------------------------------------------------
*/

const recordId = computed<
  string | undefined
>(() => {
  const value = route.params.id

  if (Array.isArray(value))
    return value[0]

  if (typeof value === "string")
    return value

  return undefined
})

/*
|--------------------------------------------------------------------------
| Workspace and detail
|--------------------------------------------------------------------------
*/

const workspace =
  useInstancesWorkspace({
    mode: props.mode,
  })

const detail =
  useInstancesDetail()

const {
  record,
  pending,
} = detail

/*
|--------------------------------------------------------------------------
| Mutability
|--------------------------------------------------------------------------
|
| Tombol Edit, Save, dan Delete disembunyikan kalau server sudah
| menyatakan dokumennya tidak bisa dikenai hal itu lagi. Dokumen yang
| sudah difinalisasi tetap menampilkan tombolnya selama ini, dan tiap
| penekanan berakhir di penolakan API — tidak ada data yang rusak, tapi
| tombol yang tidak pernah berhasil tetap bug.
|
| **Tiga field, bukan satu**, dan itu bukan kerapian: `can_edit`
| menjawab "layar edit-nya boleh dibuka?", `can_save` menjawab "isiannya
| boleh disimpan?". Keduanya berbeda pada dokumen ber-approval —
| dokumen yang menunggu persetujuan tidak boleh disunting isinya, tapi
| layar edit-nya justru tempat tombol Withdraw dan Finalize tinggal.
| Menyatukannya membuat dokumen yang sudah disetujui tidak bisa
| difinalisasi siapa pun.
|
| Dua sifat lain juga disengaja:
|
| - mode `create` selalu boleh menyimpan. Barisnya belum ada, jadi belum
|   ada yang bisa menyatakannya terkunci; menilainya dari nilai yang
|   belum ada akan menghilangkan Save dari layar record baru
| - resource yang tidak mengirim ketiga field itu tidak berubah sama
|   sekali (`undefined !== false`), jadi ini aditif untuk seluruh module
|   yang sudah ada
*/
const canEdit = computed(
  () => (record.value as any)?.can_edit !== false,
)

const canSave = computed(() => {
  if (props.mode === "create")
    return true

  return (record.value as any)?.can_save !== false
})

const canDelete = computed(
  () => (record.value as any)?.can_delete !== false,
)

/*
|--------------------------------------------------------------------------
| Mode synchronization
|--------------------------------------------------------------------------
*/

watch(
  () => props.mode,
  (mode) => {
    workspace.setMode(mode)

    if (mode !== "create")
      return

    detail.clearRecord()
    workspace.setRecord(null)

    formPayload.value = {}
    formErrors.value = {}
    validationVersion.value = 0
  },
  {
    immediate: true,
  },
)

/*
|--------------------------------------------------------------------------
| Detail loading
|--------------------------------------------------------------------------
|
| Detail hanya dimuat ketika mode atau ID route berubah.
| Perubahan field form tidak menjalankan watch ini.
|
*/

watch(
  [
    () => props.mode,
    recordId,
  ],
  async ([mode, id]) => {
    if (
      mode === "list"
      || mode === "create"
      || !id
    ) {
      detail.clearRecord()
      workspace.setRecord(null)

      if (mode === "create") {
        formPayload.value = {}
        formErrors.value = {}
      }

      return
    }

    try {
      const currentRecord =
        await detail.fetchRecord(id)

      detail.setRecord(currentRecord)
      workspace.setRecord(currentRecord)

      formPayload.value = currentRecord
        ? {
            ...currentRecord,
          }
        : {}

      formErrors.value = {}
    }
    catch (error) {
      /*
       * ID yang tidak ada harus berakhir di halaman Not Found.
       * Selama ini 404-nya cuma tercatat di console, dan yang dilihat
       * pemakai adalah **formulir kosong** lengkap dengan tombol Save
       * — jadi tautan basi (dokumen yang sudah dihapus, id salah
       * ketik) tidak bisa dibedakan dari record yang memang belum
       * terisi, dan Save-nya berakhir di galat yang membingungkan.
       *
       * Galat lain sengaja tidak diubah: jaringan yang putus bukan
       * alasan mengganti seluruh halaman dengan "Page not found".
       */
      const status = (error as any)?.statusCode
        ?? (error as any)?.status
        ?? (error as any)?.response?.status

      if (status === 404) {
        showError({
          statusCode: 404,
          statusMessage: "Page not found",
          fatal: true,
        })

        return
      }

      console.error(
        "Instances detail load failed:",
        error,
      )

      detail.clearRecord()
      workspace.setRecord(null)

      formPayload.value = {}
    }
  },
  {
    immediate: true,
  },
)

/*
|--------------------------------------------------------------------------
| Form schema
|--------------------------------------------------------------------------
*/

/*
 * `form.ts` hasil generate selalu berupa array, tapi bentuk
 * `{ fields: [...] }` masih dipakai beberapa modul yang ditulis tangan.
 * Uniknya lewat satu tipe gabungan: tanpa itu `Array.isArray()`
 * mempersempit cabang satunya jadi `never`, dan pembacaan `.fields`
 * di sana dilaporkan sebagai error walau kodenya justru yang benar.
 */
type InstancesFormSource =
  | FormField[]
  | { fields?: FormField[] }

const formFields = computed<FormField[]>(() => {
  const source =
    instancesForm as InstancesFormSource

  if (Array.isArray(source))
    return source

  return source?.fields ?? []
})

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

function isEmptyValue(
  value: unknown,
) {
  return (
    value === undefined
    || value === null
    || (
      typeof value === "string"
      && value.trim() === ""
    )
    || (
      Array.isArray(value)
      && value.length === 0
    )
  )
}

function validateRequiredFields() {
  const errors: Record<
    string,
    string[]
  > = {}

  for (const field of formFields.value) {
    if (
      !field?.key
      || field.required !== true
    ) {
      continue
    }

    if (
      isEmptyValue(
        formPayload.value[field.key],
      )
    ) {
      errors[field.key] = [
        `${field.label} is required.`,
      ]
    }
  }

  formErrors.value = errors

  if (Object.keys(errors).length > 0) {
    validationVersion.value += 1
    return false
  }

  return true
}

/*
|--------------------------------------------------------------------------
| Payload normalization
|--------------------------------------------------------------------------
*/

function normalizeLookupValue(
  value: any,
) {
  if (
    !value
    || typeof value !== "object"
    || Array.isArray(value)
    || value instanceof File
    || value instanceof Date
  ) {
    return value
  }

  if ("id" in value)
    return value.id ?? null

  if ("value" in value)
    return value.value ?? null

  return value
}

function buildPayload(
  source: Record<string, any>,
): InstancesPayload {
  const payload: Record<string, any> = {}

  for (
    const [key, rawValue]
    of Object.entries(source)
  ) {
    const value =
      normalizeLookupValue(rawValue)

    payload[key] =
      typeof value === "string"
        ? value.trim()
        : value
  }

  /*
   * File/image dari detail API biasanya URL.
   * Jangan kirim URL kembali sebagai file upload.
   */
  for (const field of formFields.value) {
    if (!field?.key)
      continue

    if (
      ["file", "image"].includes(
        String(field.type),
      )
      && !(
        payload[field.key]
        instanceof File
      )
    ) {
      delete payload[field.key]
    }
  }

  const readonlyFields = [
    "id",
    "full_name",
    "display_name",
    "created_at",
    "updated_at",
    "created_by",
    "updated_by",
    "deleted_at",
    "deleted_by",
    "is_deleted",
  ]

  for (const key of readonlyFields)
    delete payload[key]

  return payload as InstancesPayload
}

/*
|--------------------------------------------------------------------------
| Navigation
|--------------------------------------------------------------------------
*/

async function handleBack() {
  await router.push(
    "/workflow/instances",
  )
}

async function handleEdit(
  currentRecord: InstancesRow,
) {
  if (currentRecord.id == null)
    return

  await router.push(
    `/workflow/instances/${currentRecord.id}/edit`,
  )
}

/*
|--------------------------------------------------------------------------
| Refresh
|--------------------------------------------------------------------------
*/

async function handleRefresh() {
  const id = recordId.value

  if (!id)
    return

  try {
    const currentRecord =
      await detail.fetchRecord(id)

    detail.setRecord(currentRecord)
    workspace.setRecord(currentRecord)

    formPayload.value = currentRecord
      ? {
          ...currentRecord,
        }
      : {}

    formErrors.value = {}
  }
  catch (error) {
    console.error(
      "Instances refresh failed:",
      error,
    )

    detail.clearRecord()
    workspace.setRecord(null)
  }
}

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

function handleDelete(
  currentRecord: InstancesRow,
) {
  if (currentRecord.id == null)
    return

  /*
   * Delete confirmation disambungkan
   * pada tahap resource/delete berikutnya.
   */
}

/*
|--------------------------------------------------------------------------
| Submit
|--------------------------------------------------------------------------
*/

async function submitRecord(
  sourcePayload: Record<string, any>,
): Promise<InstancesRow | null> {
  if (saving.value)
    return null

  /*
   * Payload dari Workspace adalah sumber data terbaru.
   * Ini penting agar field yang dikosongkan tetap terbaca.
   */
  formPayload.value = {
    ...sourcePayload,
  }

  if (!validateRequiredFields())
    return null

  saving.value = true
  formErrors.value = {}

  try {
    const payload =
      buildPayload(formPayload.value)

    if (props.mode === "create") {
      return await detail.createRecord(
        payload,
      )
    }

    if (
      props.mode === "edit"
      && recordId.value
    ) {
      return await detail.updateRecord(
        recordId.value,
        payload,
      )
    }

    return null
  }
  catch (error) {
    formErrors.value =
      detail.errors.value
      ?? normalizeApiErrors(error)

    validationVersion.value += 1

    throw error
  }
  finally {
    saving.value = false
  }
}

/*
|--------------------------------------------------------------------------
| Save actions
|--------------------------------------------------------------------------
*/

async function saveWithAction(
  sourcePayload: Record<string, any>,
  action: SaveAction,
) {
  try {
    const saved =
      await submitRecord(sourcePayload)

    if (!saved?.id)
      return

    detail.setRecord(saved)
    workspace.setRecord(saved)

    formPayload.value = {
      ...saved,
    }

    formErrors.value = {}

    if (action === "new") {
      detail.clearRecord()
      workspace.setRecord(null)

      formPayload.value = {}
      formErrors.value = {}
      validationVersion.value = 0

      await router.push(
        "/workflow/instances/create",
      )

      return
    }

    if (action === "close") {
      await router.push(
        "/workflow/instances",
      )

      return
    }

    /*
     * Save biasa pada ID yang sama tidak perlu
     * mendorong route yang sama lagi.
     */
    if (
      String(recordId.value)
      === String(saved.id)
    ) {
      return
    }

    await router.push(
      `/workflow/instances/${saved.id}/edit`,
    )
  }
  catch {
    /*
     * Error validasi sudah tersedia pada
     * formErrors dan diteruskan ke Workspace.
     */
  }
}

async function handleSave(
  payload: InstancesPayload,
) {
  await saveWithAction(
    payload,
    "stay",
  )
}

async function handleSaveAndNew(
  payload: InstancesPayload,
) {
  await saveWithAction(
    payload,
    "new",
  )
}

async function handleSaveAndClose(
  payload: InstancesPayload,
) {
  await saveWithAction(
    payload,
    "close",
  )
}
</script>

<template>
  <InstancesTable
    v-if="props.mode === 'list'"
  />

  <InstancesWorkspace
    v-else
    v-model="formPayload"
    :mode="props.mode"
    :record="record"
    :record-id="recordId"
    :can-edit="canEdit"
    :can-save="canSave"
    :can-delete="canDelete"
    :loading="pending"
    :saving="saving"
    :errors="formErrors"
    :validation-version="validationVersion"
    @back="handleBack"
    @edit="handleEdit"
    @delete="handleDelete"
    @refresh="handleRefresh"
    @save="handleSave"
    @save-and-new="handleSaveAndNew"
    @save-and-close="handleSaveAndClose"
  >
    <!--
    | Meneruskan slot dari halaman rute ke Workspace.
    |
    | `InstancesWorkspace` sudah punya `<slot :name="tab.key">` untuk tab
    | yang bukan form/resource/history, tapi sebelum ini tidak ada jalan
    | mengisinya: `page.vue` yang memasang Workspace tidak meneruskan
    | slot apa pun, jadi tab bertipe `custom` selalu kosong dan satu-
    | satunya jalan keluarnya menyunting berkas hasil generate — yang
    | hilang begitu module-nya diregenerate.
    |
    | Dengan baris ini, panel khusus ditulis di `app/pages/<module>/`
    | yang memang **tidak** digenerate, dan tab `custom` di schema
    | backend jadi titik sambungnya.
    -->
    <template
      v-for="(_, name) in $slots"
      :key="name"
      #[name]="slotProps"
    >
      <slot
        :name="name"
        v-bind="slotProps ?? {}"
      />
    </template>
  </InstancesWorkspace>
</template>