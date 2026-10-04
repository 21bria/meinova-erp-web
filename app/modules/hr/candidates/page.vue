<script setup lang="ts">
import {
  keepsFileFieldValue,
  normalizeApiErrors,
} from "@framework"

import type {
  FormField,
} from "@framework"

import CandidatesTable from "./components/CandidatesTable.vue"
import CandidatesWorkspace from "./components/CandidatesWorkspace.vue"

import {
  candidatesForm,
} from "./form"

import {
  useCandidatesDetail,
} from "./composables/useCandidatesDetail"

import {
  useCandidatesWorkspace,
} from "./composables/useCandidatesWorkspace"

import type {
  CandidatesPayload,
  CandidatesRow,
} from "./types"

import type {
  CandidatesWorkspaceMode,
} from "./composables/useCandidatesWorkspace"

type PageMode = CandidatesWorkspaceMode

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
  useCandidatesWorkspace({
    mode: props.mode,
  })

const detail =
  useCandidatesDetail()

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
        "Candidates detail load failed:",
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
type CandidatesFormSource =
  | FormField[]
  | { fields?: FormField[] }

const formFields = computed<FormField[]>(() => {
  const source =
    candidatesForm as CandidatesFormSource

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
): CandidatesPayload {
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
   * File/image dari detail API biasanya URL — jangan kirim URL kembali
   * sebagai unggahan. **Kecuali** id dari widget unggah terpisah
   * (`valueMode: "id"`): membuangnya membuat berkas yang sudah
   * diunggah tidak pernah tertaut ke record. Lihat
   * `framework/core/utils/uploadPayload.ts`.
   */
  for (const field of formFields.value) {
    if (!field?.key)
      continue

    if (
      ["file", "image"].includes(
        String(field.type),
      )
      && !keepsFileFieldValue(
        field,
        payload[field.key],
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

  return payload as CandidatesPayload
}

/*
|--------------------------------------------------------------------------
| Navigation
|--------------------------------------------------------------------------
*/

async function handleBack() {
  await router.push(
    "/hr/candidates",
  )
}

async function handleEdit(
  currentRecord: CandidatesRow,
) {
  if (currentRecord.id == null)
    return

  await router.push(
    `/hr/candidates/${currentRecord.id}/edit`,
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
      "Candidates refresh failed:",
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
  currentRecord: CandidatesRow,
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
): Promise<CandidatesRow | null> {
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
        "/hr/candidates/create",
      )

      return
    }

    if (action === "close") {
      await router.push(
        "/hr/candidates",
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
      `/hr/candidates/${saved.id}/edit`,
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
  payload: CandidatesPayload,
) {
  await saveWithAction(
    payload,
    "stay",
  )
}

async function handleSaveAndNew(
  payload: CandidatesPayload,
) {
  await saveWithAction(
    payload,
    "new",
  )
}

async function handleSaveAndClose(
  payload: CandidatesPayload,
) {
  await saveWithAction(
    payload,
    "close",
  )
}
</script>

<template>
  <CandidatesTable
    v-if="props.mode === 'list'"
  />

  <CandidatesWorkspace
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
    | `CandidatesWorkspace` sudah punya `<slot :name="tab.key">` untuk tab
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
  </CandidatesWorkspace>
</template>