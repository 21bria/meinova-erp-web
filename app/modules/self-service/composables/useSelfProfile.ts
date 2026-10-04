import type { SelfError, SelfProfile } from '../types'

import { useApi } from '@/composables/useApi'
import { fetchSelfProfile, toSelfError } from '../api/client'

/**
 * Data layar **My Profile** (`/me/profile`).
 *
 * Read-only sepenuhnya, dan itu bukan tombol Save yang disembunyikan:
 * `/api/me/profile/` memang hanya melayani GET.
 *
 * Susunan layarnya **tidak** dibaca dari `ui-schema` seperti layar lama.
 * Itu perbedaan yang disengaja: schema adalah tata letak administratif
 * HR, dan mengikatkan halaman pribadi seseorang padanya berarti setiap
 * kolom yang dipindah HR antar tab ikut menggeser halaman ini. Kontrak
 * Stage 4 sudah berbentuk seksi; yang perlu dilakukan di sini cuma
 * menampilkannya.
 */
export function useSelfProfile() {
  const { request } = useApi()

  const profile = ref<SelfProfile | null>(null)
  const pending = ref(false)
  const error = ref<SelfError | null>(null)

  async function load() {
    pending.value = true
    error.value = null

    try {
      profile.value = await fetchSelfProfile(request)
    }
    catch (caught: unknown) {
      error.value = toSelfError(caught)
      profile.value = null
    }
    finally {
      pending.value = false
    }
  }

  return { profile, pending, error, load }
}
