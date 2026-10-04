<script setup lang="ts">
import { computed } from "vue"

import type {
  SettingField,
  SettingSection,
} from "../../core/types/setting"
import { createForm } from "../../builders/forms"
import type { FormField } from "../../builders/forms"

const props = defineProps<{
  section: SettingSection
  fields: Record<string, SettingField>
  modelValue: Record<string, unknown>
  errors?: Record<string, string[]>
}>()

const emit = defineEmits<{
  (
    event: "update:modelValue",
    value: Record<string, unknown>,
  ): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value),
})

/**
 * Tipe dari schema backend → tipe yang benar-benar dirender form.
 *
 * `MFormBuilder` hanya mengenal 13 tipe; sisanya jatuh ke `v-if` yang
 * tidak ada cabangnya, dan **fieldnya hilang tanpa error** — kotak
 * seksinya tetap tergambar, jadi hasilnya terbaca seperti setelan yang
 * memang belum ada isinya.
 *
 * `integer`/`decimal` dan `boolean` datang apa adanya dari introspeksi
 * model Django (`PositiveSmallIntegerField`, `BooleanField`), jadi
 * pemetaannya harus di sini — bukan dengan meminta backend menyebut
 * nama tipe milik komponen frontend.
 */
function resolveFormFieldType(
  type: SettingField["type"],
): FormField["type"] {
  switch (type) {
    case "integer":
    case "decimal":
      return "number"

    case "boolean":
      return "switch"

    case "url":
    case "tel":
    case "color":
    case "time":
      return "text"

    case "datetime":
      return "date"

    default:
      return type
  }
}

/**
 * Field satu seksi, dari nama atau dari objeknya langsung.
 *
 * `name` disuntikkan saat dilihat lewat nama, karena `fields` di schema
 * hasil introspeksi backend adalah **peta ber-key nama** dan isinya
 * tidak mengulang namanya. Tanpa ini `key: field.name` di bawah bernilai
 * undefined, dan seluruh field seksi ini hilang dari layar — kotak
 * seksinya tetap tergambar lengkap dengan judulnya, jadi hasilnya
 * terbaca seperti setelan yang memang belum ada isinya.
 */
const sectionFields = computed<SettingField[]>(() => {
  return props.section.fields
    .map((item) => {
      if (typeof item === "string") {
        const found = props.fields[item]

        return found
          ? { ...found, name: found.name ?? item }
          : undefined
      }

      return item
    })
    .filter((item): item is SettingField => Boolean(item))
})

const formSchema = computed(() => {
  const fields: FormField[] = sectionFields.value.map(field => ({
    ...field,
    key: field.name,
    type: resolveFormFieldType(field.type),
  }))

  return createForm(fields, {
    columns: props.section.columns ?? 2,
  })
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base">
        {{ section.title }}
      </CardTitle>

      <CardDescription v-if="section.description">
        {{ section.description }}
      </CardDescription>
    </CardHeader>

    <CardContent>
      <MFormBuilder
        v-model="model"
        :schema="formSchema"
        :errors="errors"
      />
    </CardContent>
  </Card>
</template>