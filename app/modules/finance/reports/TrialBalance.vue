<script setup lang="ts">
/*
 * Neraca saldo.
 *
 * Ditulis tangan, bukan digenerate: ia bukan CRUD — tidak ada baris
 * yang bisa dibuat atau dihapus, dan kolomnya enam angka per akun yang
 * harus dijumlahkan di kaki tabel. Generator `crud-*` tidak punya
 * bentuk untuk itu.
 *
 * Seluruh penjumlahan terjadi di **backend**. Yang dilakukan berkas ini
 * cuma menampilkan hasilnya — kalau ada satu baris pun di sini yang
 * menjumlah angka, ia akan menjumlah halaman yang sedang tampil saja
 * dan totalnya berbeda dari totalnya sendiri.
 */
import { computed, ref } from "vue"

import { apiErrorMessage } from "@framework"

import { money, useLedgerFilters } from "./useLedgerFilters"

const api = useApi()
const router = useRouter()
const notify = useNotify()

const {
  state,
  query,
  isReady,
  missingReason,
  onCompanyChange,
  onFiscalYearChange,
} = useLedgerFilters()

const loading = ref(false)
const report = ref<any>(null)

const rows = computed(() => report.value?.rows ?? [])
const totals = computed(() => report.value?.totals ?? null)

async function load() {
  if (!isReady.value)
    return

  loading.value = true

  try {
    const response = await api.request<any>(
      "/finance/reports/trial-balance/",
      { query: query.value },
    )

    report.value = response?.data ?? null

    /*
     * Ketidakseimbangan **disebut**, bukan dibiarkan terbaca sendiri
     * dari dua angka berdampingan di kaki tabel. Neraca saldo yang
     * tidak reconcile berarti ada yang salah di pembukuan atau di
     * laporannya, dan itu keadaan yang harus mengganggu — bukan detail
     * yang menunggu seseorang membandingkan dua kolom.
     */
    if (report.value && !report.value.is_balanced) {
      notify.error(
        `Neraca saldo tidak seimbang — selisih ${money(report.value.difference)}.`,
      )
    }
  }
  catch (error: any) {
    report.value = null

    notify.error(apiErrorMessage(error))
  }
  finally {
    loading.value = false
  }
}

/*
 * Drill-down ke buku besar akunnya, membawa **penyaring yang sama**.
 *
 * Tanpa meneruskan filternya, halaman tujuan membuka rentang yang
 * berbeda dan angkanya tidak cocok dengan baris yang barusan diklik —
 * dan yang mengklik akan menyimpulkan salah satunya salah.
 */
function openLedger(row: any) {
  router.push({
    path: "/finance/account-ledger",
    query: {
      ...query.value,
      account_id: row.account_id,
    },
  })
}

function exportCsv() {
  const header = [
    "Account Code", "Account Name",
    "Beginning Debit", "Beginning Credit",
    "Debit", "Credit",
    "Ending Debit", "Ending Credit",
  ]

  const lines = rows.value.map((row: any) => [
    row.account_code,
    row.account_name,
    row.beginning_debit,
    row.beginning_credit,
    row.debit,
    row.credit,
    row.ending_debit,
    row.ending_credit,
  ])

  const csv = [header, ...lines]
    .map(cells => cells.map((cell: any) => `"${cell ?? ""}"`).join(","))
    .join("\n")

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = `trial-balance-${report.value?.date_from}-${report.value?.date_to}.csv`
  anchor.click()

  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h2 class="text-xl font-semibold">
          Trial Balance
        </h2>
        <p class="text-sm text-muted-foreground">
          Saldo awal, mutasi, dan saldo akhir per perkiraan.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!rows.length"
          @click="exportCsv"
        >
          Export CSV
        </Button>

        <Button
          size="sm"
          :disabled="!isReady || loading"
          @click="load"
        >
          {{ loading ? "Loading…" : "Run Report" }}
        </Button>
      </div>
    </div>

    <Card>
      <CardContent class="grid gap-3 p-4 md:grid-cols-3 lg:grid-cols-6">
        <MLookupSelect
          v-model="state.company_id"
          label="Company"
          endpoint="/administration/organization/lookup/companies/"
          value-key="value"
          label-key="label"
          @update:model-value="onCompanyChange"
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

        <MLookupSelect
          v-model="state.period_id"
          label="Period"
          endpoint="/finance/lookup/accounting-periods/"
          value-key="value"
          label-key="label"
          :depends="{ fiscal_year_id: state.fiscal_year_id }"
          :disabled="!state.fiscal_year_id"
        />

        <MLookupSelect
          v-model="state.account_root_id"
          label="Account Group"
          endpoint="/finance/lookup/account-groups/"
          value-key="value"
          label-key="label"
          :depends="{ company_id: state.company_id }"
          :disabled="!state.company_id"
        />

        <MLookupSelect
          v-model="state.location_id"
          label="Site"
          endpoint="/administration/organization/lookup/locations/"
          value-key="value"
          label-key="label"
          :depends="{ company_id: state.company_id }"
          :disabled="!state.company_id"
        />

        <MLookupSelect
          v-model="state.cost_center_id"
          label="Cost Center"
          endpoint="/administration/organization/lookup/cost-centers/"
          value-key="value"
          label-key="label"
          :depends="{ company_id: state.company_id }"
          :disabled="!state.company_id"
        />

        <div class="md:col-span-3 lg:col-span-6 flex items-center gap-4">
          <MDateField v-model="state.date_from" label="From" />
          <MDateField v-model="state.date_to" label="To" />

          <label class="flex items-center gap-2 text-sm">
            <input v-model="state.include_zero" type="checkbox">
            Show zero-balance accounts
          </label>
        </div>
      </CardContent>
    </Card>

    <!-- Kenapa tombolnya mati disebut, bukan cuma tombolnya yang
         abu-abu. Tombol mati tanpa keterangan membuat orang mengira
         layarnya rusak. -->
    <p v-if="missingReason" class="text-sm text-muted-foreground">
      {{ missingReason }}
    </p>

    <Card v-if="report">
      <CardHeader class="flex flex-row items-center justify-between">
        <div>
          <CardTitle class="text-base">
            {{ report.date_from }} — {{ report.date_to }}
          </CardTitle>
          <CardDescription>{{ rows.length }} account(s)</CardDescription>
        </div>

        <Badge :variant="report.is_balanced ? 'secondary' : 'destructive'">
          {{ report.is_balanced ? "Balanced" : `Out of balance by ${money(report.difference)}` }}
        </Badge>
      </CardHeader>

      <CardContent>
        <!-- Tabel lebar menggulir di dalam wadahnya sendiri; halaman
             tidak pernah menggulir ke samping. -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b text-muted-foreground">
              <tr>
                <th class="py-2 text-left font-medium">Account</th>
                <th class="py-2 text-right font-medium">Beginning Dr</th>
                <th class="py-2 text-right font-medium">Beginning Cr</th>
                <th class="py-2 text-right font-medium">Debit</th>
                <th class="py-2 text-right font-medium">Credit</th>
                <th class="py-2 text-right font-medium">Ending Dr</th>
                <th class="py-2 text-right font-medium">Ending Cr</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="row in rows"
                :key="row.account_id"
                class="cursor-pointer border-b last:border-0 hover:bg-muted/50"
                @click="openLedger(row)"
              >
                <td class="py-2">
                  <span class="font-mono text-xs text-muted-foreground">
                    {{ row.account_code }}
                  </span>
                  <span class="ml-2">{{ row.account_name }}</span>
                </td>
                <td class="py-2 text-right tabular-nums">{{ money(row.beginning_debit) }}</td>
                <td class="py-2 text-right tabular-nums">{{ money(row.beginning_credit) }}</td>
                <td class="py-2 text-right tabular-nums">{{ money(row.debit) }}</td>
                <td class="py-2 text-right tabular-nums">{{ money(row.credit) }}</td>
                <td class="py-2 text-right tabular-nums">{{ money(row.ending_debit) }}</td>
                <td class="py-2 text-right tabular-nums">{{ money(row.ending_credit) }}</td>
              </tr>

              <tr v-if="!rows.length">
                <td colspan="7" class="py-8 text-center text-muted-foreground">
                  Tidak ada mutasi pada rentang ini.
                </td>
              </tr>
            </tbody>

            <tfoot v-if="totals" class="border-t-2 font-medium">
              <tr>
                <td class="py-2">Total</td>
                <td class="py-2 text-right tabular-nums">{{ money(totals.beginning_debit) }}</td>
                <td class="py-2 text-right tabular-nums">{{ money(totals.beginning_credit) }}</td>
                <td class="py-2 text-right tabular-nums">{{ money(totals.debit) }}</td>
                <td class="py-2 text-right tabular-nums">{{ money(totals.credit) }}</td>
                <td class="py-2 text-right tabular-nums">{{ money(totals.ending_debit) }}</td>
                <td class="py-2 text-right tabular-nums">{{ money(totals.ending_credit) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
