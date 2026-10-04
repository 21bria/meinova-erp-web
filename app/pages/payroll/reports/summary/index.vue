<script setup lang="ts">
import { AlertTriangle, RefreshCw, ShieldAlert } from 'lucide-vue-next'

import { usePayrollReportApi } from '~/modules/payroll/reports/composables/usePayrollReportApi'

definePageMeta({
  layout: 'default',
  title: 'Payroll Summary',
  module: 'payroll',
})

useHead({
  title: 'Payroll Summary',
})

const api = usePayrollReportApi()
const notify = useNotify()

const runs = ref<any[]>([])
const selectedRunId = ref<string>('')
const summary = ref<any>(null)
const pending = ref(false)

// Angka rupiah diformat sekali di sini, bukan di tiap sel: rekap ini
// penuh kolom uang, dan format yang ditulis ulang per tempat adalah
// cara paling pasti membuat satu kolom memakai pemisah yang berbeda.
const money = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

function rupiah(value: any) {
  const number = Number(value ?? 0)

  return Number.isFinite(number) ? money.format(number) : '-'
}

async function loadRuns() {
  try {
    const res: any = await api.getRuns({ page_size: 100 })

    // Amplop daftar di API ini `{ data: [...], meta: {...} }` —
    // bukan `{ results }` bawaan DRF. Bentuk lain tetap diterima
    // supaya halaman ini tidak jadi satu-satunya yang pecah kalau
    // amplopnya kelak diseragamkan.
    runs.value = Array.isArray(res?.data)
      ? res.data
      : (res?.results ?? res?.data?.results ?? [])

    // Run terbaru dipilih sendiri. Layar laporan yang dibuka kosong
    // menuntut satu klik sebelum memperlihatkan apa pun, dan pilihan
    // yang paling sering benar sudah bisa ditebak.
    if (!selectedRunId.value && runs.value.length)
      selectedRunId.value = String(runs.value[0].id)
  }
  catch (error: any) {
    notify.error(error?.message ?? 'Gagal memuat daftar payroll run.')
  }
}

async function loadSummary() {
  if (!selectedRunId.value) {
    summary.value = null

    return
  }

  pending.value = true

  try {
    const res: any = await api.getRunSummary(selectedRunId.value)

    summary.value = res?.data ?? res
  }
  catch (error: any) {
    notify.error(error?.message ?? 'Gagal memuat rekap payroll.')
  }
  finally {
    pending.value = false
  }
}

const errors = computed(() => summary.value?.validation?.errors ?? [])
const warnings = computed(() => summary.value?.validation?.warnings ?? [])

const runLabel = computed(() => {
  const run = runs.value.find(
    item => String(item.id) === selectedRunId.value,
  )

  if (!run)
    return ''

  return `${run.document_number || run.id} — ${run.period_name ?? ''}`
})

watch(selectedRunId, loadSummary)

onMounted(async () => {
  await loadRuns()
  await loadSummary()
})
</script>

<template>
  <div class="w-full flex flex-col gap-4 px-6 py-6">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          Payroll Summary
        </h2>
        <p class="text-sm text-muted-foreground">
          Rekap satu payroll run: per komponen dan per departemen.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <Select v-model="selectedRunId">
          <SelectTrigger class="w-[320px]">
            <SelectValue placeholder="Pilih payroll run" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="run in runs"
              :key="run.id"
              :value="String(run.id)"
            >
              {{ run.document_number || run.id }} — {{ run.period_name }}
            </SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" :disabled="pending" @click="loadSummary">
          <RefreshCw class="size-4" :class="pending ? 'animate-spin' : ''" />
        </Button>
      </div>
    </div>

    <div v-if="!summary" class="text-sm text-muted-foreground">
      Pilih payroll run untuk melihat rekapnya.
    </div>

    <template v-else>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Employees</CardDescription>
            <CardTitle class="text-2xl tabular-nums">
              {{ summary.run.employee_count }}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Earning</CardDescription>
            <CardTitle class="text-2xl tabular-nums">
              {{ rupiah(summary.run.total_earning) }}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Deduction</CardDescription>
            <CardTitle class="text-2xl tabular-nums">
              {{ rupiah(summary.run.total_deduction) }}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Net Pay</CardDescription>
            <CardTitle class="text-2xl tabular-nums">
              {{ rupiah(summary.run.total_net) }}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <!--
        Temuan ditampilkan di laporan, bukan hanya di layar run.
        Angka rekap yang lahir dari run bermasalah tetap terlihat rapi
        di halaman ini, dan itu justru yang berbahaya.
      -->
      <Card v-if="errors.length || warnings.length">
        <CardHeader>
          <CardTitle class="text-base">
            Validasi — {{ runLabel }}
          </CardTitle>
          <CardDescription>
            {{ errors.length }} error, {{ warnings.length }} warning.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-2">
          <div
            v-for="(item, index) in errors"
            :key="`err-${index}`"
            class="flex items-start gap-2 text-sm text-destructive"
          >
            <ShieldAlert class="mt-0.5 size-4 shrink-0" />
            <span>{{ item.message }}</span>
          </div>
          <div
            v-for="(item, index) in warnings"
            :key="`warn-${index}`"
            class="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <AlertTriangle class="mt-0.5 size-4 shrink-0" />
            <span>{{ item.message }}</span>
          </div>
        </CardContent>
      </Card>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle class="text-base">
              Earnings per Komponen
            </CardTitle>
          </CardHeader>
          <CardContent class="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead class="text-right">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="row in summary.earnings"
                  :key="`e-${row.code}`"
                >
                  <TableCell class="font-mono text-xs">
                    {{ row.code }}
                  </TableCell>
                  <TableCell>{{ row.name }}</TableCell>
                  <TableCell class="text-right tabular-nums">
                    {{ rupiah(row.total) }}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="text-base">
              Deductions per Komponen
            </CardTitle>
          </CardHeader>
          <CardContent class="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead class="text-right">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="row in summary.deductions"
                  :key="`d-${row.code}`"
                >
                  <TableCell class="font-mono text-xs">
                    {{ row.code }}
                  </TableCell>
                  <TableCell>{{ row.name }}</TableCell>
                  <TableCell class="text-right tabular-nums">
                    {{ rupiah(row.total) }}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle class="text-base">
            Rekap per Departemen
          </CardTitle>
        </CardHeader>
        <CardContent class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead class="text-right">
                  Employees
                </TableHead>
                <TableHead class="text-right">
                  Gross
                </TableHead>
                <TableHead class="text-right">
                  Deduction
                </TableHead>
                <TableHead class="text-right">
                  Net
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="(row, index) in summary.by_department"
                :key="`dep-${index}`"
              >
                <TableCell>
                  {{ row.department__name || '(tanpa departemen)' }}
                </TableCell>
                <TableCell class="text-right tabular-nums">
                  {{ row.employees }}
                </TableCell>
                <TableCell class="text-right tabular-nums">
                  {{ rupiah(row.gross) }}
                </TableCell>
                <TableCell class="text-right tabular-nums">
                  {{ rupiah(row.deduction) }}
                </TableCell>
                <TableCell class="text-right tabular-nums">
                  {{ rupiah(row.net) }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
