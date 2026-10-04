<script setup lang="ts">
import { CheckCircle2, Inbox, RefreshCw, Undo2, XCircle } from 'lucide-vue-next'

import LeaveRuleSummary from '@/modules/hr/leave-rules/components/LeaveRuleSummary.vue'
import WorkflowApprovalTrail from '@/modules/workflow/components/WorkflowApprovalTrail.vue'
import WorkflowDecisionDialog from '@/modules/workflow/components/WorkflowDecisionDialog.vue'
import WorkflowPagination from '@/modules/workflow/components/WorkflowPagination.vue'
import WorkflowStatusBadge from '@/modules/workflow/components/WorkflowStatusBadge.vue'
import { useWorkflowApi } from '@/modules/workflow/composables/useWorkflowApi'

definePageMeta({
  title: 'My Approvals',
})

// `reka-ui` menolak `<SelectItem value="">` — string kosong sudah
// dipakai Select untuk "tidak ada pilihan", jadi opsi yang nilainya
// kosong membuat komponennya melempar dan seluruh halaman gagal
// dirender. Karena itu "semua" memakai sentinel `ALL`, lalu
// diterjemahkan jadi string kosong tepat sebelum dikirim ke API —
// backend membaca parameter kosong sebagai "tanpa filter".
const ALL = 'all'

function param(value: string) {
  return value === ALL ? '' : value
}

const api = useWorkflowApi()
const notify = useNotify()

const rows = ref<any[]>([])
const count = ref(0)
const pending = ref(false)
const moduleFilter = ref(ALL)
const documentTypeFilter = ref(ALL)
const page = ref(1)
const pageSize = ref(20)

// Baris yang sedang dibuka jejaknya. Ditarik terpisah lewat
// `/instances/<id>/trail/`, bukan ikut di daftar: kotak masuk bisa
// berisi puluhan baris dan membawa seluruh jejak tiap dokumen membuat
// halaman ini lambat justru saat paling dibutuhkan.
const expandedId = ref<number | null>(null)
const trail = ref<any[]>([])
const trailPending = ref(false)
const trailCurrentStep = ref<string | null>(null)

const dialogOpen = ref(false)
const dialogDecision = ref<'approve' | 'reject' | 'return'>('approve')
const dialogRow = ref<any>(null)
const submitting = ref(false)

const MODULE_OPTIONS = [
  { label: 'Semua modul', value: ALL },
  { label: 'HR', value: 'hr' },
]

const DOCUMENT_OPTIONS = [
  { label: 'Semua dokumen', value: ALL },
  { label: 'Cuti', value: 'leave_request' },
  { label: 'Travel Request', value: 'travel_request' },
]

async function load() {
  pending.value = true

  try {
    const res: any = await api.getInbox({
      module: param(moduleFilter.value),
      document_type: param(documentTypeFilter.value),
      page: page.value,
      page_size: pageSize.value,
    })

    rows.value = res?.data ?? []
    count.value = res?.meta?.count ?? rows.value.length
  }
  catch (error: any) {
    notify.error(error?.data?.message ?? 'Gagal memuat kotak masuk.')
    rows.value = []
    count.value = 0
  }
  finally {
    pending.value = false
  }
}

async function toggleTrail(row: any) {
  if (expandedId.value === row.id) {
    expandedId.value = null
    return
  }

  expandedId.value = row.id
  trail.value = []
  trailCurrentStep.value = null
  trailPending.value = true

  try {
    const res: any = await api.getTrail(row.instance)

    trail.value = res?.data?.approvals ?? []
    trailCurrentStep.value = res?.data?.current_step ?? null
  }
  catch {
    notify.error('Gagal memuat jejak persetujuan.')
  }
  finally {
    trailPending.value = false
  }
}

function openDecision(row: any, decision: 'approve' | 'reject' | 'return') {
  dialogRow.value = row
  dialogDecision.value = decision
  dialogOpen.value = true
}

async function confirmDecision(comment: string) {
  if (!dialogRow.value)
    return

  submitting.value = true

  try {
    const res: any = await api.decide(
      dialogRow.value.id,
      dialogDecision.value,
      comment,
    )

    notify.success(res?.message ?? 'Keputusan tersimpan.')

    dialogOpen.value = false
    expandedId.value = null

    // Baris yang baru diputuskan hilang dari kotak masuk, jadi halaman
    // terakhir bisa jadi kosong. Mundur satu supaya tidak mendarat di
    // daftar kosong yang terlihat seperti "semuanya sudah selesai".
    const remaining = count.value - 1

    if (page.value > 1 && remaining <= (page.value - 1) * pageSize.value)
      page.value -= 1

    await load()
  }
  catch (error: any) {
    // Backend membalas pesan yang menyebut sebabnya — mis. "Baris ini
    // menunggu keputusan Budi". Menggantinya dengan pesan generik
    // membuang satu-satunya petunjuk yang berguna.
    const detail
      = error?.data?.errors?.workflow?.[0]
        ?? error?.data?.message
        ?? 'Keputusan gagal disimpan.'

    notify.error(detail)
  }
  finally {
    submitting.value = false
  }
}

function formatDate(value?: string | null) {
  if (!value)
    return '—'

  return new Date(value).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const MODULE_LABEL: Record<string, string> = {
  hr: 'HR',
  payroll: 'Payroll',
  finance: 'Finance',
  scm: 'Supply Chain',
  assets: 'Asset Management',
}

const DOCUMENT_LABEL: Record<string, string> = {
  leave_request: 'Cuti',
  travel_request: 'Travel Request',
  overtime: 'Lembur',
  asset_assignment: 'Penyerahan Aset',
  asset_return: 'Pengembalian Aset',
  asset_transfer: 'Transfer Aset',
}

function moduleLabel(row: any) {
  return MODULE_LABEL[row.module] ?? row.module
}

function documentLabel(row: any) {
  return DOCUMENT_LABEL[row.document_type] ?? row.document_type
}

watch([moduleFilter, documentTypeFilter], () => {
  page.value = 1
  load()
})

watch([page, pageSize], load)

onMounted(load)
</script>

<template>
  <main class="mx-auto max-w-6xl space-y-6 px-6 py-8">
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="flex items-center gap-2 text-2xl font-semibold">
          <Inbox class="h-6 w-6" />
          My Approvals
        </h1>

        <p class="text-muted-foreground">
          Dokumen yang menunggu keputusan Anda — dari semua modul,
          termasuk yang dikuasakan kepada Anda.
        </p>
      </div>

      <Button variant="outline" size="sm" :disabled="pending" @click="load">
        <RefreshCw class="mr-2 h-4 w-4" :class="pending ? 'animate-spin' : ''" />
        Refresh
      </Button>
    </header>

    <div class="flex flex-wrap gap-3">
      <Select v-model="moduleFilter">
        <SelectTrigger class="w-48">
          <SelectValue placeholder="Semua modul" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="option in MODULE_OPTIONS"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="documentTypeFilter">
        <SelectTrigger class="w-56">
          <SelectValue placeholder="Semua dokumen" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="option in DOCUMENT_OPTIONS"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div v-if="pending" class="space-y-3">
      <Skeleton v-for="n in 3" :key="n" class="h-28 w-full" />
    </div>

    <Card v-else-if="!rows.length">
      <CardContent class="flex min-h-56 flex-col items-center justify-center gap-2 text-center">
        <CheckCircle2 class="h-10 w-10 text-emerald-600" />
        <p class="font-medium">
          Tidak ada yang menunggu keputusan Anda
        </p>
        <p class="max-w-md text-sm text-muted-foreground">
          Dokumen muncul di sini begitu giliran Anda tiba. Selama tahap
          sebelumnya belum diputuskan, dokumennya belum jadi tanggung
          jawab Anda.
        </p>
      </CardContent>
    </Card>

    <div v-else class="space-y-3">
      <Card v-for="row in rows" :key="row.id">
        <CardContent class="space-y-4 pt-6">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0 space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  {{ moduleLabel(row) }}
                </Badge>

                <Badge variant="secondary">
                  {{ documentLabel(row) }}
                </Badge>

                <span v-if="row.document_number" class="text-xs text-muted-foreground">
                  {{ row.document_number }}
                </span>
              </div>

              <p class="font-medium">
                {{ row.document_label || `Dokumen #${row.object_id}` }}
              </p>

              <p class="text-sm text-muted-foreground">
                Pengaju: {{ row.subject_name || '—' }} ·
                Diajukan {{ formatDate(row.submitted_at) }}
              </p>

              <p class="text-sm text-muted-foreground">
                Tahap Anda: <span class="font-medium text-foreground">{{ row.name }}</span>
              </p>

              <!-- Kenapa Anda yang harus memutuskan. Ini pertanyaan
                   pertama yang sampai ke HR, dan jawabannya sudah
                   dikirim backend di setiap baris. -->
              <p v-if="row.assignment_reference" class="text-xs text-muted-foreground">
                {{ row.assignment_reference }}
              </p>
            </div>

            <WorkflowStatusBadge :status="row.status" :label="row.status_label" />
          </div>

          <!-- Peringatan aturan yang dibekukan saat pengajuan.
               Tanpa ini approver memutuskan tanpa tahu dokumennya
               ditandai perlu diperiksa — dan tidak ada satu pun tanda
               di layarnya. Merender diri sendiri jadi kosong untuk
               dokumen yang konteksnya memang tidak memuatnya. -->
          <LeaveRuleSummary
            :context="row.document_context"
            compact
          />

          <div class="flex flex-wrap gap-2">
            <Button size="sm" @click="openDecision(row, 'approve')">
              <CheckCircle2 class="mr-2 h-4 w-4" />
              Approve
            </Button>

            <Button size="sm" variant="destructive" @click="openDecision(row, 'reject')">
              <XCircle class="mr-2 h-4 w-4" />
              Reject
            </Button>

            <Button size="sm" variant="outline" @click="openDecision(row, 'return')">
              <Undo2 class="mr-2 h-4 w-4" />
              Return
            </Button>

            <Button size="sm" variant="ghost" @click="toggleTrail(row)">
              {{ expandedId === row.id ? 'Sembunyikan jejak' : 'Lihat jejak' }}
            </Button>
          </div>

          <div v-if="expandedId === row.id" class="rounded-md border p-4">
            <WorkflowApprovalTrail
              :rows="trail"
              :loading="trailPending"
              :current-step="trailCurrentStep"
            />
          </div>
        </CardContent>
      </Card>
    </div>

    <WorkflowPagination
      v-if="rows.length || count"
      v-model:page="page"
      v-model:page-size="pageSize"
      :count="count"
      :disabled="pending"
    />

    <WorkflowDecisionDialog
      v-model:open="dialogOpen"
      :decision="dialogDecision"
      :document-label="dialogRow?.document_label"
      :step-name="dialogRow?.name"
      :submitting="submitting"
      @confirm="confirmDecision"
    />
  </main>
</template>
