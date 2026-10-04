<script setup lang="ts">
import {
  CheckCircle2,
  GitBranch,
  Inbox,
  Send,
  UserRoundCog,
  Workflow,
} from 'lucide-vue-next'

import WorkflowStatusBadge from '@/modules/workflow/components/WorkflowStatusBadge.vue'
import { useWorkflowApi } from '@/modules/workflow/composables/useWorkflowApi'

definePageMeta({
  layout: 'default',
  title: 'Workflow',
})

const api = useWorkflowApi()

// Kartu Konfigurasi disembunyikan dari yang tidak berhak, sama seperti
// menunya di sidebar — kalau tidak, dua tempat memberi jawaban berbeda
// tentang hal yang sama.
const { canConfigureWorkflow: canConfigure, load: loadAccess } = useAccess()

const pending = ref(true)

const summary = ref({ waiting_for_me: 0, my_open_submissions: 0 })
const runningCount = ref(0)
const definitionCount = ref(0)
const delegationCount = ref(0)

const inbox = ref<any[]>([])
const running = ref<any[]>([])

/**
 * Semua angka di halaman ini datang dari API, bukan dari konstanta.
 *
 * Kartu berisi angka karangan lebih berbahaya daripada kartu kosong:
 * orang menganggapnya sudah divalidasi, dan tidak ada yang memeriksanya
 * lagi sampai ada yang membandingkannya dengan laporan.
 */
async function load() {
  pending.value = true

  try {
    const [
      summaryRes,
      inboxRes,
      runningRes,
      definitionRes,
      delegationRes,
    ] = await Promise.all([
      api.getSummary(),
      api.getInbox({ page_size: 5 }),
      api.getInstances({ status: 'pending', page_size: 5 }),
      api.getDefinitions({ status: 'active', page_size: 1 }),
      api.getDelegations({ is_active: true, page_size: 1 }),
    ]) as any[]

    await loadAccess()

    summary.value = summaryRes?.data ?? summary.value

    inbox.value = inboxRes?.data ?? []
    running.value = runningRes?.data ?? []

    runningCount.value = runningRes?.meta?.count ?? running.value.length
    definitionCount.value = definitionRes?.meta?.count ?? 0
    delegationCount.value = delegationRes?.meta?.count ?? 0
  }
  catch (error) {
    console.error('Workflow dashboard load failed:', error)
  }
  finally {
    pending.value = false
  }
}

const stats = computed(() => [
  {
    key: 'waiting',
    label: 'Menunggu Keputusan Saya',
    value: summary.value.waiting_for_me,
    icon: Inbox,
    link: '/workflow/inbox',
    hint: 'Termasuk yang dikuasakan kepada Anda',
  },
  {
    key: 'submissions',
    label: 'Pengajuan Saya Berjalan',
    value: summary.value.my_open_submissions,
    icon: Send,
    link: '/workflow/submissions',
    hint: 'Belum disetujui maupun ditolak',
  },
  {
    key: 'running',
    label: 'Dokumen Berjalan',
    value: runningCount.value,
    icon: GitBranch,
    link: '/workflow/instances',
    hint: 'Seluruh tenant',
  },
  {
    key: 'definitions',
    label: 'Alur Aktif',
    value: definitionCount.value,
    icon: Workflow,
    link: '/workflow/definitions',
    hint: 'Hanya yang berstatus Active yang dipakai',
  },
])

function formatDate(value?: string | null) {
  if (!value)
    return '—'

  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

onMounted(load)
</script>

<template>
  <main class="mx-auto max-w-7xl space-y-6 px-6 py-8">
    <header>
      <h1 class="text-2xl font-semibold">
        Workflow
      </h1>

      <p class="text-muted-foreground">
        Alur persetujuan lintas modul — pengajuan, keputusan, dan
        siapa yang sedang memegangnya.
      </p>
    </header>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <NuxtLink
        v-for="stat in stats"
        :key="stat.key"
        :to="stat.link"
        class="rounded-xl transition-colors hover:bg-accent/40"
      >
        <Card class="h-full">
          <CardHeader class="space-y-1">
            <div class="flex items-center justify-between">
              <CardDescription>{{ stat.label }}</CardDescription>
              <component :is="stat.icon" class="h-4 w-4 text-muted-foreground" />
            </div>

            <Skeleton v-if="pending" class="h-8 w-16" />
            <CardTitle v-else class="text-3xl">
              {{ stat.value }}
            </CardTitle>

            <p class="text-xs text-muted-foreground">
              {{ stat.hint }}
            </p>
          </CardHeader>
        </Card>
      </NuxtLink>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader class="flex-row items-center justify-between space-y-0">
          <CardTitle class="flex items-center gap-2 text-base">
            <Inbox class="h-4 w-4" />
            Menunggu Keputusan Saya
          </CardTitle>

          <Button as-child variant="ghost" size="sm">
            <NuxtLink to="/workflow/inbox">
              Lihat semua
            </NuxtLink>
          </Button>
        </CardHeader>

        <CardContent class="space-y-3">
          <div v-if="pending" class="space-y-3">
            <Skeleton v-for="n in 3" :key="n" class="h-16 w-full" />
          </div>

          <div
            v-else-if="!inbox.length"
            class="flex min-h-32 flex-col items-center justify-center gap-2 text-center"
          >
            <CheckCircle2 class="h-8 w-8 text-emerald-600" />
            <p class="text-sm text-muted-foreground">
              Tidak ada yang menunggu keputusan Anda.
            </p>
          </div>

          <NuxtLink
            v-for="row in inbox"
            v-else
            :key="row.id"
            to="/workflow/inbox"
            class="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/40"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-medium">
                {{ row.document_label || `Dokumen #${row.object_id}` }}
              </p>
              <p class="truncate text-xs text-muted-foreground">
                {{ row.name }} · {{ row.subject_name || '—' }}
              </p>
            </div>

            <Badge variant="outline" class="shrink-0">
              {{ row.module }}
            </Badge>
          </NuxtLink>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex-row items-center justify-between space-y-0">
          <CardTitle class="flex items-center gap-2 text-base">
            <GitBranch class="h-4 w-4" />
            Dokumen Berjalan
          </CardTitle>

          <Button as-child variant="ghost" size="sm">
            <NuxtLink to="/workflow/instances">
              Lihat semua
            </NuxtLink>
          </Button>
        </CardHeader>

        <CardContent class="space-y-3">
          <div v-if="pending" class="space-y-3">
            <Skeleton v-for="n in 3" :key="n" class="h-16 w-full" />
          </div>

          <div
            v-else-if="!running.length"
            class="flex min-h-32 items-center justify-center text-center"
          >
            <p class="text-sm text-muted-foreground">
              Belum ada dokumen yang sedang berjalan.
            </p>
          </div>

          <div
            v-for="row in running"
            v-else
            :key="row.id"
            class="flex items-center justify-between gap-3 rounded-lg border p-3"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-medium">
                {{ row.document_label || `Dokumen #${row.object_id}` }}
              </p>
              <p class="truncate text-xs text-muted-foreground">
                Menunggu {{ row.current_step_name || '—' }} ·
                {{ formatDate(row.submitted_at) }}
              </p>
            </div>

            <WorkflowStatusBadge
              class="shrink-0"
              :status="row.status"
              :label="row.status_label"
            />
          </div>
        </CardContent>
      </Card>
    </div>

    <Card v-if="canConfigure">
      <CardHeader>
        <CardTitle class="text-base">
          Konfigurasi
        </CardTitle>
        <CardDescription>
          Cakupan alur yang dikosongkan berarti berlaku untuk semua —
          bukan belum diisi.
        </CardDescription>
      </CardHeader>

      <CardContent class="grid gap-3 sm:grid-cols-3">
        <NuxtLink
          to="/workflow/definitions"
          class="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent/40"
        >
          <Workflow class="h-5 w-5 text-muted-foreground" />
          <div>
            <p class="text-sm font-medium">
              Workflow Definitions
            </p>
            <p class="text-xs text-muted-foreground">
              {{ definitionCount }} alur aktif
            </p>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/workflow/steps"
          class="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent/40"
        >
          <GitBranch class="h-5 w-5 text-muted-foreground" />
          <div>
            <p class="text-sm font-medium">
              Approval Steps
            </p>
            <p class="text-xs text-muted-foreground">
              Tingkat persetujuan per alur
            </p>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/workflow/delegations"
          class="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent/40"
        >
          <UserRoundCog class="h-5 w-5 text-muted-foreground" />
          <div>
            <p class="text-sm font-medium">
              Delegations
            </p>
            <p class="text-xs text-muted-foreground">
              {{ delegationCount }} surat kuasa aktif
            </p>
          </div>
        </NuxtLink>
      </CardContent>
    </Card>
  </main>
</template>
