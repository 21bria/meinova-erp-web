<script setup lang="ts">
import {
  LoaderCircle,
} from "lucide-vue-next"

import MImportForm
  from "./MImportForm.vue"

import MImportReview
  from "./MImportReview.vue"

import MImportResult
  from "./MImportResult.vue"
  
import {
  useImport,
} from "../../core/composables/useImport"

import type {
  ImportConfirmResult,
  ImportSchema,
} from "../../core/types/import"

const props = defineProps<{
  schema: ImportSchema
}>()

const emit = defineEmits<{
  back: []
  imported: [
    result: ImportConfirmResult,
  ]
}>()

const state = useImport(
  props.schema,
)

type ImportStep =
  | "upload"
  | "review"
  | "processing"
  | "completed"

const step = ref<ImportStep>(
  "upload",
)

/*
|--------------------------------------------------------------------------
| Preview
|--------------------------------------------------------------------------
*/

async function handlePreview(
  page = 1,
) {
  const preview =
    await state.previewFile(
      page,
    )
  if (!preview)
    return
  step.value = "review"
}

async function handlePageSizeChange(
  pageSize: number,
) {
  state.setPreviewPageSize(
    pageSize,
  )
  await handlePreview(1)
}

/*
|--------------------------------------------------------------------------
| Navigation
|--------------------------------------------------------------------------
*/

function handleBackToUpload() {
  step.value = "upload"
}

function handleReset() {
  state.reset()
  step.value = "upload"
}

/*
|--------------------------------------------------------------------------
| Confirm
|--------------------------------------------------------------------------
*/

async function handleConfirm() {
  step.value = "processing"

  const result =
    await state.confirmImport()

  if (!result) {
    console.error(
      "Import failed:",
      state.errors.value,
      state.jobStatus.value,
    )

    return
  }

  step.value = "completed"
}

// Result
const completedResult = computed(() => {
  return state.result.value
})
function handleResultBack() {
  if (completedResult.value) {
    emit(
      "imported",
      completedResult.value,
    )
  }

  emit(
    "back",
  )
}

const processingProgress = computed(() => {
  const status =
    state.jobStatus.value

  switch (status) {
    case "queued":
    case "pending":
      return {
        percent: 20,
        label: "Queued",
        message:
          "The import is waiting for an available worker.",
      }

    case "processing":
    case "importing":
      return {
        percent: 70,
        label: "Processing",
        message:
          "The file is being validated and imported.",
      }

    case "completed":
      return {
        percent: 100,
        label: "Completed",
        message:
          "The import completed successfully.",
      }

    case "partial":
      return {
        percent: 100,
        label: "Completed with issues",
        message:
          "The valid records were imported and some rows were skipped.",
      }

    case "failed":
      return {
        percent: 100,
        label: "Failed",
        message:
          "The import could not be completed.",
      }

    case "cancelled":
      return {
        percent: 100,
        label: "Cancelled",
        message:
          "The import was cancelled.",
      }

    default:
      return {
        percent: 10,
        label: "Starting",
        message:
          "Preparing the import process.",
      }
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold">
          {{ schema.title }}
        </h1>

        <p
          v-if="schema.description"
          class="mt-1 text-sm text-muted-foreground">
          {{ schema.description }}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        :disabled="
          state.previewing.value
          || state.loadingPage.value
          || state.importing.value
          || state.polling.value
        "
        @click="emit('back')"
      >
        Back
      </Button>
    </div>

    <!-- Steps -->
    <div class="flex justify-center">
      <div
      class="
        inline-flex items-center
        rounded-full
        border
        bg-background
        px-3
        py-2
        shadow-sm
      "
    >
      <div
        class="flex items-center"
        :class="{
          'font-semibold text-primary': step === 'upload',
          'text-muted-foreground': step !== 'upload',
        }"
      >
        <div class="mr-2 flex h-7 w-7 items-center justify-center rounded-full border">
          1
        </div>
        Upload
      </div>

      <div class="mx-5 h-px w-12 bg-border"/>

      <div
        class="flex items-center"
        :class="{
          'font-semibold text-primary': step === 'review',
          'text-muted-foreground': step !== 'review',
        }"
      >
        <div class="mr-2 flex h-7 w-7 items-center justify-center rounded-full border">
          2
        </div>
        Review
      </div>

      <div class="mx-5 h-px w-12 bg-border"/>

      <div class="flex items-center"
      :class="{
        'font-semibold text-primary':
          step === 'processing'
          || step === 'completed',

        'text-muted-foreground':
          step !== 'processing'
          && step !== 'completed',
      }"
    >
      <div class="mr-2 flex h-7 w-7 items-center justify-center rounded-full border">
        3
      </div>
      {{step === "processing"? "Processing": "Completed"}}
    </div>

    </div>
    </div>

    <!-- Upload -->
    <MImportForm
      v-if="step === 'upload'"
      :schema="schema"
      :profile-id="state.profileId.value"
      :selected-profile="state.selectedProfile.value"
      :file="state.file.value"
      :errors="state.errors.value"
      :loading="state.previewing.value"
      @update:profile="state.setProfile($event)"
      @update:file="state.setFile($event)"
      @preview="handlePreview(1)"
      @reset="handleReset"
    />

    <!-- Review -->
    <MImportReview
      v-else-if="
        step === 'review'
        && state.preview.value
      "
      :preview="state.preview.value"
      :columns="schema.previewColumns ?? []"
      :importing="state.importing.value"
      :loading-page="state.loadingPage.value"
      @back="handleBackToUpload"
      @confirm="handleConfirm"
      @page-change="handlePreview"
      @page-size-change="handlePageSizeChange"
    />

    <!-- Processing -->
      <div
        v-else-if="step === 'processing'"
        class="
          rounded-xl border
          bg-background px-6 py-10
          text-center
        "
      >
        <div
          class="
            mx-auto flex h-12 w-12
            items-center justify-center
            rounded-full bg-primary/10
            text-primary
          "
        >
          <LoaderCircle class="h-6 w-6 animate-spin"/>
        </div>

        <h2 class="mt-4 text-lg font-semibold">
          Processing Import
        </h2>

        <p class="mt-1 text-sm text-muted-foreground">
          {{ processingProgress.message }}
        </p>

        <div
          class="
            mx-auto mt-6
            max-w-xl
            rounded-xl border
            bg-muted/20 p-5
            text-left
          "
        >
          <div class="flex items-center justify-between gap-4"
          >
            <div>
              <p class="text-sm font-medium">
                {{ processingProgress.label }}
              </p>

              <p class="mt-0.5 text-xs text-muted-foreground">
                Background import process
              </p>
            </div>

            <span class="text-sm font-semibold">
              {{ processingProgress.percent }}%
            </span>
          </div>

          <Progress
            class="mt-4"
            :model-value="
              processingProgress.percent
            "
          />

          <div
            class="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div class="rounded-lg bg-background px-3 py-2">
              <p
                class="text-xs text-muted-foreground">
                Status
              </p>

              <Badge class="mt-1" variant="outline">
                {{
                  state.jobStatus.value
                  || "queued"
                }}
              </Badge>
            </div>

            <div class="rounded-lg bg-background px-3 py-2">
              <p class="text-xs text-muted-foreground">
                Job ID
              </p>

              <p
                class="mt-1 truncate font-mono text-xs"
                :title="
                  state.jobPublicId.value
                  ?? ''
                "
              >
                {{
                  state.jobPublicId.value
                  ?? "Waiting..."
                }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="
            Object.keys(
              state.errors.value,
            ).length > 0
          "
          class="mx-auto mt-5 max-w-xl rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-left text-sm text-destructive"
        >
          <p class="font-medium">
            Import processing failed
          </p>

          <pre
            class="mt-2 whitespace-pre-wrap break-words text-xs"
          >{{ state.errors.value }}</pre>
        </div>
      </div>


    <div
      v-if="
        Object.keys(
          state.errors.value,
        ).length > 0
      "
      class="
        mx-auto mt-4 max-w-lg
        rounded-lg border
        border-destructive/30
        bg-destructive/5
        p-4 text-left
        text-sm text-destructive
      "
    >
      <p class="font-medium">
        Import processing failed
      </p>

      <pre
        class="mt-2 whitespace-pre-wrap text-xs"
      >{{ state.errors.value }}</pre>
    </div>

    <MImportResult
      v-else-if="
        step === 'completed'
        && completedResult
      "
      :schema="schema"
      :result="completedResult"
      @back="handleResultBack"
      @reset="handleReset"
    />
  
  </div>
</template>