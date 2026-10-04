import { useApi } from '@/composables/useApi'

/**
 * Endpoint Help Center sisi pembaca.
 *
 * Terpisah dari modul CRUD hasil generate
 * (`administration/help-articles`, `administration/help-categories`):
 * yang itu layar penulis, yang ini layar pembaca. Keduanya menyentuh
 * tabel yang sama tapi aturannya berbeda — portal hanya mengembalikan
 * artikel yang sudah terbit dan yang boleh dibaca role pengguna.
 *
 * Ditulis tangan, jadi **tidak** ikut tertimpa saat modul admin-nya
 * diregenerate.
 */
export function useHelpCenter() {
  const { request } = useApi()

  /** Seluruh isi Help Center dalam satu request. */
  function getPortal(query: Record<string, any> = {}) {
    return request('/api/helpcenter/portal/', {
      method: 'GET',
      query,
    })
  }

  function getArticle(slug: string) {
    return request(`/api/helpcenter/portal/articles/${slug}/`, {
      method: 'GET',
    })
  }

  function search(q: string) {
    return request('/api/helpcenter/portal/search/', {
      method: 'GET',
      query: { q },
    })
  }

  /** Panduan untuk layar yang sedang/baru saja dibuka pengguna. */
  function getContextual(route: string) {
    return request('/api/helpcenter/portal/contextual/', {
      method: 'GET',
      query: { route },
    })
  }

  function sendFeedback(
    slug: string,
    payload: { is_helpful: boolean, comment?: string },
  ) {
    return request(`/api/helpcenter/portal/articles/${slug}/feedback/`, {
      method: 'POST',
      body: payload,
    })
  }

  return {
    getPortal,
    getArticle,
    search,
    getContextual,
    sendFeedback,
  }
}
