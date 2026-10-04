import type { SelfError, SelfWorkspace } from '../types'

import { useApi } from '@/composables/useApi'
import { fetchSelfWorkspace, toSelfError } from '../api/client'

/**
 * Data layar **Ruang Kerja Saya** (`/me`).
 *
 * Satu permintaan untuk seluruh dashboard. Alternatifnya — satu
 * permintaan per kartu — akan membuat halaman ini menembak tujuh
 * endpoint domain, dan enam di antaranya adalah endpoint administratif
 * yang menerima `?employee=`. Sekali sebuah layar pribadi memanggilnya,
 * batas identitas Self Service berhenti bisa dijamin dari satu tempat.
 *
 * Read-only sepenuhnya: `/api/me/workspace/` hanya melayani GET.
 */
export function useSelfWorkspace() {
  const { request } = useApi()

  const workspace = ref<SelfWorkspace | null>(null)
  const pending = ref(false)
  const error = ref<SelfError | null>(null)

  async function load() {
    pending.value = true
    error.value = null

    try {
      workspace.value = await fetchSelfWorkspace(request)
    }
    catch (caught: unknown) {
      error.value = toSelfError(caught)
      workspace.value = null
    }
    finally {
      pending.value = false
    }
  }

  return { workspace, pending, error, load }
}
