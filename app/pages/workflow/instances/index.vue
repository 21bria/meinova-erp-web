<script setup lang="ts">
import { ExternalLink, GitBranch, RefreshCw, Search } from 'lucide-vue-next'

import WorkflowApprovalTrail from '@/modules/workflow/components/WorkflowApprovalTrail.vue'
import WorkflowPagination from '@/modules/workflow/components/WorkflowPagination.vue'
import WorkflowStatusBadge from '@/modules/workflow/components/WorkflowStatusBadge.vue'
import { codeLabel } from '@framework'
import { useI18n } from 'vue-i18n'
import { useWorkflowApi } from '@/modules/workflow/composables/useWorkflowApi'

/**
 * Layar monitoring dokumen berjalan.
 *
 * Ditulis tangan, bukan memakai `page.vue` hasil generate: tiga hal
 * yang paling dibutuhkan di sini — bar progres, tooltip "menunggu
 * siapa sejak kapan", dan tombol buka dokumen asli — tidak bisa
 * diungkapkan grid schema-driven, yang cuma merender teks, badge, dan
 * tanggal. Modul hasil generate tetap ada dan dipakai untuk export.
 */
definePageMeta({
  title: 'Running Documents',
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

const { t } = useI18n()

const search = ref('')
const statusFilter = ref(ALL)
const page = ref(1)
const pageSize = ref(20)

const expandedId = ref<number | null>(null)

/*
| Pilihan filter status.
|
| `value` adalah kode stabil yang dikirim ke API sebagai query string —
| tidak disentuh. `label` dihitung dari kode itu lewat katalog, jadi
| dropdown-nya ikut bahasa pengguna. Sebelumnya "Semua status" tertulis
| mati di sini: satu-satunya kata Indonesia di layar yang seluruh
| kolomnya berbahasa Inggris.
*/
const STATUS_OPTIONS = computed(() => [
  { label: t('common.labels.all'), value: ALL },
  ...['pending', 'approved', 'rejected', 'returned', 'cancelled'].map(code => ({
    label: codeLabel('status', code, code),
    value: code,
  })),
])

async function load() {
  pending.value = true

  try {
    const res: any = await api.getInstances({
      search: search.value,
      status: param(statusFilter.value),
      page: page.value,
      page_size: pageSize.value,
    })

    rows.value = res?.data ?? []
    count.value = res?.meta?.count ?? rows.value.length
  }
  catch (error: any) {
    notify.error(error?.data?.message ?? 'Gagal memuat dokumen.')
    rows.value = []
    count.value = 0
  }
  finally {
    pending.value = false
  }
}

// Filter mengubah jumlah baris, jadi halamannya harus kembali ke 1 —
// kalau tidak, menyaring dari halaman 3 menghasilkan tabel kosong yang
// terlihat seperti "tidak ada datanya".
watch([search, statusFilter], () => {
  page.value = 1
  load()
})

watch([page, pageSize], load)

function toggle(row: any) {
  expandedId.value = expandedId.value === row.id ? null : row.id
}

function formatDate(value?: string | null) {
  if (!value)
    return '—'

  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * "sudah 3 hari" — satu-satunya angka yang membuat orang menagih.
 *
 * Dihitung dari keputusan terakhir sebelum kotak yang sedang ditunggu
 * (backend yang menentukan `since`), bukan dari tanggal pengajuan:
 * dokumen yang sudah lewat dua meja baru mendarat di meja ketiga
 * kemarin, dan menghitungnya sejak pengajuan menyalahkan orang yang
 * salah.
 */
function elapsed(value?: string | null) {
  if (!value)
    return null

  const days = Math.floor(
    (Date.now() - new Date(value).getTime()) / 86_400_000,
  )

  if (days <= 0)
    return 'hari ini'

  if (days === 1)
    return '1 hari'

  return `${days} hari`
}

const MODULE_LABEL: Record<string, string> = {
  hr: 'HR',
  payroll: 'Payroll',
  finance: 'Finance',
  scm: 'Supply Chain',
}

const DOCUMENT_LABEL: Record<string, string> = {
  leave_request: 'Cuti',
  travel_request: 'Travel Request',
  overtime: 'Lembur',
}

function progressTone(row: any) {
  if (row.status === 'rejected')
    return '[&>div]:bg-destructive'

  if (row.status === 'approved')
    return '[&>div]:bg-emerald-600'

  if (row.status === 'returned')
    return '[&>div]:bg-orange-500'

  return ''
}

onMounted(load)
</script>

<template>
  <main class="mx-auto max-w-[100rem] space-y-6 px-6 py-8">
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="flex items-center gap-2 text-2xl font-semibold">
          <GitBranch class="h-6 w-6" />
          Running Documents
        </h1>

        <p class="text-muted-foreground">
          Dokumen yang berjalan di alur persetujuan — sudah sampai mana,
          dan sedang di meja siapa.
        </p>
      </div>

      <Button variant="outline" size="sm" :disabled="pending" @click="load">
        <RefreshCw class="mr-2 h-4 w-4" :class="pending ? 'animate-spin' : ''" />
        Refresh
      </Button>
    </header>

    <div class="flex flex-wrap items-center gap-3">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          v-model="search"
          placeholder="Cari dokumen, nomor, atau nama pegawai…"
          class="pl-9"
        />
      </div>

      <Select v-model="statusFilter">
        <SelectTrigger class="w-44">
          <SelectValue :placeholder="t('common.labels.all')" />
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

      <p class="ml-auto text-sm text-muted-foreground">
        {{ count }} dokumen
      </p>
    </div>

    <Card>
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="min-w-[22rem]">
                  Document
                </TableHead>
                <TableHead class="min-w-[10rem]">
                  Employee
                </TableHead>
                <TableHead class="min-w-[12rem]">
                  Progress
                </TableHead>
                <TableHead class="min-w-[7rem]">
                  Status
                </TableHead>
                <TableHead class="min-w-[14rem]">
                  Waiting At
                </TableHead>
                <TableHead class="min-w-[8rem]">
                  Submitted
                </TableHead>
                <TableHead class="w-[1%]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow v-if="pending">
                <TableCell colspan="7">
                  <div class="space-y-2 py-2">
                    <Skeleton v-for="n in 5" :key="n" class="h-10 w-full" />
                  </div>
                </TableCell>
              </TableRow>

              <TableRow v-else-if="!rows.length">
                <TableCell colspan="7" class="py-12 text-center text-muted-foreground">
                  Tidak ada dokumen yang cocok.
                </TableCell>
              </TableRow>

              <template v-for="row in rows" v-else :key="row.id">
                <TableRow>
                  <TableCell>
                    <div class="space-y-1">
                      <p class="font-medium">
                        {{ row.document_label || `Dokumen #${row.object_id}` }}
                      </p>
                      <div class="flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline" class="text-[10px]">
                          {{ MODULE_LABEL[row.module] ?? row.module }}
                        </Badge>
                        <Badge variant="secondary" class="text-[10px]">
                          {{ DOCUMENT_LABEL[row.document_type] ?? row.document_type }}
                        </Badge>
                        <span v-if="row.document_number" class="text-xs text-muted-foreground">
                          {{ row.document_number }}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <p class="text-sm">
                      {{ row.subject_name || '—' }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      {{ row.location_name || row.company_name || '—' }}
                    </p>
                  </TableCell>

                  <!-- Bar + persen. Tooltipnya memecah angka itu jadi
                       kalimat: berapa kotak selesai, berapa dilewati. -->
                  <TableCell>
                    <Tooltip :delay-duration="200">
                      <TooltipTrigger as-child>
                        <div class="w-full space-y-1">
                          <div class="flex items-center justify-between text-xs">
                            <span class="text-muted-foreground">
                              {{ row.progress?.decided ?? 0 }}/{{ row.progress?.total ?? 0 }} tahap
                            </span>
                            <span class="font-medium">
                              {{ row.progress?.percent ?? 0 }}%
                            </span>
                          </div>

                          <Progress
                            :model-value="row.progress?.percent ?? 0"
                            :class="progressTone(row)"
                          />
                        </div>
                      </TooltipTrigger>

                      <TooltipContent side="top" class="max-w-xs">
                        <p class="font-medium">
                          {{ row.progress?.decided ?? 0 }} dari
                          {{ row.progress?.total ?? 0 }} kotak tanda tangan selesai
                        </p>
                        <p v-if="row.progress?.approved" class="text-xs">
                          {{ row.progress.approved }} disetujui
                        </p>
                        <p v-if="row.progress?.skipped" class="text-xs">
                          {{ row.progress.skipped }} dilewati — approver rangkap
                          atau syarat step tidak terpenuhi
                        </p>
                        <p v-if="row.status !== 'pending'" class="text-xs">
                          Alur sudah berhenti, jadi ditampilkan 100%.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <WorkflowStatusBadge
                      :status="row.status"
                      :label="row.status_label"
                    />
                  </TableCell>

                  <!-- Menunggu siapa, sejak kapan. Ini yang paling
                       sering ditanyakan dan paling sering tidak ada
                       jawabannya. -->
                  <TableCell>
                    <Tooltip v-if="row.waiting_for" :delay-duration="200">
                      <TooltipTrigger as-child>
                        <div class="cursor-default space-y-0.5">
                          <p class="text-sm">
                            {{ row.waiting_for.step }}
                          </p>
                          <p class="text-xs text-muted-foreground">
                            {{ row.waiting_for.approvers.join(', ') || 'Approver tidak ditemukan' }}
                            <span v-if="elapsed(row.waiting_for.since)">
                              · {{ elapsed(row.waiting_for.since) }}
                            </span>
                          </p>
                        </div>
                      </TooltipTrigger>

                      <TooltipContent side="top" class="max-w-xs">
                        <p class="font-medium">
                          Tahap #{{ row.waiting_for.sequence }} —
                          {{ row.waiting_for.step }}
                        </p>
                        <p class="text-xs">
                          Menunggu
                          {{ row.waiting_for.approvers.join(', ') || 'approver yang belum ditemukan' }}
                        </p>
                        <p class="text-xs">
                          Sejak {{ formatDate(row.waiting_for.since) }}
                          <template v-if="elapsed(row.waiting_for.since)">
                            ({{ elapsed(row.waiting_for.since) }})
                          </template>
                        </p>
                      </TooltipContent>
                    </Tooltip>

                    <span v-else class="text-sm text-muted-foreground">
                      —
                    </span>
                  </TableCell>

                  <TableCell class="text-sm text-muted-foreground">
                    {{ formatDate(row.submitted_at) }}
                  </TableCell>

                  <TableCell>
                    <div class="flex items-center justify-end gap-1">
                      <!-- Tombolnya hanya muncul kalau modulnya sudah
                           mendaftarkan rutenya. Menebak rute berarti
                           tombol yang tampak berfungsi lalu mendarat
                           di 404. -->
                      <Button
                        v-if="row.document_url"
                        as-child
                        variant="ghost"
                        size="icon"
                        title="Buka dokumen asli"
                      >
                        <NuxtLink :to="row.document_url">
                          <ExternalLink class="h-4 w-4" />
                        </NuxtLink>
                      </Button>

                      <Button variant="ghost" size="sm" @click="toggle(row)">
                        {{ expandedId === row.id ? 'Tutup' : 'Jejak' }}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow v-if="expandedId === row.id" class="hover:bg-transparent">
                  <TableCell colspan="7" class="bg-muted/30">
                    <div class="px-2 py-4">
                      <WorkflowApprovalTrail
                        :rows="row.approvals ?? []"
                        :current-step="row.current_step_name"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              </template>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <WorkflowPagination
      v-if="rows.length || count"
      v-model:page="page"
      v-model:page-size="pageSize"
      :count="count"
      :disabled="pending"
    />

  </main>
</template>
