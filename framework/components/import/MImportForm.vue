<script setup lang="ts">
import MLookupSelect
  from "../lookup/MLookupSelect.vue"

import type {
  ImportProfile,
  ImportSchema,
} from "../../core/types/import"

const props = defineProps<{
  schema: ImportSchema
  profileId: number | null
  selectedProfile: ImportProfile | null
  file: File | null
  errors?: Record<string, unknown>
  loading?: boolean
}>()

const emit = defineEmits<{
  "update:profile": [
    value: ImportProfile | null,
  ]
  "update:file": [
    value: File | null,
  ]
  preview: []
  reset: []
}>()

function handleFile(
  event: Event,
) {
  const target =
    event.target as HTMLInputElement

  emit(
    "update:file",
    target.files?.[0] ?? null,
  )
}

function handleProfileSelect(
  value: unknown,
) {
  if (
    value
    && typeof value === "object"
    && !Array.isArray(value)
  ) {
    emit(
      "update:profile",
      value as ImportProfile,
    )
    return
  }
  emit(
    "update:profile",
    null,
  )
}

function firstError(
  key: string,
): string | null {
  const value = props.errors?.[key]

  if (Array.isArray(value)) {
    const first = value[0]

    return first == null
      ? null
      : String(first)
  }

  if (
    value === undefined
    || value === null
  ) {
    return null
  }

  return String(value)
}

function displayValue(
  value: unknown,
  fallback = "-",
) {
  if (
    value === undefined
    || value === null
    || value === ""
  ) {
    return fallback
  }

  return String(value)
}
</script>

<template>
  <!--
  | **Jangan pasang `overflow-hidden` di kartu ini.**
  |
  | `MLookupSelect` merender daftarnya sebagai `absolute z-50` biasa,
  | tanpa Portal — jadi ia dipotong ancestor mana pun yang menyembunyikan
  | luapannya. Di sini akibatnya paling menyesatkan: panel "Profile
  | Information" hanya dirender setelah ada profil terpilih, jadi saat
  | layar pertama dibuka kartunya pendek dan dropdown-nya terpotong
  | tepat setelah **satu** baris. Yang membukanya menyimpulkan tenant
  | ini cuma punya satu profil import — padahal ketiganya dikirim API,
  | dua sisanya ada di bawah garis potong.
  |
  | Rusaknya diam, dan hilang sendiri begitu sebuah profil dipilih
  | (kartunya jadi tinggi, daftarnya kebagian ruang) — persis kombinasi
  | yang membuatnya nyaris tidak mungkin dilaporkan orang.
  |
  | Sudut membulatnya tetap rapi karena kepalanya yang mengunci sudutnya
  | sendiri lewat `rounded-t-xl`, bukan karena dipotong induknya.
  -->
  <div class="
      rounded-xl
      border bg-background
    ">
    <div class="
        border-b bg-muted/30
        rounded-t-xl
        px-6 py-5
      ">
      <h2 class="text-base font-semibold mt-2">
        Import Settings
      </h2>

      <p class=" mt-1 mb-2 text-sm
          text-muted-foreground
        ">
        Select an import profile and upload
        the file to import.
      </p>
    </div>

    <div class="space-y-6 p-6">
      <div class="
          grid gap-5
          lg:grid-cols-2
        ">
        <div class="grid gap-2">
          <Label>
            {{
              schema.profileLabel
              ?? "Import Profile"
            }}
          </Label>

            <MLookupSelect
              :model-value="profileId"
              :label="
                schema.profileLabel
                ?? 'Import Profile'
              "
              :endpoint="schema.profileEndpoint"
              value-key="value"
              label-key="label"
              variant="field"
              :selected-label="
                selectedProfile?.label
                ?? null
              "
              placeholder="Select import profile"
              @select="handleProfileSelect"
            />

          <p v-if="firstError('profile')" class="text-sm text-destructive">
            {{ firstError("profile") }}
          </p>
        </div>

        <div class="grid gap-2">
          <Label>
            {{
              schema.fileLabel
              ?? "CSV File"
            }}
          </Label>

          <Input type="file" :accept="schema.fileAccept
            ?? '.csv,text/csv'
            " @change="handleFile" />

          <p class="
              text-xs
              text-muted-foreground
            ">
            Only CSV files are accepted.
          </p>

          <p v-if="firstError('file')" class="text-sm text-destructive">
            {{ firstError("file") }}
          </p>
        </div>
      </div>

      <!--
      | `border` dan `bg-muted/20` sempat menempel jadi satu kelas
      | (`borderbg-muted/20`) yang tidak ada di Tailwind. Tailwind tidak
      | mengeluhkan kelas yang tidak dikenalnya — ia cuma tidak
      | menghasilkan apa pun, jadi panelnya kehilangan kotak dan latarnya
      | sekaligus dan terbaca seperti teks yang lupa dibungkus.
      -->
      <div v-if="selectedProfile" class="rounded-lg border bg-muted/20 p-5">
        <div class="mb-4">
          <h3 class="text-sm font-semibold">
            Profile Information
          </h3>

          <p class="mt-1 text-xs text-muted-foreground">
            File settings are controlled by
            the selected import profile.
          </p>
        </div>

        <dl class="
            grid gap-x-8 gap-y-4
            text-sm
            sm:grid-cols-2
            xl:grid-cols-3
          ">
          <div>
            <dt class="text-muted-foreground">
              Code
            </dt>

            <dd class="mt-1 font-medium">
              {{
                displayValue(
                  selectedProfile.code,
                )
              }}
            </dd>
          </div>

          <div>
            <dt class="text-muted-foreground">
              Company
            </dt>

            <dd class="mt-1 font-medium">
              {{
                displayValue(
                  selectedProfile
                    .company_label,
                  "All Companies",
                )
              }}
            </dd>
          </div>

          <div>
            <dt class="text-muted-foreground">
              Branch
            </dt>

            <dd class="mt-1 font-medium">
              {{
                displayValue(
                  selectedProfile
                    .branch_label,
                  "All Branches",
                )
              }}
            </dd>
          </div>

          <div>
            <dt class="text-muted-foreground">
              Site
            </dt>

            <dd class="mt-1 font-medium">
              {{
                displayValue(
                  selectedProfile
                    .site_label,
                  "All Sites",
                )
              }}
            </dd>
          </div>

          <div>
            <dt class="text-muted-foreground">
              Encoding
            </dt>

            <dd class="mt-1 font-medium">
              {{
                displayValue(
                  selectedProfile.encoding,
                )
              }}
            </dd>
          </div>

          <div>
            <dt class="text-muted-foreground">
              Delimiter
            </dt>

            <dd class="mt-1 font-medium">
              <code>
                {{
                  displayValue(
                    selectedProfile.delimiter,
                  )
                }}
              </code>
            </dd>
          </div>

          <div>
            <dt class="text-muted-foreground">
              Date Format
            </dt>

            <dd class="mt-1 font-medium">
              {{
                selectedProfile
                  .datetime_formats
                  ?.length
                  ? selectedProfile
                    .datetime_formats
                    .join(", ")
                  : "-"
              }}
            </dd>
          </div>
        </dl>
      </div>

      <div v-if="firstError('detail')" class="
          rounded-md border
          border-destructive/30
          bg-destructive/5
          px-4 py-3
          text-sm text-destructive
        ">
        {{ firstError("detail") }}
      </div>

      <div class="flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:justify-end py-4">
        <Button type="button" variant="outline" :disabled="loading" @click="emit('reset')">
          Reset
        </Button>

        <Button type="button" :disabled="loading
          || !profileId
          || !file
          " @click="emit('preview')">
          {{loading ? "Previewing...": "Preview"}}
        </Button>
      </div>
    </div>
  </div>
</template>