<script setup lang="ts">

import {
  computed,
} from "vue"

import {
  MFormBuilder,
} from "@framework"

import {
  candidatesForm,
} from "@/modules/hr/candidates/form"

import type {
  CandidatesWorkspaceMode,
} from "@/modules/hr/candidates/composables/useCandidatesWorkspace"

type FormMode = Exclude<
  CandidatesWorkspaceMode,
  "list"
>

const props = withDefaults(
  defineProps<{
    mode: FormMode
    tabKey: string
    fields?: string[] | null
    modelValue: Record<string, any>
    loading?: boolean
    readonly?: boolean
    disabled?: boolean
    errors?: Record<string, any> | null
  }>(),
  {
    fields: null,
    loading: false,
    readonly: false,
    disabled: false,
    errors: null,
  },
)

const emit = defineEmits<{
  "update:modelValue": [
    value: Record<string, any>,
  ]
}>()

const isReadonly = computed(() => {
  return (
    props.mode === "detail"
    || props.readonly
  )
})

const builderMode = computed<
  "create" | "edit"
>(() => {
  return props.mode === "create"
    ? "create"
    : "edit"
})

const formSchema = computed(() => {
  return Array.isArray(candidatesForm)
    ? candidatesForm
    : []
})

const configuredFields = computed(() => {
  return new Set(
    Array.isArray(props.fields)
      ? props.fields
          .map(field => String(field))
          .filter(Boolean)
      : [],
  )
})

const tabSchema = computed(() => {
  const hasConfiguredFields =
    configuredFields.value.size > 0

  return formSchema.value.filter((field) => {
    if (!field?.key)
      return false

    /*
     * Prioritas pertama memakai fields dari
     * workspace tab configuration.
     */
    if (hasConfiguredFields) {
      return configuredFields.value.has(
        String(field.key),
      )
    }

    /*
     * Fallback memakai properti tab pada form.ts.
     */
    return (
      (field.tab ?? "general")
      === props.tabKey
    )
  })
})

/*
 * Error yang **tidak menunjuk kolom mana pun** ikut diteruskan.
 *
 * `detail` / `non_field_errors` lahir dari penolakan hak akses, 404,
 * dan 500 — tidak satu pun menempel ke kolom, jadi menyaringnya ke
 * kunci milik tab ini membuang satu-satunya pesan yang ada. Akibatnya
 * 403 pada form workspace gagal tanpa satu kalimat pun: tombol Save
 * ditekan, tidak terjadi apa-apa.
 *
 * `MFormBuilder` merendernya sebagai banner yang menempel di bawah
 * form.
 */
const NON_FIELD_ERROR_KEYS = [
  "detail",
  "non_field_errors",
  "__all__",
]

const tabErrors = computed(() => {
  if (!props.errors)
    return null

  const fieldKeys = new Set(
    tabSchema.value.map(
      field => String(field.key),
    ),
  )

  return Object.fromEntries(
    Object.entries(props.errors).filter(
      ([key]) =>
        fieldKeys.has(key)
        || NON_FIELD_ERROR_KEYS.includes(key),
    ),
  )
})

const isDisabled = computed(() => {
  return (
    props.loading
    || props.disabled
    || isReadonly.value
  )
})

function updateModel(
  value: Record<string, any>,
) {
  emit(
    "update:modelValue",
    {
      ...props.modelValue,
      ...value,
    },
  )
}
</script>

<template>
  <div
    :data-workspace-tab="tabKey"
    class="space-y-6"
  >
    <MFormBuilder
      :model-value="modelValue"
      :schema="tabSchema"
      :errors="tabErrors"
      :mode="builderMode"
      :disabled="isDisabled"
      @update:model-value="updateModel"
    />

    <div
      v-if="tabSchema.length === 0"
      class="
        flex min-h-40 items-center
        justify-center rounded-md
        border border-dashed
      "
    >
      <p class="text-sm text-muted-foreground">
        No form fields configured for this section.
      </p>
    </div>
  </div>
</template>