import { useApi } from '@/composables/useApi'

/**
 * Endpoint engine approval.
 *
 * Satu kotak masuk untuk semua modul — approver tidak boleh harus
 * membuka layar Cuti untuk menyetujui cuti dan layar Travel Request
 * untuk menyetujui TR. Yang membedakan cuma `module`/`document_type`
 * sebagai filter.
 */
export function useWorkflowApi() {
  const { request } = useApi()

  function getInbox(query: Record<string, any> = {}) {
    return request('/api/workflow/approvals/inbox/', {
      method: 'GET',
      query,
    })
  }

  function getSummary() {
    return request('/api/workflow/approvals/summary/', {
      method: 'GET',
    })
  }

  function getMySubmissions(query: Record<string, any> = {}) {
    return request('/api/workflow/instances/my-submissions/', {
      method: 'GET',
      query,
    })
  }

  function getInstances(query: Record<string, any> = {}) {
    return request('/api/workflow/instances/', {
      method: 'GET',
      query,
    })
  }

  function getTrail(instanceId: number | string) {
    return request(`/api/workflow/instances/${instanceId}/trail/`, {
      method: 'GET',
    })
  }

  function getDefinitions(query: Record<string, any> = {}) {
    return request('/api/workflow/definitions/', {
      method: 'GET',
      query,
    })
  }

  function getDelegations(query: Record<string, any> = {}) {
    return request('/api/workflow/delegations/', {
      method: 'GET',
      query,
    })
  }

  /**
   * `decision` = approve | reject | return.
   *
   * Ketiganya menembak endpoint baris keputusan, bukan endpoint
   * dokumen — dari kotak masuk kita memang memutuskan satu kotak tanda
   * tangan, dan backend yang menentukan apakah dokumennya lanjut ke
   * step berikutnya atau berhenti.
   */
  function decide(
    approvalId: number | string,
    decision: 'approve' | 'reject' | 'return',
    comment = '',
  ) {
    return request(`/api/workflow/approvals/${approvalId}/${decision}/`, {
      method: 'POST',
      body: { comment },
    })
  }

  return {
    getInbox,
    getSummary,
    getMySubmissions,
    getInstances,
    getTrail,
    getDefinitions,
    getDelegations,
    decide,
  }
}
