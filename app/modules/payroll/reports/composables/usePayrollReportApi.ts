import { useApi } from '@/composables/useApi'

/**
 * Endpoint laporan payroll.
 *
 * Rekapnya dihitung backend (`.../summary/`), bukan di sini: satu run
 * 500 pegawai punya ribuan baris komponen, dan menjumlahkannya di
 * browser berarti mengirim seluruhnya lebih dulu.
 */
export function usePayrollReportApi() {
  const { request } = useApi()

  function getRuns(query: Record<string, any> = {}) {
    return request('/api/payroll/payroll-runs/', {
      method: 'GET',
      query,
    })
  }

  function getRunSummary(runId: number | string) {
    return request(`/api/payroll/payroll-runs/${runId}/summary/`, {
      method: 'GET',
    })
  }

  return {
    getRuns,
    getRunSummary,
  }
}
