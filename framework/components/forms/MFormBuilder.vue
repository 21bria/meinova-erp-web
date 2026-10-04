<script setup lang="ts">
import { codeLabel, resourceLabel } from "../../core/utils/i18n"

import type { FormField } from '@framework'

import { computed, ref, watch } from 'vue'

import { useAuthStore } from '@/stores/auth'

import { resolveLookupParams } from '../../core/utils/lookupParams'
import { isMeRef, resolveMe as resolveMeRef } from '../../core/utils/me'

import MCheckboxField from './MCheckboxField.vue'
import MDateField from './MDateField.vue'
import MDateTimeField from './MDateTimeField.vue'
import MEmailField from './MEmailField.vue'
import MFieldWarnings from './MFieldWarnings.vue'
import MFileField from './MFileField.vue'
import MImageField from './MImageField.vue'
import MInputField from './MInputField.vue'
import MLookupField from './MLookupField.vue'
import MMultiLookupField from './MMultiLookupField.vue'
import MMultiSelectField from './MMultiSelectField.vue'
import MNumberField from './MNumberField.vue'
import MPasswordField from './MPasswordField.vue'
import MRichEditor from './MRichEditor.vue'
import MSelectField from './MSelectField.vue'
import MSwitchField from './MSwitchField.vue'
import MTextareaField from './MTextareaField.vue'
import MTimeField from './MTimeField.vue'
import MUploadField from './MUploadField.vue'

const props = withDefaults(defineProps<{
  modelValue: Record<string, any>
  schema: FormField[]
  errors?: Record<string, any> | null
  mode?: 'create' | 'edit'
  disabled?: boolean
}>(), {
  errors: null,
  mode: 'create',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
}>()

const workingModel = ref<Record<string, any>>({
  ...props.modelValue,
})

watch(
  () => props.modelValue,
  (value) => {
    workingModel.value = {
      ...value,
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

const auth = useAuthStore()

/*
| Nilai yang datang dari **pengguna yang sedang login**, bukan dari
| form — ditulis `$me.<jalur>` di schema.
|
| Dua pemakaiannya:
|
|   default="$me.placement.company"
|   readonly_when={"field": "$me.data_scope.locked", "op": "is_true"}
|
| Sumbernya `/auth/me`: `placement` (penempatan organisasi orangnya)
| dan `data_scope` (boleh melihat baris yang mana). Keduanya sengaja
| terpisah — HR pusat ditempatkan di Jakarta tapi cakupannya seluruh
| tenant, jadi form-nya boleh terisi Jakarta tapi **tidak boleh**
| terkunci ke sana.
|
| Jalur yang tidak ketemu mengembalikan `undefined`, dan pemanggilnya
| memperlakukan itu sebagai "tidak ada nilai" — bukan sebagai null.
| Selisihnya penting di `applyDefaults`: menulis null ke Company sama
| saja dengan mengosongkannya.
*/
function resolveMe(reference: string) {
  return resolveMeRef(reference, auth.user)
}

/*
| Nilai awal dari schema, **hanya di layar create**.
|
| Kunci yang sudah ada di model tidak disentuh: form edit membaca
| nilainya dari API, dan menimpanya dengan default berarti mengubah
| data yang tidak dibuka siapa pun.
|
| Tanpa ini `default` di schema tidak berlaku di mana pun — switch
| tampil mati padahal schema-nya menyalakannya, dan field yang syarat
| tampilnya membaca switch itu ikut salah tanpa satu pun pesan.
*/
function applyDefaults() {
  if (props.mode !== 'create')
    return

  const patch: Record<string, any> = {}

  for (const field of props.schema) {
    const declared = (field as any).default

    if (declared === undefined)
      continue

    if (props.modelValue[field.key] !== undefined)
      continue

    const fallback = isMeRef(declared)
      ? resolveMe(declared)
      : declared

    /*
    | `/auth/me` mungkin belum termuat saat form pertama dirender, dan
    | penempatan yang kosong adalah keadaan yang sah (akun sistem,
    | superuser yang bukan karyawan). Dua-duanya berarti "tidak ada
    | nilai", bukan "kosongkan" — watch di bawah menjalankan ulang
    | begitu datanya datang.
    */
    if (fallback === undefined || fallback === null)
      continue

    patch[field.key] = fallback
  }

  if (!Object.keys(patch).length)
    return

  emit('update:modelValue', {
    ...props.modelValue,
    ...patch,
  })
}

watch(
  [
    () => props.schema,
    () => props.mode,
    // `/auth/me` lazim datang **setelah** form dirender. Tanpa sumber
    // ini, `default="$me.…"` hanya berlaku pada layar yang dibuka
    // sesudah profilnya termuat — dan yang membuka layarnya langsung
    // setelah login mendapat form kosong tanpa sebab yang terlihat.
    () => auth.user,
  ],
  applyDefaults,
  { immediate: true },
)

function fieldError(key: string) {
  const error = props.errors?.[key]

  return Array.isArray(error)
    ? error[0]
    : error ?? null
}

/**
 * Kunci error yang **tidak menunjuk kolom mana pun**.
 *
 * `normalizeApiErrors` mengembalikan `{detail}` untuk envelope tanpa
 * `errors` — penolakan hak akses, 404, 500 — dan DRF memakai
 * `non_field_errors`/`__all__` untuk keberatan yang menyangkut seluruh
 * record. Tidak satu pun menempel ke kolom, jadi tanpa ini pesannya
 * **tidak muncul di mana-mana**: form biasa gagal disimpan tanpa satu
 * kalimat pun, sementara dialog CRUD punya toast-nya sendiri.
 *
 * Ditulis di sini, bukan di template generator, supaya berlaku untuk
 * seluruh modul yang sudah digenerate tanpa harus diregenerate satu per
 * satu — dan tidak hilang lagi saat ada yang meregenerate.
 */
const NON_FIELD_KEYS = ['detail', 'non_field_errors', '__all__']

const nonFieldErrors = computed<string[]>(() => {
  const source = props.errors ?? {}

  const messages: string[] = []

  for (const key of NON_FIELD_KEYS) {
    const value = (source as Record<string, any>)[key]

    if (!value)
      continue

    if (Array.isArray(value))
      messages.push(...value.map(item => String(item)))
    else
      messages.push(String(value))
  }

  return messages
})

/*
| Opsi dropdown form, dengan label mengikuti bahasa aktif.
|
| Sama persis dengan yang dilakukan `MCrudFilters` untuk penyaring —
| dan sengaja dua tempat, bukan satu komponen bersama: keduanya
| menerima bentuk schema yang berbeda (`CrudFilter` vs `FormField`),
| dan menyatukannya berarti satu tipe union yang cuma dipakai di sini.
|
| `value` tidak disentuh. Itu yang dikirim ke backend saat form
| disimpan; menerjemahkannya berarti menulis "Disetujui" ke kolom yang
| isinya harus "approved".
*/
/*
| Label field, diterjemahkan saat render.
|
| `createForm([...])` adalah `const` di puncak module hasil generate,
| jadi isinya dihitung sekali saat chunk-nya dimuat — dan pada saat itu
| instance i18n belum tentu terpasang. Menerjemahkan di sana membuat
| SELURUH label jatuh ke bahasa Inggris, untuk kedua bahasa, tanpa satu
| pun error. Karena itu yang disimpan generator cuma kuncinya, dan
| penerjemahannya di sini.
|
| Tanpa `labelKey`, `label` dipakai apa adanya — modul lama tidak
| berubah sebaris pun.
*/
function fieldLabel(item: any): string | undefined {
  if (!item?.labelKey)
    return item?.label

  return resourceLabel(item.labelKey, item.label ?? '')
}

function localizedOptions(item: any) {
  /*
  | Opsi boleh membawa `visible_when` sendiri (dialek yang sama dengan
  | field), dinilai terhadap nilai form. Dipakai pilihan yang sahnya
  | bergantung field lain — mis. tujuan Transfer Aset mengikuti fase
  | asal. Opsi tanpa syarat tidak berubah; yang menolak tetap backend.
  */
  const options = (item?.options ?? []).filter((option: any) =>
    evaluateRule(option?.visible_when ?? option?.visibleWhen),
  )

  if (!options.length)
    return options

  return options.map((option: any) => ({
    ...option,
    label: codeLabel(
      String(item.key),
      option?.value == null ? null : String(option.value),
      option?.label == null ? null : String(option.label),
    ),
  }))
}

function isRequired(field: FormField) {
  if (
    field.requiredOnCreate
    && props.mode === 'create'
  ) {
    return true
  }

  return field.required === true
}

function gridClass() {
  const columns
    = (props.schema as any).columns ?? 2

  if (columns === 1)
    return 'grid w-full grid-cols-1 gap-4'

  if (columns === 3) {
    return (
      'grid w-full grid-cols-1 gap-4 '
      + 'sm:grid-cols-2 xl:grid-cols-3'
    )
  }

  if (columns === 4) {
    return (
      'grid w-full grid-cols-1 gap-4 '
      + 'sm:grid-cols-2 xl:grid-cols-4'
    )
  }

  return 'grid w-full grid-cols-1 gap-4 sm:grid-cols-2'
}

function fieldColClass(field: FormField) {
  if (field.layout === 'full')
    return 'min-w-0 sm:col-span-full'

  return 'min-w-0'
}

/*
| Syarat tampil field (`visibleWhen`).
|
| Bentuknya JSON kecil yang bisa divalidasi, bukan ekspresi bebas —
| pola yang sama dengan `WorkflowStep.condition` di backend:
| `{field, op, value}` digabung lewat `all` / `any` / `not`.
|
| Syarat yang tidak bisa dinilai dianggap **terpenuhi**, bukan gagal.
| Field yang hilang gara-gara salah ketik nama kolom jauh lebih sulit
| dilacak daripada field yang tampil padahal seharusnya sembunyi:
| yang pertama membuat orang mencari kesalahan di backend, yang kedua
| kelihatan sendiri.
*/
function isEmpty(value: any) {
  return (
    value === null
    || value === undefined
    || value === ''
  )
}

function evaluateRule(rule: any): boolean {
  if (!rule || typeof rule !== 'object')
    return true

  if (Array.isArray(rule.all))
    return rule.all.every((item: any) => evaluateRule(item))

  if (Array.isArray(rule.any))
    return rule.any.some((item: any) => evaluateRule(item))

  if (rule.not)
    return !evaluateRule(rule.not)

  if (!rule.field)
    return true

  // `$me.…` dibaca dari profil pengguna, bukan dari nilai form. Itu
  // yang membuat `readonly_when` bisa menyatakan "terkunci untuk yang
  // cakupannya sempit" tanpa menambah dialek syarat baru.
  const actual = isMeRef(rule.field)
    ? resolveMe(rule.field)
    : workingModel.value?.[rule.field]

  const expected = rule.value

  switch (rule.op) {
    case 'is_true':
      return actual === true
    case 'is_false':
      return actual === false
    case 'is_null':
      return isEmpty(actual)
    case 'is_not_null':
      return !isEmpty(actual)
    case 'in':
      return Array.isArray(expected)
        && expected.map(String).includes(String(actual))
    case 'not_in':
      return Array.isArray(expected)
        && !expected.map(String).includes(String(actual))
    case 'ne':
      return String(actual) !== String(expected)
    case 'eq':
    default:
      return String(actual) === String(expected)
  }
}

function isVisible(field: FormField) {
  if (field.hidden === true)
    return false

  if (field.visible === false)
    return false

  /*
  | `modes` membatasi field ke layar tertentu — dipakai kolom yang
  | diisi backend (nomor dokumen, status) supaya tidak tampil sebagai
  | kotak kosong di layar create, tempat orang akan mencoba mengisinya.
  | Field tanpa `modes` tampil di semua mode, jadi schema lama tidak
  | berubah perilakunya.
  */
  const modes = (field as any).modes

  if (Array.isArray(modes) && modes.length && !modes.includes(props.mode))
    return false

  return evaluateRule((field as any).visibleWhen)
}

function visibleSchema() {
  return props.schema.filter(isVisible)
}

function gridFields() {
  return visibleSchema().filter(item =>
    item.type !== 'textarea'
    && item.type !== 'richtext'
    && item.layout !== 'full'
    && item.type !== 'switch'
    && item.type !== 'checkbox',
  )
}

function fullWidthFields() {
  return visibleSchema().filter(item =>
    item.type === 'textarea'
    // Editor berformat selalu selebar form. Toolbar-nya sendiri lebih
    // lebar dari setengah kolom, jadi di grid dua kolom tombol-tombolnya
    // terpotong.
    || item.type === 'richtext'
    || item.layout === 'full',
  )
}

function footerFields() {
  return visibleSchema().filter(item =>
    item.type === 'switch'
    || item.type === 'checkbox',
  )
}

function dependencyKeys(
  field: FormField,
): string[] {
  if (!field.dependsOn)
    return []

  return Array.isArray(field.dependsOn)
    ? field.dependsOn
    : [field.dependsOn]
}

function update(
  key: string,
  value: any,
) {
  const nextValue = {
    ...workingModel.value,
    [key]: value,
  }

  for (const field of props.schema) {
    if (
      dependencyKeys(field).includes(key)
    ) {
      nextValue[field.key] = null

      const detailField
        = resolveDetailField(field)

      if (
        field.type === 'file'
        && detailField in nextValue
      ) {
        nextValue[detailField] = null
      }
    }
  }

  workingModel.value = nextValue

  emit(
    'update:modelValue',
    {
      ...nextValue,
    },
  )
}

function applyAutofill(
  field: FormField,
  selected: Record<string, any> | null,
) {
  const mapping
    = field.autofill ?? {}

  if (!Object.keys(mapping).length)
    return

  const nextValue = {
    ...workingModel.value,
  }

  for (
    const [targetKey, sourceKey]
    of Object.entries(mapping)
  ) {
    /*
     * Kunci yang **tidak ada** di baris lookup bukan nilai kosong —
     * itu salah konfigurasi, dan mengosongkan targetnya adalah
     * jawaban yang paling merusak: field yang barusan diisi orangnya
     * terhapus tanpa satu pun pesan, dan field yang `dependsOn`
     * kepadanya ikut mati.
     *
     * Kejadian nyata: `autofill={"company": "company"}` pada field
     * Site di form Roster Setup, sementara `LocationLookup` cuma
     * mengirim `{value, label}`. Pilih Company → pilih Site →
     * Company kosong lagi.
     *
     * Kunci yang **ada** tapi bernilai null tetap dihormati: pegawai
     * yang memang tidak punya branch harus mengosongkan Branch.
     */
    if (
      selected
      && !(sourceKey in selected)
    ) {
      if (import.meta.dev) {
        console.warn(
          `[MFormBuilder] autofill "${field.key}" → "${targetKey}" `
          + `membaca "${sourceKey}" yang tidak dikirim endpoint `
          + `lookup-nya. Dilewati; tambahkan kuncinya di `
          + `serialize() lookup itu, atau cabut autofill-nya.`,
        )
      }

      continue
    }

    nextValue[targetKey]
      = selected?.[sourceKey]
        ?? null

    const targetField
      = props.schema.find(
        item => item.key === targetKey,
      )

    if (
      targetField?.type
      === 'lookup'
    ) {
      const labelKey
        = `${sourceKey}_label`

      nextValue[
        `${targetKey}_label`
      ]
        = selected?.[labelKey]
          ?? null
    }
  }

  workingModel.value
    = nextValue

  emit(
    'update:modelValue',
    {
      ...nextValue,
    },
  )
}

function isFieldDisabled(
  field: FormField,
) {
  if (
    props.disabled
    || field.disabled === true
    || field.readonly === true
  ) {
    return true
  }

  /*
  | Terkunci **bersyarat**, bentuknya sama dengan `visibleWhen`.
  |
  | Dipakai kolom yang nilainya diisi sistem sebagian waktu saja —
  | Employee Number selama Auto Generate menyala. Menyembunyikannya
  | bukan jawabannya: kolom itu yang paling dicari orang, dan yang
  | perlu dicegah cuma mengetik nilai yang toh diabaikan server.
  */
  if (evaluateRule((field as any).readonlyWhen) === true
    && (field as any).readonlyWhen) {
    return true
  }

  const dependencies
    = dependencyKeys(field)

  if (!dependencies.length)
    return false

  return dependencies.some((key) => {
    const parentValue
      = workingModel.value[key]

    return (
      parentValue === undefined
      || parentValue === null
      || parentValue === ''
    )
  })
}

function resolveLookupDepends(
  field: FormField,
) {
  return resolveLookupParams(
    field.lookupParams,
    workingModel.value,
  )
}

function isUploadField(
  field: FormField,
) {
  return (
    field.type === 'file'
    && (
      field.widget === 'upload'
      || field.widget === 'image-upload'
      || field.uploadMode === 'separate'
      || field.upload_mode === 'separate'
    )
  )
}

function resolveDetailField(
  field: FormField,
) {
  return (
    field.detailField
    ?? field.detail_field
    ?? `${field.key}_detail`
  )
}

/**
 * Label yang ditampilkan field lookup sebelum dropdown-nya dibuka.
 *
 * `displayKey` didahulukan karena tidak semua field memakai pola
 * `<key>_name` — mata uang memakai `currency_code`, misalnya. Dua
 * fallback di bawahnya dipertahankan untuk field yang schema-nya
 * memang tidak menyebutkan apa-apa.
 *
 * Tanpa salah satu dari ketiganya field menampilkan **pk mentah**
 * sampai dropdown-nya diklik: komponennya baru bisa mencocokkan label
 * setelah daftar opsinya dimuat, dan daftar yang besar (mis. daftar
 * pegawai untuk "Reports To") memang baru dimuat saat dibuka.
 */
function resolveSelectedLabel(
  field: FormField,
) {
  const key = field.key

  const explicit = (field as any).displayKey

  return (
    (explicit
      ? workingModel.value[explicit]
      : null)
    ?? workingModel.value[
      `${key}_label`
    ]
    ?? workingModel.value[
      `${key}_name`
    ]
    ?? null
  )
}
</script>

<template>
  <div class="w-full">
    <div :class="gridClass()">
      <template
        v-for="item in gridFields()"
        :key="item.key"
      >
      <div
        :class="fieldColClass(item)"
        :data-field-key="item.key"
      >
        <slot
          :name="`field-${item.key}`"
          :field="item"
          :model="modelValue"
          :error="fieldError(item.key)"
          :update="(value: any) => update(item.key, value)"
        >
          <component
            :is="item.component"
            v-if="
              item.type === 'custom'
                && item.component
            "
            v-bind="item.props ?? {}"
            :model-value="modelValue[item.key]"
            :disabled="
              disabled
                || item.disabled
            "
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MInputField
            v-else-if="item.type === 'text'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MEmailField
            v-else-if="item.type === 'email'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MPasswordField
            v-else-if="item.type === 'password'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MNumberField
            v-else-if="item.type === 'number'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MSelectField
            v-else-if="
              item.type === 'select'
                && !item.multiple
            "
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :placeholder="item.placeholder"
            :options="localizedOptions(item)"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            :hint="item.hint"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MMultiSelectField
            v-else-if="
              item.type === 'select'
                && item.multiple
            "
            :model-value="
              Array.isArray(modelValue[item.key])
                ? modelValue[item.key]
                : []
            "
            :label="fieldLabel(item)"
            :placeholder="item.placeholder"
            :options="localizedOptions(item)"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <!-- Kolom ManyToMany. Harus berdiri sebelum cabang lookup
               tunggal di bawahnya: rantai `v-else-if` berhenti pada
               yang cocok pertama, dan `type`-nya sama-sama 'lookup'. -->
          <MMultiLookupField
            v-else-if="item.type === 'lookup' && item.multiple"
            :model-value="Array.isArray(workingModel[item.key]) ? workingModel[item.key] : []"
            :label="fieldLabel(item)"
            :endpoint="item.endpoint ?? ''"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="isFieldDisabled(item)"
            :error="fieldError(item.key)"
            :hint="item.hint"
            @update:model-value="update(item.key, $event)"
          />

          <MLookupField
            v-else-if="item.type === 'lookup'"
            :model-value="workingModel[item.key]"
            :label="fieldLabel(item)"
            :endpoint="item.endpoint ?? ''"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="isFieldDisabled(item)"
            :error="fieldError(item.key)"
            :depends="resolveLookupDepends(item)"
            :selected-label="
              resolveSelectedLabel(item)
            "
            @update:model-value="
              update(item.key, $event)
            "
            @select="
              applyAutofill(
                item,
                $event,
              )
            "
          />

          <MDateField
            v-else-if="item.type === 'date'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <!--
            `time` dan `datetime` tidak punya cabang render sama sekali
            sampai hari ini, dan tidak ada `v-else` penadahnya — jadi
            field-nya **hilang dari form tanpa satu pun pesan**. Yang
            paling merugikan Shift: Start Time dan End Time tampil di
            tabel tapi tidak ada di dialog Edit, sehingga jam kerja yang
            menentukan seluruh perhitungan keterlambatan tidak bisa
            diubah dari layar mana pun.

            Komponennya sendiri sudah lama ada di folder ini, cuma tidak
            pernah diimpor — pola yang sama persis dengan `MRichEditor`
            dan `field.richtext()`.

            `placeholder` sengaja tidak dioper: kedua komponen tidak
            punya prop itu, dan prop yang tidak dikenal jatuh jadi
            atribut mati tanpa keluhan Vue.
          -->
          <MTimeField
            v-else-if="item.type === 'time'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :hint="item.hint"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MDateTimeField
            v-else-if="item.type === 'datetime'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :hint="item.hint"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <!--
            `url` juga tidak pernah dirender, dan akibatnya kolom
            Website hilang dari form Company maupun Branch. Tidak ada
            komponen khususnya; `MInputField` sudah cukup — yang
            memeriksa bentuk URL tetap backend.
          -->
          <MInputField
            v-else-if="item.type === 'url'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MUploadField
            v-else-if="isUploadField(item)"
            :model-value="modelValue[item.key]"
            :detail="
              modelValue[
                resolveDetailField(item)
              ] ?? null
            "
            :label="fieldLabel(item)"
            :hint="item.hint"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            :accept="item.accept"
            :multiple="item.multiple"
            :max-size-mb="
              item.maxSizeMb
                ?? item.max_size_mb
            "
            :category="
              item.category
                ?? 'attachment'
            "
            :public-file="
              item.public === true
            "
            :preview="
              item.preview !== false
            "
            :download="
              item.download !== false
            "
            :replace="
              item.replace !== false
            "
            :delete-file="
              item.delete !== false
            "
            :upload-endpoint="
              item.uploadEndpoint
                ?? item.upload_endpoint
                ?? '/api/uploads/'
            "
            :image-mode="
              item.widget === 'image-upload'
            "
            @update:model-value="
              update(item.key, $event)
            "
            @update:detail="
              update(
                resolveDetailField(item),
                $event,
              )
            "
          />

          <MFileField
            v-else-if="item.type === 'file'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :hint="item.hint"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            :accept="item.accept"
            :multiple="item.multiple"
            :max-size-mb="
              item.maxSizeMb
                ?? item.max_size_mb
            "
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MImageField
            v-else-if="item.type === 'image'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :hint="item.hint"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            :multiple="item.multiple"
            :max-size-mb="
              item.maxSizeMb
                ?? item.max_size_mb
            "
            @update:model-value="
              update(item.key, $event)
            "
          />
        </slot>
      </div>
    </template>
  </div>

  <div class="mt-4 space-y-4">
    <template
      v-for="item in fullWidthFields()"
      :key="item.key"
    >
      <div
        :class="fieldColClass(item)"
        :data-field-key="item.key"
      >
        <slot
          :name="`field-${item.key}`"
          :field="item"
          :model="modelValue"
          :error="fieldError(item.key)"
          :update="(value: any) => update(item.key, value)"
        >
          <component
            :is="item.component"
            v-if="
              item.type === 'custom'
                && item.component
            "
            v-bind="item.props ?? {}"
            :model-value="modelValue[item.key]"
            :disabled="
              disabled
                || item.disabled
            "
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <!--
            Peringatan konfigurasi backend (`widget: "warnings"`), hanya
            tampilan: tidak masuk `errors` dan tidak menahan simpan.
          -->
          <MFieldWarnings
            v-else-if="item.type === 'warnings'"
            :field-key="String(item.key)"
            :label="fieldLabel(item)"
            :items="modelValue[item.key]"
          />

          <MTextareaField
            v-else-if="item.type === 'textarea'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :placeholder="item.placeholder"
            :rows="item.rows"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MRichEditor
            v-else-if="item.type === 'richtext'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :placeholder="item.placeholder"
            :hint="item.hint"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MUploadField
            v-else-if="isUploadField(item)"
            :model-value="modelValue[item.key]"
            :detail="
              modelValue[
                resolveDetailField(item)
              ] ?? null
            "
            :label="fieldLabel(item)"
            :hint="item.hint"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            :accept="item.accept"
            :multiple="item.multiple"
            :max-size-mb="
              item.maxSizeMb
                ?? item.max_size_mb
            "
            :category="
              item.category
                ?? 'attachment'
            "
            :public-file="
              item.public === true
            "
            :preview="
              item.preview !== false
            "
            :download="
              item.download !== false
            "
            :replace="
              item.replace !== false
            "
            :delete-file="
              item.delete !== false
            "
            :upload-endpoint="
              item.uploadEndpoint
                ?? item.upload_endpoint
                ?? '/api/uploads/'
            "
            :image-mode="
              item.widget === 'image-upload'
            "
            @update:model-value="
              update(item.key, $event)
            "
            @update:detail="
              update(
                resolveDetailField(item),
                $event,
              )
            "
          />

          <MInputField
            v-else-if="item.type === 'text'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MEmailField
            v-else-if="item.type === 'email'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MPasswordField
            v-else-if="item.type === 'password'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MNumberField
            v-else-if="item.type === 'number'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MSelectField
            v-else-if="item.type === 'select'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :placeholder="item.placeholder"
            :options="localizedOptions(item)"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            :hint="item.hint"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <!-- Kolom ManyToMany. Harus berdiri sebelum cabang lookup
               tunggal di bawahnya: rantai `v-else-if` berhenti pada
               yang cocok pertama, dan `type`-nya sama-sama 'lookup'. -->
          <MMultiLookupField
            v-else-if="item.type === 'lookup' && item.multiple"
            :model-value="Array.isArray(workingModel[item.key]) ? workingModel[item.key] : []"
            :label="fieldLabel(item)"
            :endpoint="item.endpoint ?? ''"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="isFieldDisabled(item)"
            :error="fieldError(item.key)"
            :hint="item.hint"
            @update:model-value="update(item.key, $event)"
          />

          <MLookupField
            v-else-if="item.type === 'lookup'"
            :model-value="workingModel[item.key]"
            :label="fieldLabel(item)"
            :endpoint="item.endpoint ?? ''"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="isFieldDisabled(item)"
            :error="fieldError(item.key)"
            :depends="resolveLookupDepends(item)"
            :selected-label="resolveSelectedLabel(item)"
            @update:model-value="update(item.key, $event)"
            @select="
              applyAutofill(
                item,
                $event,
              )
            "
          />

          <MDateField
            v-else-if="item.type === 'date'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <!--
            Salinan cabang yang sama untuk field ber-`layout: "full"`.
            Blok ini memang menduplikasi blok grid di atas; menambah
            tipe baru di satu tempat saja berarti field-nya tampil di
            form dua kolom lalu hilang begitu ada yang memberinya
            `layout="full"` — dan gagalnya diam.
          -->
          <MTimeField
            v-else-if="item.type === 'time'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :hint="item.hint"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MDateTimeField
            v-else-if="item.type === 'datetime'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :hint="item.hint"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MInputField
            v-else-if="item.type === 'url'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MFileField
            v-else-if="item.type === 'file'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :hint="item.hint"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            :accept="item.accept"
            :multiple="item.multiple"
            :max-size-mb="
              item.maxSizeMb
                ?? item.max_size_mb
            "
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MImageField
            v-else-if="item.type === 'image'"
            :model-value="modelValue[item.key]"
            :label="fieldLabel(item)"
            :hint="item.hint"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            :multiple="item.multiple"
            :max-size-mb="
              item.maxSizeMb
                ?? item.max_size_mb
            "
            @update:model-value="
              update(item.key, $event)
            "
          />
        </slot>
      </div>
    </template>
  </div>

  <div class="mt-4 space-y-3">
    <template
      v-for="item in footerFields()"
      :key="item.key"
    >
      <div
        :class="fieldColClass(item)"
        :data-field-key="item.key"
      >
        <slot
          :name="`field-${item.key}`"
          :field="item"
          :model="modelValue"
          :error="fieldError(item.key)"
          :update="(value: any) => update(item.key, value)"
        >
          <component
            :is="item.component"
            v-if="
              item.type === 'custom'
                && item.component
            "
            v-bind="item.props ?? {}"
            :model-value="modelValue[item.key]"
            :disabled="
              disabled
                || item.disabled
            "
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MSwitchField
            v-else-if="item.type === 'switch'"
            :model-value="
              Boolean(
                modelValue[item.key],
              )
            "
            :label="fieldLabel(item)"
            :disabled="
              disabled
                || item.disabled
            "
            :error="fieldError(item.key)"
            :hint="item.hint"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MCheckboxField
            v-else-if="item.type === 'checkbox'"
            :model-value="
              Boolean(
                modelValue[item.key],
              )
            "
            :label="fieldLabel(item)"
            :disabled="
              disabled
                || item.disabled
            "
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />
          </slot>
        </div>
      </template>
    </div>

    <!--
      Menempel di bawah, bukan di atas form.

      Form Employee panjangnya empat puluh kolom: banner di kepala sudah
      keluar layar sebelum orangnya sempat menekan Save, dan pesan yang
      tidak terlihat sama saja dengan tidak ada. Yang di bawah terlihat
      di posisi gulir mana pun.

      Sengaja **tidak** toast: pesan penolakan hak akses satu-satunya
      yang bisa ditindaklanjuti ("hubungi administrator"), dan toast
      hilang dalam empat detik.
    -->
    <div
      v-if="nonFieldErrors.length"
      class="sticky bottom-0 z-10 mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 backdrop-blur"
    >
      <p
        v-for="(message, index) in nonFieldErrors"
        :key="index"
        class="text-sm font-medium text-destructive"
      >
        {{ message }}
      </p>
    </div>
  </div>
</template>
