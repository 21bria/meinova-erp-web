<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

import { useApi } from '@/composables/useApi'
import LeaveRuleSummary from '@/modules/hr/leave-rules/components/LeaveRuleSummary.vue'
import WorkflowApprovalTrail from '@/modules/workflow/components/WorkflowApprovalTrail.vue'
import WorkflowStatusBadge from '@/modules/workflow/components/WorkflowStatusBadge.vue'
import { useWorkflowApi } from '@/modules/workflow/composables/useWorkflowApi'

/**
 * Detail dokumen berjalan.
 *
 * Sengaja **tidak** memakai `page.vue` hasil generate: yang paling
 * berguna di layar ini adalah jejak persetujuannya, dan generator
 * `crud-workspace` belum bisa merender tab bertipe custom — tab-nya
 * cuma menampilkan "belum tersambung". Daftarnya tetap memakai halaman
 * generate; yang dibuat tangan hanya detail ini.
 */
definePageMeta({
  title: 'Running Document',
})

const route = useRoute()
const router = useRouter()

const { request } = useApi()
const api = useWorkflowApi()
const notify = useNotify()

const record = ref<any>(null)
const trail = ref<any[]>([])
const pending = ref(true)

const id = computed(() => String(route.params.id ?? ''))

async function load() {
  if (!id.value)
    return

  pending.value = true

  try {
    const [detailRes, trailRes]: any[] = await Promise.all([
      request(`/api/workflow/instances/${id.value}/`),
      api.getTrail(id.value),
    ])

    record.value = detailRes?.data ?? detailRes
    trail.value = trailRes?.data?.approvals ?? []
  }
  catch (error: any) {
    notify.error(error?.data?.message ?? 'Dokumen tidak ditemukan.')
  }
  finally {
    pending.value = false
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

const fields = computed(() => {
  const row = record.value

  if (!row)
    return []

  return [
    { label: 'Document', value: row.document_label || `#${row.object_id}` },
    { label: 'Document No.', value: row.document_number || '—' },
    { label: 'Module', value: `${row.module}/${row.document_type}` },
    { label: 'Workflow', value: `${row.definition_code} — ${row.definition_name}` },
    { label: 'Employee', value: row.subject_name || '—' },
    { label: 'Company', value: row.company_name || '—' },
    { label: 'Location', value: row.location_name || '—' },
    { label: 'Submitted By', value: row.submitted_by_name || '—' },
    { label: 'Submitted At', value: formatDate(row.submitted_at) },
    { label: 'Completed At', value: formatDate(row.completed_at) },
  ]
})

onMounted(load)
</script>

<template>
  <main class="mx-auto max-w-5xl space-y-6 px-6 py-8">
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="sm" @click="router.push('/workflow/instances')">
        <ArrowLeft class="mr-2 h-4 w-4" />
        Back
      </Button>
    </div>

    <div v-if="pending" class="space-y-4">
      <Skeleton class="h-32 w-full" />
      <Skeleton class="h-64 w-full" />
    </div>

    <template v-else-if="record">
      <Card>
        <CardHeader class="flex-row items-start justify-between space-y-0">
          <div class="space-y-1">
            <CardTitle>
              {{ record.document_label || `Dokumen #${record.object_id}` }}
            </CardTitle>
            <CardDescription>
              {{ record.definition_name }}
            </CardDescription>
          </div>

          <WorkflowStatusBadge
            :status="record.status"
            :label="record.status_label"
          />
        </CardHeader>

        <CardContent>
          <dl class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="field in fields" :key="field.label">
              <dt class="text-xs text-muted-foreground">
                {{ field.label }}
              </dt>
              <dd class="text-sm font-medium">
                {{ field.value }}
              </dd>
            </div>
          </dl>

          <p v-if="record.notes" class="mt-4 whitespace-pre-line text-sm text-muted-foreground">
            {{ record.notes }}
          </p>

          <!-- Peringatan aturan yang dibekukan saat pengajuan.
               Konteksnya sudah ikut di payload instance, jadi yang
               kurang selama ini cuma tempat merendernya. -->
          <LeaveRuleSummary
            :context="record.context"
            class="mt-4"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="text-base">
            Approval Trail
          </CardTitle>
          <CardDescription>
            Semua kotak tanda tangan dibuat sejak dokumen diajukan,
            termasuk yang dilewati beserta alasannya.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <WorkflowApprovalTrail
            :rows="trail"
            :current-step="record.current_step_name"
          />
        </CardContent>
      </Card>
    </template>

    <Card v-else>
      <CardContent class="flex min-h-40 items-center justify-center">
        <p class="text-sm text-muted-foreground">
          Dokumen tidak ditemukan.
        </p>
      </CardContent>
    </Card>
  </main>
</template>
