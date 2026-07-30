import { dashboardDummy } from '../dummy'
import { mapFavoriteApps, mapFavoriteMenus } from '../mapper'
import { useDashboardApi } from './useDashboardApi'

export function useDashboard() {
  const {
    getWidgets,
    getLayout,
    getFavoriteApps,
    getFavoriteMenus,
  } = useDashboardApi()

  const isLoading = ref(false)
  const isCustomizing = ref(false)
  const error = ref<string | null>(null)

  const widgets = ref<any[]>([])
  const layout = ref<any[]>([])

  const workspace = ref({
    kpis: [...dashboardDummy.kpis],
    charts: [...dashboardDummy.charts],

    favoriteMenus: [] as any[],
    favoriteApps: [] as any[],

    quickActions: [...dashboardDummy.quickActions],
    notifications: [...dashboardDummy.notifications],
    workflows: [...dashboardDummy.workflows],
  })

  const favoriteApps = computed(() =>
    workspace.value.favoriteApps
      .filter(item => item.favorite !== false)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
  )

  const favoriteMenus = computed(() =>
    workspace.value.favoriteMenus
      .filter(item => item.is_visible !== false)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
  )

  async function loadDashboard() {
    isLoading.value = true
    error.value = null

    try {
      const [
        widgetsRes,
        layoutRes,
        favoriteAppsRes,
        favoriteMenusRes,
      ] = await Promise.all([
        getWidgets(),
        getLayout(),
        getFavoriteApps(),
        getFavoriteMenus(),
      ])

      widgets.value = Array.isArray(widgetsRes) ? widgetsRes : []
      layout.value = Array.isArray(layoutRes) ? layoutRes : []

      workspace.value.favoriteApps = mapFavoriteApps(
        Array.isArray(favoriteAppsRes) ? favoriteAppsRes : [],
      )

      workspace.value.favoriteMenus = mapFavoriteMenus(
        Array.isArray(favoriteMenusRes) ? favoriteMenusRes : [],
      )
    }
    catch (err: any) {
      error.value = err?.message || 'Failed to load dashboard'
      console.error('load dashboard error', err)
    }
    finally {
      isLoading.value = false
    }
  }

  function saveWorkspace() {
    isCustomizing.value = false
    console.log('save workspace', workspace.value)
  }

  onMounted(loadDashboard)

  return {
    workspace,
    widgets,
    layout,
    favoriteApps,
    favoriteMenus,
    isLoading,
    isCustomizing,
    error,
    loadDashboard,
    saveWorkspace,
  }
}