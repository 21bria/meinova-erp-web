<script setup lang="ts">
import {
  CheckCircle2,
  CirclePlus,
  CircleX,
  CopyCheck,
  Download,
  RefreshCw,
  SkipForward,
} from "lucide-vue-next"

import {
  useApi,
} from "@/composables/useApi"

import type {
  ImportConfirmResult,
  ImportSchema,
} from "../../core/types/import"

const props = defineProps<{
  schema: ImportSchema
  result: ImportConfirmResult
}>()

const emit = defineEmits<{
  back: []
  reset: []
}>()

const {
  request,
} = useApi()

const downloadingErrors = ref(
  false,
)

const canDownloadErrors = computed(() => {
  return Boolean(
    props.result.jobPublicId
    && props.schema.errorReportEndpoint
    && (
      (
        props.result.errorCount
        ?? 0
      ) > 0
      || props.result.invalidRows > 0
      || props.result.failedRows > 0
    ),
  )
})

const resultStatus = computed(() => {
  return (
    props.result.jobStatus
    ?? (
      props.result.failedRows > 0
        ? "partial"
        : "completed"
    )
  )
})

const formattedDuration = computed(() => {
  const duration =
    props.result.duration

  if (
    duration === undefined
    || duration === null
  ) {
    return null
  }

  if (duration < 1) {
    return `${Math.round(
      duration * 1000,
    )} ms`
  }

  return `${duration.toFixed(2)} sec`
})

function buildErrorReportEndpoint() {
  if (
    !props.result.jobPublicId
    || !props.schema.errorReportEndpoint
  ) {
    return null
  }

  return (
    props.schema.errorReportEndpoint
      .replace(
        "{jobPublicId}",
        encodeURIComponent(
          props.result.jobPublicId,
        ),
      )
  )
}

async function downloadErrorReport() {
  const endpoint =
    buildErrorReportEndpoint()

  if (
    !endpoint
    || downloadingErrors.value
  ) {
    return
  }

  downloadingErrors.value = true

  try {
    const blob = await request<Blob>(
      endpoint,
      {
        method: "GET",
        responseType: "blob",
      },
    )

    const objectUrl =
      URL.createObjectURL(
        blob,
      )

    const anchor =
      document.createElement(
        "a",
      )

    anchor.href = objectUrl

    anchor.download = (
      `import-errors-`
      + `${props.result.jobPublicId}.csv`
    )

    document.body.appendChild(
      anchor,
    )

    anchor.click()
    anchor.remove()

    URL.revokeObjectURL(
      objectUrl,
    )
  }
  finally {
    downloadingErrors.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div
      class="
        rounded-xl border
        bg-background p-7
        text-center
      "
    >
      <div
        class="
          mx-auto flex h-12 w-12
          items-center justify-center
          rounded-full bg-emerald-100
          text-emerald-700
          dark:bg-emerald-950/50
          dark:text-emerald-400
        "
      >
        <CheckCircle2
          class="h-6 w-6"
        />
      </div>

      <h2
        class="
          mt-4 text-lg
          font-semibold
        "
      >
        {{
          schema.completedTitle
          ?? "Import Completed"
        }}
      </h2>

      <p
        class="
          mt-1 text-sm
          text-muted-foreground
        "
      >
        {{
          schema.completedDescription
          ?? "Your import has been processed."
        }}
      </p>

      <div
        class="
          mt-4 flex flex-wrap
          items-center
          justify-center gap-2
        "
      >
        <Badge variant="outline">
          Status:
          {{ resultStatus }}
        </Badge>

        <Badge
          v-if="formattedDuration"
          variant="secondary"
        >
          Duration:
          {{ formattedDuration }}
        </Badge>

        <Badge
          v-if="result.jobPublicId"
          variant="secondary"
          class="
            max-w-[300px]
            truncate font-mono
          "
          :title="result.jobPublicId"
        >
          Job:
          {{ result.jobPublicId }}
        </Badge>
      </div>
    </div>

    <div
      class="
        grid gap-3
        sm:grid-cols-2
        xl:grid-cols-5
      "
    >
      <Card>
        <CardContent
          class="
            flex items-center
            gap-3 p-4
          "
        >
          <CirclePlus
            class="
              h-5 w-5
              text-emerald-600
            "
          />

          <div>
            <p
              class="
                text-xs
                text-muted-foreground
              "
            >
              Created
            </p>

            <p class="text-xl font-semibold">
              {{ result.createdRows ?? 0 }}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent
          class="
            flex items-center
            gap-3 p-4
          "
        >
          <RefreshCw
            class="
              h-5 w-5
              text-blue-600
            "
          />

          <div>
            <p
              class="
                text-xs
                text-muted-foreground
              "
            >
              Updated
            </p>

            <p class="text-xl font-semibold">
              {{ result.updatedRows ?? 0 }}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent
          class="
            flex items-center
            gap-3 p-4
          "
        >
          <CopyCheck
            class="
              h-5 w-5
              text-amber-600
            "
          />

          <div>
            <p
              class="
                text-xs
                text-muted-foreground
              "
            >
              Duplicate
            </p>

            <p class="text-xl font-semibold">
              {{ result.duplicateRows ?? 0 }}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent
          class="
            flex items-center
            gap-3 p-4
          "
        >
          <SkipForward
            class="
              h-5 w-5
              text-muted-foreground
            "
          />

          <div>
            <p
              class="
                text-xs
                text-muted-foreground
              "
            >
              Skipped
            </p>

            <p class="text-xl font-semibold">
              {{ result.skippedRows ?? 0 }}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent
          class="
            flex items-center
            gap-3 p-4
          "
        >
          <CircleX
            class="
              h-5 w-5
              text-destructive
            "
          />

          <div>
            <p
              class="
                text-xs
                text-muted-foreground
              "
            >
              Failed
            </p>

            <p class="text-xl font-semibold">
              {{ result.failedRows ?? 0 }}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>

    <div
      class="
        flex flex-col
        justify-center gap-2
        sm:flex-row
      "
    >
      <Button
        v-if="canDownloadErrors"
        type="button"
        variant="outline"
        :disabled="downloadingErrors"
        @click="downloadErrorReport"
      >
        <Download
          class="mr-2 h-4 w-4"
        />

        {{
          downloadingErrors
            ? "Downloading..."
            : "Download Error Report"
        }}
      </Button>

      <Button
        type="button"
        variant="outline"
        @click="emit('back')"
      >
        {{
          schema.backLabel
          ?? "Back"
        }}
      </Button>

      <Button
        type="button"
        @click="emit('reset')"
      >
        {{
          schema.importAnotherLabel
          ?? "Import Another File"
        }}
      </Button>
    </div>
  </div>
</template>