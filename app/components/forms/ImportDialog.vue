<script setup lang="ts">
import { ref, computed, onBeforeUnmount, watch } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useApi } from '@/composables/useApi'

const rowsPage = ref(1)
const rowsPageSize = ref(50)
const rowsTotal = ref(0)

const rowsHasMore = computed(() => rows.value.length < rowsTotal.value)

type ImportJob = {
  id: number
  module: string
  status: 'pending' | 'running' | 'success' | 'failed'
  message: string | null
  total_rows: number
  success_rows: number
  failed_rows: number
  progress: number
  created_at: string
  started_at: string | null
  finished_at: string | null
}

type ImportJobRow = {
  id: number
  row_number: number
  status: 'success' | 'failed'
  payload: Record<string, any>
  error: string | null
}

const props = defineProps<{
  open: boolean
  title?: string
  importUrl: string
  templateUrl?: string
  jobDetailUrl: (jobId: number) => string
  jobRowsUrl: (jobId: number) => string
  moduleKey?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'completed', job: ImportJob): void
}>()

const { request } = useApi()

const file = ref<File | null>(null)
const uploading = ref(false)

const jobId = ref<number | null>(null)
const job = ref<ImportJob | null>(null)
const rows = ref<ImportJobRow[]>([])
const rowsLoading = ref(false)

const pollTimer = ref<any>(null)

const isDone = computed(() => job.value?.status === 'success' || job.value?.status === 'failed')

// ----- Better file UI -----
const fileInputRef = ref<HTMLInputElement | null>(null)

const fileName = computed(() => file.value?.name ?? '')
const fileSize = computed(() => {
  if (!file.value) return ''
  const mb = file.value.size / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(2)} MB`
  const kb = file.value.size / 1024
  return `${kb.toFixed(0)} KB`
})

function pickFile() {
  fileInputRef.value?.click()
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  file.value = target.files?.[0] ?? null
}

function clearFile() {
  file.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  const f = e.dataTransfer?.files?.[0] ?? null
  if (f) file.value = f
}
function onDragOver(e: DragEvent) {
  e.preventDefault()
}

// ----- Core logic -----
function resetState() {
  clearFile()
  uploading.value = false
  jobId.value = null
  job.value = null
  rows.value = []
  rowsLoading.value = false
  rowsPage.value = 1
  rowsTotal.value = 0
  stopPolling()
}

function stopPolling() {
  if (pollTimer.value) {
    clearInterval(pollTimer.value)
    pollTimer.value = null
  }
}

async function downloadTemplate() {
  if (!props.templateUrl) return
  window.open(props.templateUrl, '_blank')
}

async function startImport() {
  if (!file.value) return

  uploading.value = true
  try {
    const form = new FormData()
    form.append('file', file.value)

    const res: any = await request(props.importUrl, {
      method: 'POST',
      body: form,
    })

    const newJobId = res?.job_id
    if (!newJobId) throw new Error('job_id not returned from API')

    jobId.value = newJobId
    await fetchJob()
    startPolling()
  } finally {
    uploading.value = false
  }
}

async function fetchJob() {
  if (!jobId.value) return
  const res: any = await request(props.jobDetailUrl(jobId.value), { method: 'GET' })
  job.value = res as ImportJob

  if (isDone.value && job.value) {
    stopPolling()
    emit('completed', job.value)
  }
}

function startPolling() {
  stopPolling()
  pollTimer.value = setInterval(() => {
    fetchJob().catch(() => { })
  }, 1200)
}


async function loadFailedRows(reset = true) {
  if (!jobId.value) return

  if (reset) {
    rows.value = []
    rowsPage.value = 1
    rowsTotal.value = 0
  }

  rowsLoading.value = true
  try {
    const res: any = await request(props.jobRowsUrl(jobId.value), {
      method: 'GET',
      query: {
        status: 'failed',
        page: rowsPage.value,
        page_size: rowsPageSize.value,
      },
    })

    const items = res?.results ?? (Array.isArray(res) ? res : [])
    const count = res?.count ?? items.length

    rowsTotal.value = count
    rows.value = reset ? items : [...rows.value, ...items]
  } finally {
    rowsLoading.value = false
  }
}

function loadMoreRows() {
  if (!rowsHasMore.value || rowsLoading.value) return
  rowsPage.value += 1
  loadFailedRows(false)
}

function previewPayload(payload: Record<string, any>) {
  if (!payload) return []

  const entries = Object.entries(payload)
  return entries.slice(0, 2) // ambil 2 field pertama saja
}
watch(
  () => props.open,
  (v) => {
    if (!v) resetState()
  }
)

onBeforeUnmount(() => stopPolling())

function close() {
  emit('update:open', false)
}
</script>

<template>

  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-3xl" @interact-outside.prevent @escape-key-down.prevent>
      <DialogHeader>
        <DialogTitle>{{ title ?? 'Import Data' }}</DialogTitle>
        <p class="text-sm text-muted-foreground">
          {{ moduleKey ? `Module: ${moduleKey}` : 'Upload file CSV/XLSX sesuai template.' }}
        </p>
      </DialogHeader>

      <!-- STEP 1: Upload -->
      <div v-if="!jobId" class="space-y-4">
        <!-- Hidden native input -->
        <input ref="fileInputRef" type="file" class="hidden" accept=".csv,.xlsx,.xls" @change="onFileChange" />

        <!-- Dropzone -->
        <div class="rounded-lg border border-dashed p-6 transition hover:bg-muted/40 cursor-pointer" @click="pickFile"
          @drop="onDrop" @dragover="onDragOver">

          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

            <!-- File Info -->
            <div class="space-y-1 min-w-0">
              <div class="text-sm font-medium">
                {{ file ? 'File selected' : 'Upload file' }}
              </div>

              <div class="text-sm text-muted-foreground truncate">
                <template v-if="file">
                  {{ fileName }} • {{ fileSize }}
                </template>
                <template v-else>
                  Click to choose or drag & drop (CSV/XLSX)
                </template>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex gap-2 flex-wrap sm:flex-nowrap">
              <Button variant="outline" type="button" class="w-full sm:w-auto" @click.stop="pickFile">
                Choose File
              </Button>

              <Button v-if="file" variant="ghost" type="button" class="w-full sm:w-auto" @click.stop="clearFile">
                Remove
              </Button>
            </div>

          </div>
        </div>

        <div class="flex items-center justify-between">
          <Button v-if="templateUrl" variant="outline" type="button" @click="downloadTemplate">
            Template
          </Button>

          <Button :disabled="!file || uploading" @click="startImport">
            {{ uploading ? 'Uploading...' : 'Start Import' }}
          </Button>
        </div>
      </div>

      <!-- STEP 2: Monitor -->
      <div v-else class="space-y-4">
        <div class="rounded-lg border p-4 space-y-2">
          <div class="flex items-center justify-between">
            <div class="text-sm">
              <div class="font-medium">Job #{{ jobId }}</div>
              <div class="text-muted-foreground">Status: {{ job?.status ?? '-' }}</div>
            </div>
            <div class="text-sm text-right">
              <div>Progress: {{ job?.progress ?? 0 }}%</div>
              <div class="text-muted-foreground">
                {{ job?.success_rows ?? 0 }} ok • {{ job?.failed_rows ?? 0 }} failed • {{ job?.total_rows ?? 0 }} total
              </div>
            </div>
          </div>

          <Progress :value="job?.progress ?? 0" />

          <div v-if="job?.message" class="text-sm text-red-600">
            {{ job.message }}
          </div>
        </div>

        <div class="flex items-center justify-between">
          <Button variant="outline" :disabled="rowsLoading || (job?.failed_rows ?? 0) === 0" @click="loadFailedRows">
            {{ rowsLoading ? 'Loading...' : 'View Error Rows' }}
          </Button>

          <div class="flex gap-2">
            <Button variant="outline" @click="fetchJob">Refresh</Button>
            <!-- <Button @click="close">Close</Button> -->
            <Button :disabled="uploading || job?.status === 'running'" @click="close">Close</Button>
          </div>
        </div>

        <!-- Error table -->
        <div v-if="rows.length" class="space-y-2">

          <!-- Scrollable Table -->
          <div class="rounded-lg border overflow-auto max-h-[320px]">
            <table class="w-full text-sm">
              <thead class="sticky top-0 bg-background border-b">
                <tr>
                  <th class="text-left p-2 w-[90px]">Row</th>
                  <th class="text-left p-2">Error</th>
                  <th class="text-left p-2">Payload</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in rows" :key="r.id" class="border-b last:border-b-0">
                  <td class="p-2">#{{ r.row_number }}</td>
                  <td class="p-2 text-red-600">{{ r.error }}</td>
                  <!-- <td class="p-2">
                    <div
                    v-for="([key, value], idx) in previewPayload(r.payload)"
                    :key="idx"
                    class="text-[11px] leading-tight text-muted-foreground truncate" >
                    <span class="font-medium text-foreground">{{ key }}:</span>
                    {{ value }}
                    </div>
                </td> -->
                  <td class="p-2">
                    <pre class="text-xs whitespace-pre-wrap">{{ r.payload }}</pre>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Footer (di luar scroll area) -->
          <div class="flex items-center justify-between px-1">
            <div class="text-xs text-muted-foreground">
              Showing {{ rows.length }} of {{ rowsTotal || rows.length }} failed rows
            </div>
            <Button v-if="rowsHasMore" variant="outline" size="sm" :disabled="rowsLoading" @click="loadMoreRows">
              {{ rowsLoading ? 'Loading...' : 'Load more' }}
            </Button>
          </div>

        </div>
        <div v-if="isDone && (job?.failed_rows ?? 0) === 0" class="text-sm text-green-600">
          Import selesai tanpa error
        </div>


      </div>

      <DialogFooter />
    </DialogContent>
  </Dialog>
</template>
