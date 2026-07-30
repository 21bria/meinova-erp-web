<script setup lang="ts">
import {
  Activity,
  Building2,
  Database,
  MapPin,
  Network,
  TrendingUp,
  Users,
} from 'lucide-vue-next'
import {
  configurationHealth,
  kpiCards,
  organizationOverview,
  recentActivities,
  recentAuditLogs,
} from './data'

const iconMap = {
  Building2,
  Network,
  MapPin,
  Users,
  Database,
  Activity,
}


</script>

<template>
  <div class="w-full max-w-full overflow-x-hidden space-y-4 p-4 sm:space-y-6 sm:p-6">
    <section class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">
          Administration Dashboard
        </h1>
        <p class="text-muted-foreground">
          Monitor organization setup, references, security, workflows and system activity.
        </p>
      </div>

      <div class="rounded-lg border px-4 py-2 text-sm text-muted-foreground">
        Today · 08 Jul 2026
      </div>
    </section>

    <section class="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
      <Card v-for="item in kpiCards" :key="item.label" class="min-w-0">
        <CardHeader class="space-y-0 p-4 sm:p-5">
            <div class="flex items-center justify-between">
            <div class="rounded-xl bg-primary/10 p-1 text-primary">
                <component :is="iconMap[item.icon]" class="size-6" />
            </div>

            <div class="flex items-center gap-1 text-xs text-emerald-600">
                <TrendingUp class="size-3" />
                {{ item.trend }}
            </div>
            </div>

            <div>
            <CardDescription>{{ item.label }}</CardDescription>
            <CardTitle class="mt-1 text-xl sm:text-2xl">{{ item.value }}</CardTitle>
            <p class="mt-2 text-xs text-muted-foreground">
                {{ item.description }}
            </p>
            </div>
        </CardHeader>
        </Card>
    </section>

    <section class="grid min-w-0 gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card class="flex min-w-0 flex-col">
            <CardHeader class="p-4 sm:p-6">
                <CardTitle>Master Records Growth</CardTitle>
                <CardDescription>
                Dummy monthly growth of configured master data.
                </CardDescription>
            </CardHeader>

            <CardContent class="flex flex-1 items-end p-4 pt-0 sm:p-6 sm:pt-0">
                <div class="flex h-40 w-full items-end gap-2 sm:h-52 sm:gap-3 lg:h-56">
                <div
                    v-for="item in organizationOverview"
                    :key="item.name"
                    class="flex flex-1 flex-col items-center gap-2"
                    >
                    <div
                    class="w-full max-w-24 rounded-t-md bg-primary/80 transition-all duration-300 hover:bg-primary sm:max-w-26"
                    :style="{ height: `${Math.max(item.value * 2.4, 27)}px` }"
                    />

                    <span class="max-w-20 truncate text-center text-[10px] text-muted-foreground sm:text-xs">
                    {{ item.name }}
                    </span>
                </div>
                </div>
            </CardContent>
        </Card>

      <Card class="min-w-0">
        <CardHeader class="p-4 sm:p-6">
          <CardTitle>Configuration Health</CardTitle>
          <CardDescription>
            Current setup status across administration modules.
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-2 p-4 pt-0 sm:space-y-3 sm:p-6 sm:pt-0">
          <div
            v-for="item in configurationHealth"
            :key="item.name"
            class="flex min-w-0 items-center justify-between gap-3 rounded-lg border px-3 py-2"
          >
            <span class="min-w-0 truncate text-sm font-medium">{{ item.name }}</span>
            <span
              class="text-xs"
              :class="{
                'text-green-600': item.state === 'success',
                'text-yellow-600': item.state === 'warning',
                'text-red-600': item.state === 'danger',
              }"
            >
              {{ item.status }}
            </span>
          </div>
        </CardContent>
      </Card>
    </section>

    <section class="grid min-w-0 gap-4 xl:grid-cols-[1fr_1.5fr]">
      <Card class="min-w-0">
        <CardHeader class="p-4 sm:p-6">
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Latest administration actions.
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
          <div
            v-for="item in recentActivities"
            :key="item.title"
            class="flex min-w-0 items-start justify-between gap-4"
          >
            <div>
              <p class="truncate text-sm font-medium">
                {{ item.title }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{ item.module }}
              </p>
            </div>
            <span class="text-xs text-muted-foreground">{{ item.time }}</span>
          </div>
        </CardContent>
      </Card>

      <Card class="min-w-0">
        <CardHeader class="p-4 sm:p-6">
          <CardTitle>Recent Audit Logs</CardTitle>
          <CardDescription>
            Latest tracked system events.
          </CardDescription>
        </CardHeader>

        <CardContent class="p-4 pt-0 sm:p-6 sm:pt-0">
          <div class="overflow-x-auto rounded-lg border">
            <table class="min-w-[640px] w-full text-sm">
              <thead class="bg-muted/50 text-muted-foreground">
                <tr>
                  <th class="px-4 py-3 text-left font-medium">Time</th>
                  <th class="px-4 py-3 text-left font-medium">Module</th>
                  <th class="px-4 py-3 text-left font-medium">Action</th>
                  <th class="px-4 py-3 text-left font-medium">User</th>
                  <th class="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in recentAuditLogs"
                  :key="`${item.time}-${item.action}`"
                  class="border-t"
                >
                  <td class="px-4 py-3">{{ item.time }}</td>
                  <td class="px-4 py-3">{{ item.module }}</td>
                  <td class="px-4 py-3">{{ item.action }}</td>
                  <td class="px-4 py-3">{{ item.user }}</td>
                  <td class="px-4 py-3 text-green-600">{{ item.status }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
</template>