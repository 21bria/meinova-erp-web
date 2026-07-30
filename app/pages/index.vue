<script setup lang="ts">
definePageMeta({
  showGlobalSearch: true,
})
import {
  Settings2
} from 'lucide-vue-next'

import {
  DashboardApplications,
  DashboardFavoriteMenus,
  DashboardHeader,
  DashboardInsights,
  DashboardKpi,
  DashboardNotifications,
  DashboardQuickActions,
  DashboardWorkflow,
} from '~/modules/dashboard/'
import { useDashboard } from "~/modules/dashboard/composables/useDashboard"
const {
  workspace,
  favoriteApps,
  isCustomizing,
  saveWorkspace,
} = useDashboard()
</script>

<template>
  <main class="mx-auto max-w-7xl space-y-6 px-6 py-8">
    <DashboardHeader>
      <div class="flex items-center gap-2">
        <Button v-if="isCustomizing" variant="outline" size="sm" @click="saveWorkspace">
          Save
        </Button>

        <Button  variant="ghost" size="sm" @click="isCustomizing = !isCustomizing">
           <Settings2 class="mr-2 h-4 w-4" />
          {{ isCustomizing ? 'Done' : 'Customize' }}
        </Button>
      </div>
    </DashboardHeader>

    <DashboardKpi :items="workspace.kpis" />
    <!-- <DashboardInsights :charts="workspace.charts" /> -->

    <DashboardFavoriteMenus
      v-model:items="workspace.favoriteMenus"
      :is-customizing="isCustomizing"
    />

    <DashboardQuickActions :items="workspace.quickActions" />

    <div class="grid gap-6 lg:grid-cols-2">
      <DashboardNotifications :items="workspace.notifications" />
      <DashboardWorkflow :items="workspace.workflows" />
    </div>

    <DashboardApplications
      v-model:items="workspace.favoriteApps"
      :is-customizing="isCustomizing"
    />
  </main>
</template>