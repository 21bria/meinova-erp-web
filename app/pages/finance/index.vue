<script setup lang="ts">
/*
 * Beranda Finance.
 *
 * Halaman ini sebelumnya memuat angka **hardcode** — "Rp 850M" kas,
 * "Rp 120M" hutang — yang tidak menunjuk data apa pun dan tidak pernah
 * berubah. Angka palsu di dashboard keuangan lebih berbahaya daripada
 * dashboard kosong: yang membacanya tidak punya cara tahu bahwa angka
 * itu tidak berasal dari mana-mana.
 *
 * Yang ditampilkan sekarang hanya yang benar-benar bisa dijawab Finance
 * Core hari ini: keadaan periode berjalan, jurnal yang menunggu, dan
 * kejadian akuntansi yang gagal. Kas, AP, AR, dan anggaran menyusul
 * bersama modulnya masing-masing — kartunya tidak dipasang sebelum ada
 * datanya.
 */
import { computed, onMounted, ref, watch } from "vue"

import { apiErrorMessage, todayISO } from "@framework"

definePageMeta({
  layout: 'default',
  title: 'Finance',
  module: 'finance',
})

useHead({ title: 'Finance' })

const api = useApi()
const notify = useNotify()

const companyId = ref<number | null>(null)
const loading = ref(false)

const periods = ref<any[]>([])
const draftCount = ref(0)
const pendingCount = ref(0)
const failedEvents = ref(0)
const trialBalance = ref<any>(null)

const currentPeriod = computed(() => {
  /*
  | `todayISO()`, bukan `new Date().toISOString().slice(0, 10)`.
  |
  | Yang kedua memberi tanggal **UTC**: di WIB, mulai pukul 07:00 sore
  | ia masih menyebut hari kemarin. Pada tanggal 1 itu berarti kartu
  | ini menampilkan periode akuntansi bulan lalu sepanjang malam —
  | periode yang mungkin sudah ditutup — tanpa satu pun penanda bahwa
  | yang ditunjuk bukan periode berjalan.
  */
  const today = todayISO()

  return periods.value.find(
    (period: any) => period.start_date <= today && period.end_date >= today,
  ) ?? null
})

function statusVariant(status: string) {
  if (status === "open")
    return "secondary"

  if (status === "soft_closed")
    return "outline"

  return "destructive"
}

async function count(path: string, query: Record<string, any>) {
  const response = await api.request<any>(path, { query })

  /* Envelope daftar di ERP ini `{data, meta}` — `meta.count`, bukan
   * `count` di tingkat teratas. Halaman yang menebak `results` gagal
   * diam-diam dengan nol. */
  return response?.meta?.count ?? response?.data?.length ?? 0
}

async function load() {
  if (!companyId.value)
    return

  loading.value = true

  try {
    const periodResponse = await api.request<any>(
      "/finance/accounting-periods/",
      { query: { page_size: 100 } },
    )

    periods.value = (periodResponse?.data ?? []).filter(
      (row: any) => row.company === companyId.value,
    )

    draftCount.value = await count("/finance/journals/", {
      company: companyId.value,
      status: "draft",
      date_from: "1900-01-01",
      date_to: "2999-12-31",
    })

    pendingCount.value = await count("/finance/journals/", {
      company: companyId.value,
      status: "submitted",
      date_from: "1900-01-01",
      date_to: "2999-12-31",
    })

    failedEvents.value = await count("/finance/accounting-events/", {
      company: companyId.value,
      status: "failed",
    })

    if (currentPeriod.value) {
      const tb = await api.request<any>("/finance/reports/trial-balance/", {
        query: {
          company_id: companyId.value,
          period_id: currentPeriod.value.id,
        },
      })

      trialBalance.value = tb?.data ?? null
    }
    else {
      trialBalance.value = null
    }
  }
  catch (error: any) {
    notify.error(apiErrorMessage(error))
  }
  finally {
    loading.value = false
  }
}

watch(companyId, load)
</script>

<template>
  <div class="space-y-6 p-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 class="text-2xl font-semibold">
          Finance
        </h2>
        <p class="text-muted-foreground">
          Buku besar, jurnal, dan keadaan periode berjalan.
        </p>
      </div>

      <MLookupSelect
        v-model="companyId"
        label="Company"
        endpoint="/administration/organization/lookup/companies/"
        value-key="value"
        label-key="label"
        class="max-w-xs"
      />
    </div>

    <p v-if="!companyId" class="text-sm text-muted-foreground">
      Pilih perusahaan untuk melihat ringkasannya.
    </p>

    <template v-else>
      <div class="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Current Period</CardDescription>
            <CardTitle class="text-lg">
              {{ currentPeriod?.code ?? "—" }}
            </CardTitle>
          </CardHeader>
          <CardContent v-if="currentPeriod">
            <Badge :variant="statusVariant(currentPeriod.status)">
              {{ currentPeriod.status_label }}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Draft Journals</CardDescription>
            <CardTitle class="text-lg">{{ draftCount }}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Pending Approval</CardDescription>
            <CardTitle class="text-lg">{{ pendingCount }}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Failed Events</CardDescription>
            <CardTitle
              class="text-lg"
              :class="failedEvents ? 'text-destructive' : ''"
            >
              {{ failedEvents }}
            </CardTitle>
          </CardHeader>
          <CardContent v-if="failedEvents">
            <NuxtLink
              to="/finance/accounting-events?status=failed"
              class="text-xs underline"
            >
              Lihat dan proses ulang
            </NuxtLink>
          </CardContent>
        </Card>
      </div>

      <Card v-if="trialBalance">
        <CardHeader>
          <CardTitle class="text-base">
            Trial Balance — {{ currentPeriod?.name }}
          </CardTitle>
          <CardDescription>
            {{ trialBalance.rows.length }} account(s) with movement
          </CardDescription>
        </CardHeader>

        <CardContent class="flex flex-wrap items-center gap-8">
          <div>
            <p class="text-xs text-muted-foreground">Total Debit</p>
            <p class="text-xl font-semibold tabular-nums">
              {{ Number(trialBalance.totals.debit).toLocaleString("id-ID") }}
            </p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Total Credit</p>
            <p class="text-xl font-semibold tabular-nums">
              {{ Number(trialBalance.totals.credit).toLocaleString("id-ID") }}
            </p>
          </div>

          <!-- Keseimbangan dinyatakan, bukan diserahkan pada pembaca
               yang membandingkan dua angka di sebelahnya. -->
          <Badge :variant="trialBalance.is_balanced ? 'secondary' : 'destructive'">
            {{ trialBalance.is_balanced ? "Balanced" : "Out of balance" }}
          </Badge>

          <NuxtLink to="/finance/trial-balance" class="ml-auto text-sm underline">
            Buka Trial Balance
          </NuxtLink>
        </CardContent>
      </Card>

      <p v-else-if="!loading" class="text-sm text-muted-foreground">
        Belum ada periode akuntansi yang memuat hari ini untuk perusahaan
        ini. Buat tahun bukunya di Finance → Setup → Fiscal Years.
      </p>
    </template>
  </div>
</template>
