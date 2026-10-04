/*
 * Penyaring bersama Trial Balance dan Account Ledger.
 *
 * Satu composable untuk dua layar, dan itu disengaja: tombol filter
 * yang sama harus berarti hal yang sama di keduanya, dan dua penafsir
 * yang terpisah adalah cara membuat drill-down dari Trial Balance ke
 * Account Ledger mendarat pada angka yang berbeda. Sisi backend memakai
 * satu serializer untuk alasan yang sama persis.
 */
import { computed, reactive } from "vue"

export type LedgerFilterState = {
  company_id: number | null
  fiscal_year_id: number | null
  period_id: number | null
  date_from: string | null
  date_to: string | null
  account_id: number | null
  account_root_id: number | null
  account_type: string | null
  location_id: number | null
  department_id: number | null
  cost_center_id: number | null
  include_zero: boolean
}

function emptyState(): LedgerFilterState {
  return {
    company_id: null,
    fiscal_year_id: null,
    period_id: null,
    date_from: null,
    date_to: null,
    account_id: null,
    account_root_id: null,
    account_type: null,
    location_id: null,
    department_id: null,
    cost_center_id: null,
    include_zero: false,
  }
}

export function useLedgerFilters(initial: Partial<LedgerFilterState> = {}) {
  const state = reactive<LedgerFilterState>({
    ...emptyState(),
    ...initial,
  })

  /*
   * Backend menuntut **salah satu** dari periode, tahun buku, atau
   * rentang tanggal — neraca saldo tanpa batas waktu menjumlahkan
   * seluruh riwayat pembukuan dan tidak menjawab pertanyaan siapa pun.
   *
   * Dinilai di sini supaya tombolnya mati sebelum request dikirim,
   * bukan supaya penolakannya muncul sebagai error merah setelahnya.
   */
  const isReady = computed(() => {
    if (!state.company_id)
      return false

    return Boolean(
      state.period_id
      || state.fiscal_year_id
      || (state.date_from && state.date_to),
    )
  })

  const missingReason = computed(() => {
    if (!state.company_id)
      return "Pilih perusahaan lebih dulu."

    if (!isReady.value)
      return "Pilih periode, tahun buku, atau rentang tanggal."

    return null
  })

  /*
   * Kunci yang kosong **tidak dikirim sama sekali**.
   *
   * `useApi().cleanQuery` sudah membuang null dan string kosong, tapi
   * menyusunnya di sini membuat query yang dikirim terbaca apa adanya
   * di tab Network — dan filter yang menyempit tanpa ada yang
   * memilihnya adalah bug yang paling sulit dilihat dari layar.
   */
  const query = computed(() => {
    const out: Record<string, any> = {}

    for (const [key, value] of Object.entries(state)) {
      if (value === null || value === "" || value === false)
        continue

      out[key] = value
    }

    return out
  })

  function reset() {
    Object.assign(state, emptyState())
  }

  /*
   * Mengganti tahun buku membuang periode yang dipilih.
   *
   * Tanpa ini, periode milik tahun buku lama tetap menempel dan
   * laporannya diam-diam menampilkan bulan dari tahun yang tidak lagi
   * dipilih siapa pun — periode menang atas tahun buku di sisi backend,
   * jadi yang terbaca justru pilihan yang sudah usang.
   */
  function onFiscalYearChange() {
    state.period_id = null
  }

  /*
   * Mengganti perusahaan membuang **seluruh** pilihan yang terikat
   * padanya. Tahun buku, periode, akun, site, department, dan cost
   * center semuanya milik satu perusahaan; yang tertinggal akan
   * menyaring ke nol baris tanpa satu pun pesan.
   */
  function onCompanyChange() {
    state.fiscal_year_id = null
    state.period_id = null
    state.account_id = null
    state.account_root_id = null
    state.location_id = null
    state.department_id = null
    state.cost_center_id = null
  }

  return {
    state,
    query,
    isReady,
    missingReason,
    reset,
    onFiscalYearChange,
    onCompanyChange,
  }
}

/* Format uang untuk layar. Nol ditampilkan sebagai garis, bukan
 * "0,00": kolom neraca saldo yang penuh angka nol tidak bisa dibaca,
 * dan yang dicari mata justru baris yang ada isinya. */
export function money(value: string | number | null | undefined): string {
  const amount = Number(value ?? 0)

  if (!amount)
    return "—"

  return amount.toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
