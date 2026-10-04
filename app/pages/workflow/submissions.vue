<script setup lang="ts">
import { RefreshCw, Send } from 'lucide-vue-next'

import WorkflowApprovalTrail from '@/modules/workflow/components/WorkflowApprovalTrail.vue'
import WorkflowPagination from '@/modules/workflow/components/WorkflowPagination.vue'
import WorkflowStatusBadge from '@/modules/workflow/components/WorkflowStatusBadge.vue'
import { useWorkflowApi } from '@/modules/workflow/composables/useWorkflowApi'

definePageMeta({
  title: 'My Submissions',
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
const statusFilter = ref(ALL)
const page = ref(1)
const pageSize = ref(20)

const expandedId = ref<number | null>(null)

const STATUS_OPTIONS = [
  { label: 'Semua status', value: ALL },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Returned', value: 'returned' },
  { label: 'Cancelled', value: 'cancelled' },
]

async function load() {
  pending.value = true

  try {
    const res: any = await api.getMySubmissions({
      status: param(statusFilter.value),
      page: page.value,
      page_size: pageSize.value,
    })

    rows.value = res?.data ?? []
    count.value = res?.meta?.count ?? rows.value.length
  }
  catch (error: any) {
    notify.error(error?.data?.message ?? 'Gagal memuat pengajuan.')
    rows.value = []
    count.value = 0
  }
  finally {
    pending.value = false
  }
}

// Jejaknya sudah ikut di detail instance (`approvals`), jadi tidak
// perlu request kedua seperti di kotak masuk — daftar ini memang
// pendek, isinya cuma pengajuan milik satu orang.
function toggle(row: any) {
  expandedId.value = expandedId.value === row.id ? null : row.id
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

watch(statusFilter, () => {
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
          <Send class="h-6 w-6" />
          My Submissions
        </h1>

        <p class="text-muted-foreground">
          Dokumen yang Anda ajukan, dan sedang di meja siapa sekarang.
        </p>
      </div>

      <div class="flex gap-2">
        <Select v-model="statusFilter">
          <SelectTrigger class="w-44">
            <SelectValue placeholder="Semua status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="option in STATUS_OPTIONS"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" :disabled="pending" @click="load">
          <RefreshCw class="mr-2 h-4 w-4" :class="pending ? 'animate-spin' : ''" />
          Refresh
        </Button>
      </div>
    </header>

    <div v-if="pending" class="space-y-3">
      <Skeleton v-for="n in 3" :key="n" class="h-24 w-full" />
    </div>

    <Card v-else-if="!rows.length">
      <CardContent class="flex min-h-56 flex-col items-center justify-center gap-2 text-center">
        <p class="font-medium">
          Belum ada pengajuan
        </p>
        <p class="max-w-md text-sm text-muted-foreground">
          Dokumen muncul di sini setelah Anda menekan Submit di modulnya
          — misalnya di layar Cuti atau Travel Request.
        </p>
      </CardContent>
    </Card>

    <div v-else class="space-y-3">
      <Card v-for="row in rows" :key="row.id">
        <CardContent class="space-y-3 pt-6">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0 space-y-1">
              <p class="font-medium">
                {{ row.document_label || `Dokumen #${row.object_id}` }}
              </p>

              <p class="text-sm text-muted-foreground">
                {{ row.definition_name }} · Diajukan {{ formatDate(row.submitted_at) }}
              </p>

              <p v-if="row.current_step_name" class="text-sm">
                Menunggu:
                <span class="font-medium">{{ row.current_step_name }}</span>
              </p>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs text-muted-foreground">
                {{ row.progress?.decided ?? 0 }}/{{ row.progress?.total ?? 0 }}
              </span>

              <WorkflowStatusBadge :status="row.status" :label="row.status_label" />
            </div>
          </div>

          <Button size="sm" variant="ghost" @click="toggle(row)">
            {{ expandedId === row.id ? 'Sembunyikan jejak' : 'Lihat jejak' }}
          </Button>

          <div v-if="expandedId === row.id" class="rounded-md border p-4">
            <WorkflowApprovalTrail
              :rows="row.approvals ?? []"
              :current-step="row.current_step_name"
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
  </main>
</template>
