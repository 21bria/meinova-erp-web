<script setup lang="ts">
/*
 * Buku besar satu akun: saldo awal, lalu mutasinya baris per baris.
 *
 * Saldo berjalannya datang dari **backend** (window function), bukan
 * diakumulasi di sini. Bedanya menentukan begitu daftarnya berhalaman:
 * akumulasi di frontend cuma tahu baris yang sedang dimuat, jadi saldo
 * berjalan di halaman dua akan mulai dari nol lagi — angka yang
 * terlihat masuk akal dan salah sama sekali.
 */
import { computed, onMounted, ref, watch } from "vue"

import { apiErrorMessage } from "@framework"

import { money, useLedgerFilters } from "./useLedgerFilters"

const api = useApi()
const route = useRoute()
const router = useRouter()
const notify = useNotify()

function numberParam(key: string) {
  const raw = route.query[key]

  if (raw === undefined || raw === null || raw === "")
    return null

  const parsed = Number(raw)

  return Number.isFinite(parsed) ? parsed : null
}

function stringParam(key: string) {
  const raw = route.query[key]

  return typeof raw === "string" && raw ? raw : null
}

/*
 * Penyaring diambil dari query string, jadi drill-down dari Trial
 * Balance mendarat pada rentang yang **sama persis** dengan baris yang
 * diklik. Tanpa ini, halaman ini membuka rentang bawaannya sendiri dan
 * angkanya tidak cocok dengan yang barusan dilihat orang — yang
 * mengklik akan menyimpulkan salah satunya salah.
 */
const { state, query, isReady, missingReason, onCompanyChange, onFiscalYearChange }
  = useLedgerFilters({
    company_id: numberParam("company_id"),
    fiscal_year_id: numberParam("fiscal_year_id"),
    period_id: numberParam("period_id"),
    account_id: numberParam("account_id"),
    location_id: numberParam("location_id"),
    cost_center_id: numberParam("cost_center_id"),
    date_from: stringParam("date_from"),
    date_to: stringParam("date_to"),
  })

const loading = ref(false)
const report = ref<any>(null)
const offset = ref(0)

const LIMIT = 100

const rows = computed(() => report.value?.rows ?? [])
const account = computed(() => report.value?.account ?? null)

const hasMore = computed(() => {
  if (!report.value)
    return false

  return offset.value + LIMIT < (report.value.count ?? 0)
})

const ready = computed(() => isReady.value && Boolean(state.account_id))

const reason = computed(() => {
  if (!state.account_id && state.company_id)
    return "Pilih akun yang mau dilihat buku besarnya."

  return missingReason.value
})

async function load() {
  if (!ready.value)
    return

  loading.value = true

  try {
    const response = await api.request<any>(
      "/finance/reports/account-ledger/",
      { query: { ...query.value, limit: LIMIT, offset: offset.value } },
    )

    report.value = response?.data ?? null
  }
  catch (error: any) {
    report.value = null

    notify.error(apiErrorMessage(error))
  }
  finally {
    loading.value = false
  }
}

function page(direction: number) {
  offset.value = Math.max(0, offset.value + direction * LIMIT)

  load()
}

/* Mengganti penyaring mengembalikan ke halaman pertama. Tanpa ini,
 * penyaring baru dibuka pada offset lama dan hasilnya daftar kosong
 * yang terbaca seperti "tidak ada mutasi". */
watch(query, () => {
  offset.value = 0
})

function openJournal(row: any) {
  router.push(`/finance/journals/${row.journal_id}`)
}

onMounted(() => {
  if (ready.value)
    load()
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h2 class="text-xl font-semibold">
          Account Ledger
        </h2>
        <p class="text-sm text-muted-foreground">
          Mutasi satu perkiraan beserta saldo berjalannya.
        </p>
      </div>

      <Button size="sm" :disabled="!ready || loading" @click="load">
        {{ loading ? "Loading…" : "Run Report" }}
      </Button>
    </div>

    <Card>
      <CardContent class="grid gap-3 p-4 md:grid-cols-3 lg:grid-cols-5">
        <MLookupSelect
          v-model="state.company_id"
          label="Company"
          endpoint="/administration/organization/lookup/companies/"
          value-key="value"
          label-key="label"
          @update:model-value="onCompanyChange"
        />

        <MLookupSelect
          v-model="state.account_id"
          label="Account"
          endpoint="/finance/lookup/accounts/"
          value-key="value"
          label-key="label"
          :depends="{ company_id: state.company_id }"
          :disabled="!state.company_id"
        />

        <MLookupSelect
          v-model="state.fiscal_year_id"
          label="Fiscal Year"
          endpoint="/finance/lookup/fiscal-years/"
          value-key="value"
          label-key="label"
          :depends="{ company_id: state.company_id }"
          :disabled="!state.company_id"
          @update:model-value="onFiscalYearChange"
        />

        <MDateField v-model="state.date_from" label="From" />
        <MDateField v-model="state.date_to" label="To" />
      </CardContent>
    </Card>

    <p v-if="reason" class="text-sm text-muted-foreground">
      {{ reason }}
    </p>

    <Card v-if="report">
      <CardHeader>
        <CardTitle class="text-base">
          <span class="font-mono text-xs text-muted-foreground">
            {{ account?.code }}
          </span>
          <span class="ml-2">{{ account?.name }}</span>
        </CardTitle>
        <CardDescription>
          {{ report.date_from }} — {{ report.date_to }} · {{ report.count }} entries
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <div class="grid gap-3 md:grid-cols-4">
          <div>
            <p class="text-xs text-muted-foreground">Beginning Balance</p>
            <p class="text-lg font-semibold tabular-nums">
              {{ money(report.beginning_balance) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Debit</p>
            <p class="text-lg font-semibold tabular-nums">
              {{ money(report.total_debit) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Credit</p>
            <p class="text-lg font-semibold tabular-nums">
              {{ money(report.total_credit) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Ending Balance</p>
            <p class="text-lg font-semibold tabular-nums">
              {{ money(report.ending_balance) }}
            </p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b text-muted-foreground">
              <tr>
                <th class="py-2 text-left font-medium">Date</th>
                <th class="py-2 text-left font-medium">Journal</th>
                <th class="py-2 text-left font-medium">Description</th>
                <th class="py-2 text-left font-medium">Source</th>
                <th class="py-2 text-right font-medium">Debit</th>
                <th class="py-2 text-right font-medium">Credit</th>
                <th class="py-2 text-right font-medium">Balance</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="row in rows"
                :key="row.line_id"
                class="cursor-pointer border-b last:border-0 hover:bg-muted/50"
                @click="openJournal(row)"
              >
                <td class="py-2 whitespace-nowrap">{{ row.posting_date }}</td>
                <td class="py-2 font-mono text-xs">{{ row.journal_number }}</td>
                <td class="py-2">{{ row.description }}</td>
                <td class="py-2 text-xs text-muted-foreground">
                  <!-- Penelusuran balik ke dokumen sumbernya. Kosong
                       untuk jurnal manual, dan itu memang benar. -->
                  <span v-if="row.source_module">
                    {{ row.source_module }} · {{ row.source_id }}
                  </span>
                  <span v-else>—</span>
                </td>
                <td class="py-2 text-right tabular-nums">{{ money(row.debit) }}</td>
                <td class="py-2 text-right tabular-nums">{{ money(row.credit) }}</td>
                <td class="py-2 text-right font-medium tabular-nums">
                  {{ money(row.running_balance) }}
                </td>
              </tr>

              <tr v-if="!rows.length">
                <td colspan="7" class="py-8 text-center text-muted-foreground">
                  Tidak ada mutasi pada rentang ini.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="report.count > LIMIT" class="flex items-center justify-between">
          <p class="text-sm text-muted-foreground">
            {{ offset + 1 }}–{{ Math.min(offset + LIMIT, report.count) }}
            of {{ report.count }}
          </p>

          <div class="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="offset === 0 || loading"
              @click="page(-1)"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              :disabled="!hasMore || loading"
              @click="page(1)"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
