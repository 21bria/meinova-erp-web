import type { MaybeRefOrGetter } from 'vue'

import { apiErrorMessage } from '@framework'

import { useApi } from '@/composables/useApi'

import { rowsOf } from './model'

/*
| Muat daftar read-only untuk panel detail aset (riwayat, dokumen).
|
| `reloadKey` diawasi: panel ikut memuat ulang sesudah aksi record
| (Activate, Record Condition, Complete) menyegarkan record induknya —
| tanpa itu riwayat tertinggal satu langkah dari kartu di atasnya.
|
| 403/404 dari backend (tidak berwenang, atau di luar cakupan) tidak
| dilempar ke layar sebagai galat merah: panelnya kosong dengan pesan,
| karena backend memang yang memutuskan siapa boleh melihat apa.
*/
export function useAssetRows<T>(
  endpoint: MaybeRefOrGetter<string | null>,
  query: MaybeRefOrGetter<Record<string, unknown>> = {},
  reloadKey: MaybeRefOrGetter<unknown> = null,
) {
  const api = useApi()

  const rows = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)
  const error = ref<string | null>(null)
  const forbidden = ref(false)

  async function load() {
    const path = toValue(endpoint)

    if (!path)
      return

    loading.value = true
    error.value = null
    forbidden.value = false

    try {
      const response = await api.request<any>(path, { query: toValue(query) })

      rows.value = rowsOf<T>(response)
    }
    catch (err: any) {
      rows.value = []

      const status = err?.statusCode ?? err?.status ?? err?.response?.status

      if (status === 403 || status === 404)
        forbidden.value = true
      else
        error.value = apiErrorMessage(err)
    }
    finally {
      loading.value = false
    }
  }

  watch(
    () => [toValue(endpoint), JSON.stringify(toValue(query)), toValue(reloadKey)],
    () => load(),
    { immediate: true },
  )

  return { rows, loading, error, forbidden, load }
}
