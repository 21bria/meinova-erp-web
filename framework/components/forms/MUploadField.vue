<script setup lang="ts">
import {
  computed,
  ref,
  watch,
} from "vue"

import {
  Download,
  Eye,
  Loader2,
  RotateCcw,
  Trash2,
  UploadCloud,
} from "lucide-vue-next"

import { Button } from "@/components/ui/button"


import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"
import MFieldLabel from "./MFieldLabel.vue"

import { useApi } from "@/composables/useApi"

import {
  browserFileEnv,
  downloadAuthedFile,
  previewAuthedFile,
} from "../../core/utils/authedFile"

import MUploadPreview from "./MUploadPreview.vue"

const api = useApi()

type UploadId = number

type UploadedFileDetail = {
  id?: number
  public_id?: string
  original_name?: string
  stored_name?: string
  extension?: string
  mime_type?: string
  file_type?: string
  size?: number
  size_display?: string
  thumbnail_url?: string | null
  file_url?: string | null
  preview_url?: string | null
  download_url?: string | null
}

type UploadResponse = UploadedFileDetail & {
  success?: boolean
  data?: UploadedFileDetail
}

const props = withDefaults(
  defineProps<{
    modelValue?:
      | UploadId
      | UploadId[]
      | null

    detail?:
      | UploadedFileDetail
      | UploadedFileDetail[]
      | null

    label?: string
    hint?: string | null
    error?: string | null

    required?: boolean
    disabled?: boolean

    accept?: string | string[]
    multiple?: boolean
    maxSizeMb?: number

    category?: string
    publicFile?: boolean

    preview?: boolean
    download?: boolean
    replace?: boolean
    deleteFile?: boolean

    uploadEndpoint?: string
    imageMode?: boolean
  }>(),
  {
    modelValue: null,
    detail: null,

    label: "",
    hint: null,
    error: null,

    required: false,
    disabled: false,

    accept: "",
    multiple: false,
    maxSizeMb: undefined,

    category: "attachment",
    publicFile: false,

    preview: true,
    download: true,
    replace: true,
    deleteFile: true,

    uploadEndpoint: "/api/uploads/",
    imageMode: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [
    value:
      | UploadId
      | UploadId[]
      | null,
  ]

  "update:detail": [
    value:
      | UploadedFileDetail
      | UploadedFileDetail[]
      | null,
  ]

  uploaded: [
    value:
      | UploadedFileDetail
      | UploadedFileDetail[],
  ]

  removed: []

  error: [
    message: string,
  ]
}>()

const inputRef =
  ref<HTMLInputElement | null>(
    null,
  )

const dragging = ref(false)
const uploading = ref(false)
const progress = ref(0)

const localError =
  ref<string | null>(null)

const localDetail =
  ref<
    | UploadedFileDetail
    | UploadedFileDetail[]
    | null
  >(
    props.detail,
  )

watch(
  () => props.detail,
  value => {
    localDetail.value = value
  },
  {
    deep: true,
  },
)

const displayError = computed(() => {
  return (
    localError.value
    ?? props.error
    ?? null
  )
})

const acceptValue = computed(() => {
  if (!Array.isArray(props.accept))
    return props.accept

  return props.accept
    .map((item) => {
      const value =
        String(item).trim()

      if (!value)
        return ""

      if (
        value.startsWith(".")
        || value.includes("/")
      ) {
        return value
      }

      return `.${value}`
    })
    .filter(Boolean)
    .join(",")
})

const detailList = computed(() => {
  if (!localDetail.value)
    return []

  return Array.isArray(
    localDetail.value,
  )
    ? localDetail.value
    : [localDetail.value]
})

const hasFiles = computed(() => {
  return detailList.value.length > 0
})

function openPicker() {
  if (
    props.disabled
    || uploading.value
  ) {
    return
  }

  inputRef.value?.click()
}

function validateFiles(
  files: File[],
): string | null {
  if (!files.length)
    return "No file selected."

  if (
    !props.multiple
    && files.length > 1
  ) {
    return "Only one file can be uploaded."
  }

  if (!props.maxSizeMb)
    return null

  const maxBytes =
    props.maxSizeMb
    * 1024
    * 1024

  const invalidFile = files.find(
    file => file.size > maxBytes,
  )

  if (!invalidFile)
    return null

  return (
    `${invalidFile.name} exceeds `
    + `${props.maxSizeMb} MB.`
  )
}

function normalizeResponse(
  response: UploadResponse,
): UploadedFileDetail {
  if (
    response.data
    && typeof response.data === "object"
  ) {
    return response.data
  }

  return response
}

function buildMetadata() {
  return {
    category: props.category,
    is_public: props.publicFile,
  }
}

function extractApiError(
  error: any,
): string {
  const data =
    error?.data
    ?? error?.response?._data
    ?? error?.response?.data

  const fieldErrors =
    data?.errors

  if (
    fieldErrors
    && typeof fieldErrors === "object"
  ) {
    const firstError =
      Object.values(fieldErrors)[0]

    if (Array.isArray(firstError)) {
      return String(
        firstError[0]
        ?? "File upload failed.",
      )
    }

    if (firstError) {
      return String(firstError)
    }
  }

  return (
    data?.message
    ?? data?.detail
    ?? error?.statusMessage
    ?? error?.message
    ?? "File upload failed."
  )
}

async function uploadFile(
  file: File,
): Promise<UploadedFileDetail> {
  const formData = new FormData()

  formData.append(
    "file",
    file,
    file.name,
  )

  formData.append(
    "metadata",
    JSON.stringify(
      buildMetadata(),
    ),
  )

  const response =
    await api.request<UploadResponse>(
      props.uploadEndpoint,
      {
        method: "POST",
        body: formData,
      },
    )

  const uploadedFile =
    normalizeResponse(response)

  if (
    typeof uploadedFile.id
    !== "number"
  ) {
    throw new Error(
      "Upload response does not contain a file ID.",
    )
  }

  return uploadedFile
}

async function uploadFiles(
  files: File[],
) {
  localError.value = null
  progress.value = 0

  const validationError =
    validateFiles(files)

  if (validationError) {
    localError.value =
      validationError

    emit(
      "error",
      validationError,
    )

    return
  }

  uploading.value = true
  progress.value = 10

  try {
    const uploadedFiles =
      await Promise.all(
        files.map(file =>
          uploadFile(file),
        ),
      )

    progress.value = 100

    if (props.multiple) {
      const ids = uploadedFiles.map(
        item => item.id as number,
      )

      localDetail.value =
        uploadedFiles

      emit(
        "update:modelValue",
        ids,
      )

      emit(
        "update:detail",
        uploadedFiles,
      )

      emit(
        "uploaded",
        uploadedFiles,
      )

      return
    }

    const uploadedFile =
      uploadedFiles[0]

    if (!uploadedFile) {
      throw new Error(
        "Upload response is empty.",
      )
    }

    localDetail.value =
      uploadedFile

    emit(
      "update:modelValue",
      uploadedFile.id as number,
    )

    emit(
      "update:detail",
      uploadedFile,
    )

    emit(
      "uploaded",
      uploadedFile,
    )
  }
  catch (error: any) {
    const message =
      extractApiError(error)

    localError.value =
      message

    emit(
      "error",
      message,
    )
  }
  finally {
    uploading.value = false

    if (inputRef.value) {
      inputRef.value.value = ""
    }
  }
}

function handleChange(
  event: Event,
) {
  const input =
    event.target as HTMLInputElement

  const files = input.files
    ? Array.from(input.files)
    : []

  if (!files.length)
    return

  void uploadFiles(files)
}

function handleDrop(
  event: DragEvent,
) {
  dragging.value = false

  if (
    props.disabled
    || uploading.value
  ) {
    return
  }

  const files =
    event.dataTransfer?.files
      ? Array.from(
          event.dataTransfer.files,
        )
      : []

  if (!files.length)
    return

  void uploadFiles(files)
}

async function deleteUploadedFile(
  detail: UploadedFileDetail,
) {
  if (!detail.public_id)
    return

  const baseEndpoint =
    props.uploadEndpoint.endsWith("/")
      ? props.uploadEndpoint
      : `${props.uploadEndpoint}/`

  const endpoint =
    `${baseEndpoint}${detail.public_id}/purge/`

  await api.request(
    endpoint,
    {
      method: "DELETE",
    },
  )
}

async function removeFile(
  index: number,
) {
  if (
    props.disabled
    || uploading.value
  ) {
    return
  }

  const detail =
    detailList.value[index]

  if (!detail)
    return

  localError.value = null
  uploading.value = true

  try {
    await deleteUploadedFile(
      detail,
    )

    if (props.multiple) {
      const nextDetails =
        detailList.value.filter(
          (
            _item,
            itemIndex,
          ) => itemIndex !== index,
        )

      const nextIds =
        nextDetails
          .map(item => item.id)
          .filter(
            (
              id,
            ): id is number =>
              typeof id === "number",
          )

      localDetail.value =
        nextDetails

      emit(
        "update:modelValue",
        nextIds,
      )

      emit(
        "update:detail",
        nextDetails,
      )

      return
    }

    localDetail.value = null

    emit(
      "update:modelValue",
      null,
    )

    emit(
      "update:detail",
      null,
    )

    emit("removed")
  }
  catch (error: any) {
    const message =
      extractApiError(error)

    localError.value =
      message

    emit(
      "error",
      message,
    )
  }
  finally {
    uploading.value = false
  }
}

const fileEnv = browserFileEnv(
  path => api.request<Blob>(path, { responseType: "blob" }),
)

/*
 * Pratinjau per baris. Gambar dibuka **di dalam aplikasi**
 * (`MImagePreviewDialog` milik `MUploadPreview`) memakai object URL
 * yang sudah diambil thumbnail-nya — tanpa unduhan kedua, tanpa
 * meninggalkan formulir yang sedang diisi.
 */
const previewRefs = new Map<number, any>()

function setPreviewRef(index: number, el: any) {
  if (el)
    previewRefs.set(index, el)
  else
    previewRefs.delete(index)
}

async function openPreview(
  detail: UploadedFileDetail,
  index: number,
) {
  const preview = previewRefs.get(index)

  if (preview?.previewable) {
    preview.open()

    return
  }

  // Bukan gambar: jalur lama, tetap bertoken — PDF dan dokumen dibuka
  // peramban, bukan dipaksa masuk penampil gambar.
  if (!detail.preview_url)
    return

  localError.value = null

  if (!await previewAuthedFile(detail.preview_url, fileEnv))
    localError.value = "File preview could not be opened."
}

async function downloadFile(
  detail: UploadedFileDetail,
) {
  if (!detail.download_url)
    return

  localError.value = null

  const ok = await downloadAuthedFile(
    detail.download_url,
    detail.original_name ?? "download",
    fileEnv,
  )

  if (!ok)
    localError.value = "File could not be downloaded."
}

function replaceFile() {
  if (!props.replace)
    return

  openPicker()
}
</script>

<template>
  <div class="grid gap-2">
    <MFieldLabel
      :label="props.label"
      :required="props.required"
    />

    <input
      ref="inputRef"
      type="file"
      class="hidden"
      :accept="acceptValue"
      :multiple="props.multiple"
      :disabled="
        props.disabled
        || uploading
      "
      @change="handleChange"
    >

    <div
      class="
        rounded-lg border border-dashed p-4
        transition-colors
      "
      :class="{
        'border-primary bg-primary/5':
          dragging,
        'cursor-not-allowed opacity-60':
          props.disabled,
        'cursor-pointer hover:bg-muted/40':
          !props.disabled,
      }"
      @click="openPicker"
      @dragenter.prevent="
        dragging = true
      "
      @dragover.prevent="
        dragging = true
      "
      @dragleave.prevent="
        dragging = false
      "
      @drop.prevent="handleDrop"
    >
      <div
        class="
          flex flex-col items-center
          justify-center gap-2 py-4
          text-center
        "
      >
        <Loader2
          v-if="uploading"
          class="
            size-8 animate-spin
            text-primary
          "
        />

        <UploadCloud
          v-else
          class="
            size-8
            text-muted-foreground
          "
        />

        <div>
          <div class="text-sm font-medium">
            {{
              uploading
                ? "Uploading file..."
                : "Drop files here or click to browse"
            }}
          </div>

          <div
            class="
              mt-1 text-xs
              text-muted-foreground
            "
          >
            <span v-if="acceptValue">
              {{ acceptValue }}
            </span>

            <span
              v-if="
                acceptValue
                && maxSizeMb
              "
            >
              ·
            </span>

            <span v-if="maxSizeMb">
              Max {{ maxSizeMb }} MB
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="uploading"
        class="mt-3 space-y-1"
      >
        <div
          class="
            flex items-center
            justify-between text-xs
            text-muted-foreground
          "
        >
          <span>Uploading</span>
          <span>{{ progress }}%</span>
        </div>

        <div
          class="
            h-2 overflow-hidden
            rounded-full bg-muted
          "
        >
          <div
            class="
              h-full bg-primary
              transition-all duration-200
            "
            :style="{
              width: `${progress}%`,
            }"
          />
        </div>
      </div>
    </div>

    <div
      v-if="hasFiles"
      class="space-y-2"
    >
      <div
        v-for="
          (fileDetail, index)
          in detailList
        "
        :key="
          fileDetail.public_id
          ?? fileDetail.id
          ?? index
        "
        class="
          flex items-center gap-3
          rounded-lg border p-3
        "
      >
        <!--
        | Pratinjau lewat `preview/` yang berautentikasi — bukan
        | `thumbnail_url` (jalur `MEDIA_URL` statis). Lihat
        | `core/utils/uploadPreview.ts`. Field gambar mendapat kotak yang
        | cukup besar untuk benar-benar mengenali fotonya.
        -->
        <MUploadPreview
          :ref="el => setPreviewRef(index, el)"
          :detail="fileDetail"
          :image-mode="imageMode"
          :size="
            imageMode
              ? 'size-20 rounded-lg'
              : 'size-10 rounded-md'
          "
          @download="downloadFile(fileDetail)"
        />

        <div class="min-w-0 flex-1">
          <div
            class="
              truncate text-sm
              font-medium
            "
          >
            {{
              fileDetail.original_name
              ?? "Uploaded file"
            }}
          </div>

          <div
            class="
              text-xs
              text-muted-foreground
            "
          >
            {{
              fileDetail.size_display
              ?? fileDetail.mime_type
              ?? ""
            }}
          </div>
        </div>

        <div
          class="
            flex shrink-0
            items-center gap-1
          "
          @click.stop
        >
          <!--
          | Bukan `<a href>`: `preview/` dan `download/` menuntut token,
          | dan tautan biasa tidak membawanya (tab barunya 401). Lihat
          | `core/utils/authedFile.ts`.
          -->
          <Button
            v-if="
              preview
              && fileDetail.preview_url
            "
            type="button"
            variant="ghost"
            size="icon"
            title="Preview"
            @click="openPreview(fileDetail, index)"
          >
            <Eye class="size-4" />
          </Button>

          <Button
            v-if="
              download
              && fileDetail.download_url
            "
            type="button"
            variant="ghost"
            size="icon"
            title="Download"
            @click="downloadFile(fileDetail)"
          >
            <Download class="size-4" />
          </Button>

          <Button
            v-if="
              replace
              && !multiple
            "
            type="button"
            variant="ghost"
            size="icon"
            title="Replace"
            :disabled="
              disabled
              || uploading
            "
            @click="replaceFile"
          >
            <RotateCcw class="size-4" />
          </Button>

          <Button
            v-if="deleteFile"
            type="button"
            variant="ghost"
            size="icon"
            title="Remove"
            :disabled="
              disabled
              || uploading
            "
           @click.stop.prevent="
              removeFile(index)
            "
          >
            <Trash2 class="size-4" />
          </Button>
        </div>
      </div>
    </div>

    <MFieldHint
      :text="props.hint"
    />

    <MFieldError
      :error="displayError"
    />
  </div>
</template>