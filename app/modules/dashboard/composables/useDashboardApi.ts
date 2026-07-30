import { useApi } from '@/composables/useApi'

export function useDashboardApi() {
  const { request } = useApi()

  async function getWidgets() {
    return await request('/api/administration/dashboard/widgets/', {
      method: 'GET',
    })
  }

  async function getLayout() {
    return await request('/api/administration/dashboard/layout/', {
      method: 'GET',
    })
  }

  async function getFavoriteApps() {
    return await request('/api/administration/dashboard/favorite-apps/', {
      method: 'GET',
    })
  }

  async function getFavoriteMenus() {
    return await request('/api/administration/dashboard/favorite-menus/', {
      method: 'GET',
    })
  }

  return {
    getWidgets,
    getLayout,
    getFavoriteApps,
    getFavoriteMenus,
  }
}