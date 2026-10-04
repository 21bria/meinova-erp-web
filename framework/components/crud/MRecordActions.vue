<script setup lang="ts">
/*
|--------------------------------------------------------------------------
| Record action
|--------------------------------------------------------------------------
|
| Tombol yang menembak endpoint `@action` milik viewset untuk satu
| record: Submit, Approve, Reject, Generate Periods, dan seterusnya.
|
| Sebelum ini tidak ada yang merendernya. `schema.actions` sudah lama
| ditulis lengkap di backend — Cuti, Roster, dan Employee Action
| semuanya punya deklarasinya — tapi generator tidak membaca kunci itu
| sama sekali, jadi endpoint-nya jalan dan tombolnya tidak pernah ada.
|
| Komponen ini generik dengan sengaja: tidak tahu apa-apa soal HR,
| workflow, atau nama modul. Semua yang membedakan satu tombol dari
| tombol lain datang dari schema — URL, method, syarat tampil, isian
| yang diminta lebih dulu, dan kalimat konfirmasinya. Menambah tombol
| di modul mana pun cukup satu baris di schema backend.
*/

import {
  computed,
  ref,
} from 'vue'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Textarea } from '@/components/ui/textarea'

import { useNotify } from '@/composables/useNotify'

import { actionIcon } from '../../core/utils/actionIcons'
import {
  apiErrorDetail,
  apiErrorMessage,
  normalizeApiErrors,
  wasReported,
} from '../../core/utils/errors'
import { codeLabel, translate } from '../../core/utils/i18n'
import {
  actionBody,
  actionConfirm,
  actionVisible,
  actionFieldLabel,
  actionLabel,
} from '../../core/utils/recordActions'
import { normalizeResourceFields } from '../../core/utils/resourceFields'

import MDialog from '../dialogs/MDialog.vue'

import MDateField from '../forms/MDateField.vue'
import MDateTimeField from '../forms/MDateTimeField.vue'
import MMultiLookupField from '../forms/MMultiLookupField.vue'
import MSelectField from '../forms/MSelectField.vue'
import MWorkspaceResourceDialog from '../workspace/resource/MWorkspaceResourceDialog.vue'

export interface RecordActionField {
  key: string
  type?: string
  label?: string
  required?: boolean
  placeholder?: string

  /* Nilai awal dari schema backend. Dipakai untuk field yang punya
   * angka bawaan di sisi sana — kotak yang terbuka kosong akan
   * ditanyakan pengguna walau backend memang mengisinya sendiri. */
  default?: any

  /* Khusus `type: "multilookup"` — memilih banyak baris dari sebuah
   * endpoint. Dipakai action bulk seperti "Add Employees" pada Roster
   * Setup: memilih tiga puluh orang lewat lookup satuan berarti menekan
   * tombol tiga puluh kali, dan itu persis pekerjaan yang mau
   * dihindari fitur bulk. Placeholder `{id}` di endpoint dirakit dari
   * record yang sedang dibuka, sama seperti `action.endpoint`. */
  endpoint?: string | null
  lookup_endpoint?: string | null
  labelKey?: string | null
  label_key?: string | null
  valueKey?: string | null
  value_key?: string | null
  disabledKey?: string | null
  disabled_key?: string | null
  hint?: string | null
  help_text?: string | null

  /* Pilihan `type: "select"` — `{value, label}` dari schema backend. */
  options?: Array<{ value: string | number, label?: string }>
}

/*
| Form penuh resource lain, dipakai action bertipe `create_resource`.
|
| `fields` datang mentah dari schema backend (dict, snake_case) — bentuk
| yang sama dengan tab resource, jadi dinormalkan pakai helper yang sama
| dan dirender `MFormBuilder` yang sama. Yang membuat form ini dinamis
| (`visible_when` per Action Type, kolom pembanding read-only, lookup
| berantai) sudah ada di deklarasi field-nya; tidak ada satu pun aturan
| yang ditulis ulang di sini.
*/
export interface RecordActionForm {
  fields: any
  parentField?: string | null
  parent_field?: string | null
  title?: string | null
  columns?: number | null
  width?: string | null
}

export interface RecordAction {
  key: string
  label: string

  /* `<namespace>.actions.<key>` dari generator. Label, kalimat
   * konfirmasi, dan label isiannya dicari di bawah kunci ini; yang
   * belum ada di katalog jatuh ke teks schema (`recordActions.ts`). */
  i18nKey?: string | null
  icon?: string | null
  variant?: string | null
  placement?: string | null
  modes?: string[] | null
  endpoint: string
  method?: string | null
  payload?: Record<string, any> | null
  fields?: RecordActionField[] | null
  form?: RecordActionForm | null
  confirm?: boolean | { title?: string, description?: string } | null
  refresh?: boolean | null
  visibleWhen?: Record<string, any> | null
  visible_when?: Record<string, any> | null
  permission?: string | null
}

const props = withDefaults(
  defineProps<{
    actions?: RecordAction[]
    record?: Record<string, any> | null
    mode?: string
    disabled?: boolean
  }>(),
  {
    actions: () => [],
    record: null,
    mode: 'edit',
    disabled: false,
  },
)

const emit = defineEmits<{
  done: [action: RecordAction, response: any]
}>()

const api = useApi()
const notify = useNotify()

const running = ref<string | null>(null)
const pending = ref<RecordAction | null>(null)
const formValues = ref<Record<string, any>>({})

/*
| Petanya dipindah ke `core/utils/actionIcons` supaya toolbar tabel
| (collection action) memakai daftar yang sama persis. Dua salinan yang
| harus tetap sama adalah cara satu tombol punya ikonnya dan tombol
| sebelahnya jatuh ke ikon bawaan tanpa ada yang tahu kenapa.
*/
function iconOf(action: RecordAction) {
  return actionIcon(action.icon)
}

function ruleOf(action: RecordAction) {
  return action.visibleWhen ?? action.visible_when ?? null
}

/*
| Syarat tampil (`visibleWhen`) dinilai `actionVisible` di
| `core/utils/recordActions.ts` — dipindah apa adanya supaya bisa diuji
| tanpa DOM. Aturannya tidak berubah.
*/
function matches(rule: any, record: any): boolean {
  return actionVisible(rule, record)
}

const access = useAccess()

/*
| Dua kosakata izin dipakai bersamaan di codebase ini, dan keduanya
| berbentuk `a.b`:
|
|   security.manage         wewenang yang dihitung kode  -> isGranted()
|   hr.add_employeeaction   izin per model dari Role     -> can()
|
| Pembedanya garis bawah di ruas kedua (`add_employeeaction`), karena
| izin model selalu `<verb>_<model>`. Memakai pemeriksa yang salah gagal
| tanpa suara ke arah yang berbeda: `can("workflow.configure")` selalu
| false untuk yang bukan superuser, dan `isGranted("hr.add_x")` selalu
| true.
|
| Dua-duanya permisif untuk nama yang tidak dikenal — API tetap penjaga
| sebenarnya, dan tombol yang hilang tanpa jejak lebih sulit dilacak
| daripada tombol yang ditolak dengan pesan.
*/
function isAllowed(action: RecordAction) {
  const name = action.permission

  if (!name)
    return true

  const isModelPermission = String(name).split('.')[1]?.includes('_')

  if (isModelPermission)
    return access.can?.(name) !== false

  return access.isGranted?.(name) !== false
}

const available = computed(() => {
  if (!props.record)
    return []

  return props.actions.filter((action) => {
    if (!action?.endpoint)
      return false

    const modes = action.modes

    if (
      Array.isArray(modes)
      && modes.length > 0
      && !modes.includes(props.mode)
    ) {
      return false
    }

    if (!isAllowed(action))
      return false

    return matches(ruleOf(action), props.record)
  })
})

const primary = computed(() =>
  available.value.filter(item => item.placement === 'primary'),
)

const secondary = computed(() =>
  available.value.filter(item => item.placement !== 'primary'),
)

defineExpose({ available })

function confirmOf(action: RecordAction) {
  return actionConfirm(action)
}

function labelOf(action: RecordAction) {
  return actionLabel(action)
}

function fieldLabelOf(action: RecordAction | null, field: RecordActionField) {
  return action ? actionFieldLabel(action, field) : (field.label ?? field.key)
}

function needsDialog(action: RecordAction) {
  return Boolean(
    (action.fields && action.fields.length)
    || action.confirm,
  )
}

/*
|--------------------------------------------------------------------------
| Dokumen baru untuk record ini (`create_resource`)
|--------------------------------------------------------------------------
|
| Dialognya `MWorkspaceResourceDialog` — komponen yang sama dengan yang
| dipakai tab resource di workspace, bukan form kedua yang harus dijaga
| tetap sama. Yang ditambahkan cuma satu hal: kolom induk diisi dari
| record yang sedang dibuka dan tidak ditampilkan.
*/
const resourceAction = ref<RecordAction | null>(null)
const resourceModel = ref<Record<string, any>>({})
const resourceErrors = ref<Record<string, any> | null>(null)
const resourceSaving = ref(false)

function parentFieldOf(action: RecordAction) {
  const form = action.form

  return form?.parentField ?? form?.parent_field ?? null
}

const resourceSchema = computed(() => {
  const action = resourceAction.value

  if (!action?.form)
    return []

  return normalizeResourceFields(
    normalizeFormFields(action.form.fields),
    { parentField: parentFieldOf(action) },
  )
})

/*
| Schema backend menulis field sebagai dict `{nama: config}`; generator
| workspace sudah mengubahnya jadi daftar untuk tab resource. Action
| bisa membawa dua-duanya tergantung apakah generatornya sempat
| menyentuhnya, jadi keduanya diterima di sini.
*/
function normalizeFormFields(fields: any) {
  if (Array.isArray(fields))
    return fields

  if (!fields || typeof fields !== 'object')
    return []

  return Object.entries(fields).map(
    ([key, config]) => ({ key, ...(config as Record<string, any>) }),
  )
}

function startResource(action: RecordAction) {
  resourceModel.value = {}
  resourceErrors.value = null
  resourceAction.value = action
}

async function submitResource(payload: Record<string, any>) {
  const action = resourceAction.value

  if (!action)
    return

  const id = props.record?.id

  if (id === undefined || id === null) {
    notify.error('Record belum tersimpan.')

    return
  }

  const parent = parentFieldOf(action)

  resourceSaving.value = true
  resourceErrors.value = null

  try {
    const response = await api.request(action.endpoint, {
      method: (action.method ?? 'post').toUpperCase() as any,
      body: {
        ...(action.payload ?? {}),
        ...payload,
        // Terakhir, bukan pertama: induknya ditentukan record yang
        // sedang dibuka dan tidak boleh bisa ditimpa isi form.
        ...(parent ? { [parent]: id } : {}),
      },
    })

    notify.success(response?.message ?? `${labelOf(action)} berhasil.`)

    resourceAction.value = null

    emit('done', action, response)
  }
  catch (error) {
    resourceErrors.value = normalizeApiErrors(error)

    // `normalizeApiErrors` sudah menampilkan error non-field; tanpa
    // pemeriksaan ini, satu 403 menghasilkan dua toast yang sama persis.
    if (!wasReported(error))
      notify.error(apiErrorMessage(error, `${labelOf(action)} gagal.`))
  }
  finally {
    resourceSaving.value = false
  }
}

function start(action: RecordAction) {
  if (action.form) {
    startResource(action)

    return
  }

  if (!needsDialog(action)) {
    run(action)

    return
  }

  // Multilookup menyimpan array. Diberi string kosong seperti field
  // lain, `v-model`-nya akan menimpa isian pertama pengguna dan
  // `missingRequired` membacanya sebagai terisi.
  //
  // `default` dari schema dipakai apa adanya. Tanpa itu, field yang
  // punya angka bawaan tetap terbuka sebagai kotak kosong — dan kotak
  // kosong berlabel "Change Shift Every (days)" terbaca sebagai wajib
  // diisi, padahal backend justru memakai bawaannya saat dikosongkan.
  formValues.value = Object.fromEntries(
    (action.fields ?? []).map(field => [
      field.key,
      field.type === 'multilookup'
        ? (field.default ?? [])
        : (field.default ?? ''),
    ]),
  )

  pending.value = action
}

function missingRequired(action: RecordAction) {
  return (action.fields ?? []).find((field) => {
    if (!field.required)
      return false

    const value = formValues.value[field.key]

    return Array.isArray(value)
      ? value.length === 0
      : !String(value ?? '').trim()
  })
}

/* Endpoint field boleh membawa `{id}` seperti `action.endpoint` —
 * daftar kandidat memang milik record yang sedang dibuka. */
function fieldEndpoint(field: RecordActionField) {
  const raw = field.endpoint ?? field.lookup_endpoint ?? ''

  return raw.replace('{id}', String(props.record?.id ?? ''))
}

function selectOptions(field: RecordActionField) {
  return (field.options ?? []).map(option => ({
    value: option.value,
    label: codeLabel(
      field.key,
      String(option.value),
      option.label == null ? null : String(option.label),
    ),
  }))
}

async function confirmDialog() {
  const action = pending.value

  if (!action)
    return

  const missing = missingRequired(action)

  if (missing) {
    notify.error(`${fieldLabelOf(action, missing)} wajib diisi.`)

    return
  }

  // Isian `datetime` dikirim sebagai instan ber-offset — lihat
  // `recordActions.ts`.
  const body = actionBody(action.fields, formValues.value)

  pending.value = null

  await run(action, body)
}

async function run(
  action: RecordAction,
  body: Record<string, any> = {},
) {
  const id = props.record?.id

  if (id === undefined || id === null) {
    notify.error('Record belum tersimpan.')

    return
  }

  running.value = action.key

  try {
    const response = await api.request(
      action.endpoint.replace('{id}', String(id)),
      {
        method: (action.method ?? 'post').toUpperCase() as any,
        body: {
          ...(action.payload ?? {}),
          ...body,
        },
      },
    )

    notify.success(
      response?.message ?? `${labelOf(action)} berhasil.`,
    )

    emit('done', action, response)
  }
  catch (error) {
    // Kunci pesannya `message`, bukan `detail` — envelope backend
    // menaruh kalimatnya di sana, dan `error.message` milik $fetch
    // isinya URL plus kode status yang tidak bisa ditindaklanjuti siapa
    // pun. `apiErrorMessage` yang menanganinya.
    //
    // `apiErrorDetail` didahulukan: tombol action tidak punya kolom
    // yang bisa ditempeli error, jadi toast ini satu-satunya yang
    // dilihat pengguna — dan `data.message` untuk penolakan validasi
    // selalu "Validation failed.", sementara alasan yang sebenarnya
    // ("Step #2 … memuat 2 meja yang berbeda: …") ada di `errors` dan
    // tidak pernah sampai ke layar.
    notify.error(
      apiErrorDetail(error)
      ?? apiErrorMessage(error, `${labelOf(action)} gagal.`),
    )
  }
  finally {
    running.value = null
  }
}
</script>

<template>
  <template v-if="available.length">
    <Button
      v-for="item in primary"
      :key="item.key"
      type="button"
      size="sm"
      :variant="(item.variant ?? 'default') as any"
      :disabled="disabled || running !== null"
      @click="start(item)"
    >
      <component
        :is="iconOf(item)"
        class="mr-2 size-4"
      />
      {{ labelOf(item) }}
    </Button>

    <DropdownMenu v-if="secondary.length">
      <DropdownMenuTrigger as-child>
        <Button
          type="button"
          variant="outline"
          size="sm"
          :disabled="disabled || running !== null"
        >
          {{ translate('common.actions.actions', 'Actions') }}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          v-for="item in secondary"
          :key="item.key"
          :class="
            item.variant === 'destructive'
              ? 'text-destructive'
              : undefined
          "
          @click="start(item)"
        >
          <component
            :is="iconOf(item)"
            class="mr-2 size-4"
          />
          {{ labelOf(item) }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </template>

  <MDialog
    :open="pending !== null"
    :title="pending ? (confirmOf(pending)?.title ?? labelOf(pending)) : ''"
    :description="pending ? (confirmOf(pending)?.description ?? '') : ''"
    width="md"
    @update:open="(value: boolean) => { if (!value) pending = null }"
  >
    <div
      v-if="pending?.fields?.length"
      class="space-y-4"
    >
      <div
        v-for="field in pending.fields"
        :key="field.key"
        class="space-y-2"
      >
        <Label :for="`action-field-${field.key}`">
          {{ fieldLabelOf(pending, field) }}
          <span
            v-if="field.required"
            class="text-destructive"
          >*</span>
        </Label>

        <MMultiLookupField
          v-if="field.type === 'multilookup'"
          v-model="formValues[field.key]"
          :endpoint="fieldEndpoint(field)"
          :placeholder="field.placeholder ?? 'Select…'"
          :label-key="field.labelKey ?? field.label_key ?? 'label'"
          :value-key="field.valueKey ?? field.value_key ?? 'value'"
          :disabled-key="field.disabledKey ?? field.disabled_key ?? ''"
          :hint="field.hint ?? field.help_text ?? null"
        />

        <Textarea
          v-else-if="field.type === 'textarea'"
          :id="`action-field-${field.key}`"
          v-model="formValues[field.key]"
          :placeholder="field.placeholder"
          rows="3"
        />

        <!--
          Tanggal lewat `MDateField`, bukan `<input type="date">`.
          Keduanya menyimpan ISO, jadi yang membedakan cuma tampilannya
          — dan itu justru yang tidak boleh berbeda: kotak tanggal di
          dialog aksi memakai urutan bawaan browser (`09/25/2026` di
          mesin berlokal Amerika) sementara form di sebelahnya memakai
          `25.09.26`. Satu layar, dua urutan hari/bulan, tanpa satu pun
          penanda mana yang mana.
        -->
        <MDateField
          v-else-if="field.type === 'date'"
          v-model="formValues[field.key]"
          :placeholder="field.placeholder"
          :hint="field.hint ?? field.help_text ?? null"
        />

        <!--
          Jam dinding, bukan kotak teks: sebelum ini isian `datetime`
          jatuh ke `<Input type="text">`, dan yang diketik harus persis
          ISO supaya diterima backend.
        -->
        <MDateTimeField
          v-else-if="field.type === 'datetime'"
          v-model="formValues[field.key]"
          :hint="field.hint ?? field.help_text ?? null"
        />

        <!--
          Pilihan tertutup dari schema (`type: "select"` + `options`),
          bukan kotak teks: sebelum ini isian seperti kondisi aset saat
          serah terima jatuh ke `<Input type="text">`, dan yang diketik
          harus persis kode API (`GOOD`) supaya diterima backend. Label
          opsinya dilokalkan seperti select di form (`codeLabel`).
        -->
        <MSelectField
          v-else-if="field.type === 'select'"
          v-model="formValues[field.key]"
          :options="selectOptions(field)"
          :placeholder="field.placeholder ?? translate('common.actions.select', 'Select…')"
          :hint="field.hint ?? field.help_text ?? null"
        />

        <Input
          v-else
          :id="`action-field-${field.key}`"
          v-model="formValues[field.key]"
          :type="
            field.type === 'integer' || field.type === 'number'
              ? 'number'
              : 'text'
          "
          :placeholder="field.placeholder"
        />

        <!-- `MMultiLookupField` menampilkan `hint`-nya sendiri; sisanya
             tidak, jadi `help_text` yang ditulis di schema backend
             hilang tanpa suara. Keterangan yang tidak pernah terbaca
             sama saja dengan tidak ditulis. -->
        <p
          v-if="
            field.type !== 'multilookup'
              && field.type !== 'date'
              && field.type !== 'datetime'
              && field.type !== 'select'
              && (field.hint ?? field.help_text)
          "
          class="text-xs text-muted-foreground"
        >
          {{ field.hint ?? field.help_text }}
        </p>
      </div>
    </div>

    <div class="flex justify-end gap-2 pt-4">
      <Button
        type="button"
        variant="outline"
        @click="pending = null"
      >
        {{ translate('common.actions.cancel', 'Cancel') }}
      </Button>

      <Button
        type="button"
        :variant="(pending?.variant ?? 'default') as any"
        :disabled="running !== null"
        @click="confirmDialog"
      >
        {{ pending ? labelOf(pending) : '' }}
      </Button>
    </div>
  </MDialog>

  <MWorkspaceResourceDialog
    v-if="resourceAction"
    :open="resourceAction !== null"
    mode="create"
    :schema="resourceSchema"
    :initial="resourceModel"
    :loading="resourceSaving"
    :errors="resourceErrors"
    :title="resourceAction.form?.title ?? labelOf(resourceAction)"
    :width="(resourceAction.form?.width ?? 'xl') as any"
    @update:open="
      (value: boolean) => { if (!value) resourceAction = null }
    "
    @submit="submitResource"
  />
</template>
