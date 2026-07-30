<script setup lang="ts">
import {
  CalendarDays,
  ClipboardCheck,
  DollarSign,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-vue-next'

import { useHrDashboardDummy } from './composables/useHrDashboardDummy'

definePageMeta({
  layout: 'default',
})

const {
  statCards,
  attendanceMonthly,
  employeeByDivision,
  employeeByEducation,
  leaveRecap,
  recentSubmissions,
} = useHrDashboardDummy()

const statIconMap = [Users, ClipboardCheck, CalendarDays, ShieldCheck, TrendingDown, DollarSign]
const totalEmployee = computed(() => employeeByDivision.reduce((sum, item) => sum + item.value, 0))
const totalLeave = computed(() => leaveRecap.reduce((sum, item) => sum + item.count, 0))
const maxLeave = computed(() => Math.max(...leaveRecap.map(item => item.count), 1))

const attendanceCategories = computed(() => attendanceMonthly.map(item => item.label))
const attendanceSeries = computed(() => [
  {
    name: 'Kehadiran',
    data: attendanceMonthly.map(item => item.value),
  },
])

const divisionLabels = computed(() => employeeByDivision.map(item => item.label))
const divisionSeries = computed(() => employeeByDivision.map(item => item.value))

const educationCategories = computed(() => employeeByEducation.map(item => item.label))
const educationSeries = computed(() => [
  {
    name: 'Pegawai',
    data: employeeByEducation.map(item => item.value),
  },
])
</script>

<template>
  <div class="space-y-6 p-4 sm:p-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p class="text-sm font-medium text-primary">
          HR Dashboard
        </p>
        <h1 class="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Selamat pagi, Admin HR!
        </h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Berikut adalah ringkasan data SDM per 20 Mei 2024.
        </p>
      </div>

      <div class="flex items-center gap-2 rounded-xl border bg-card p-1.5 shadow-sm">
        <div class="px-3 text-sm text-muted-foreground">
          Periode
        </div>
        <Button variant="secondary" class="gap-2">
          Mei 2024
          <CalendarDays class="size-4" />
        </Button>
      </div>
    </div>

    <div class="-mx-3 flex snap-x gap-3 overflow-x-auto px-3 pb-2 sm:mx-0 sm:grid sm:min-w-0 sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 xl:grid-cols-6">
      <Card
        v-for="(stat, index) in statCards"
        :key="stat.label"
        class="min-w-[280px] snap-start overflow-hidden border-border/70 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:min-w-0"
      >
        <CardContent class="p-5">
          <div class="flex items-start justify-between gap-3">
            <div class="rounded-xl bg-primary/10 p-3 text-primary">
              <component :is="statIconMap[index] ?? Users" class="size-5" />
            </div>
            <Badge v-if="stat.trend" variant="secondary" class="gap-1">
              <TrendingUp v-if="stat.trend.direction === 'up'" class="size-3" />
              <TrendingDown v-else class="size-3" />
              {{ stat.trend.value }}%
            </Badge>
          </div>

          <div class="mt-5 space-y-1">
            <p class="text-sm text-muted-foreground">
              {{ stat.label }}
            </p>
            <h3 class="text-2xl font-semibold tracking-tight">
              {{ stat.value }}
            </h3>
            <p
              v-if="stat.trend"
              class="text-xs"
              :class="stat.trend.direction === 'up' ? 'text-emerald-600' : 'text-red-500'"
            >
              {{ stat.trend.direction === 'up' ? 'Naik' : 'Turun' }} {{ stat.trend.value }}% {{ stat.trend.period }}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 xl:grid-cols-5">
      <MChartCard title="Kehadiran Bulanan" class="xl:col-span-3">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-sm text-muted-foreground">
            Rata-rata kehadiran pegawai sepanjang tahun 2024.
          </p>
          <Badge variant="outline">Tahun 2024</Badge>
        </div>
        <MLineChart
          :series="attendanceSeries"
          :categories="attendanceCategories"
          :y-formatter="(v) => `${v}%`"
          :tooltip-formatter="(v) => `${v}%`"
        />
      </MChartCard>

      <MChartCard title="Distribusi Pegawai Berdasarkan Unit Kerja" class="xl:col-span-2">
        <MDonutChart
          :series="divisionSeries"
          :labels="divisionLabels"
        />
      </MChartCard>
    </div>

    <div class="grid gap-4 xl:grid-cols-6">
      <MChartCard title="Distribusi Pegawai Berdasarkan Jenjang Pendidikan" class="xl:col-span-2">
        <MBarChart
          :series="educationSeries"
          :categories="educationCategories"
        />
      </MChartCard>

      <Card class="xl:col-span-2">
        <CardHeader>
          <div class="flex items-start justify-between gap-3">
            <div>
              <CardTitle class="text-base">
                Rekap Cuti
              </CardTitle>
              <CardDescription>Mei 2024</CardDescription>
            </div>
            <Badge variant="secondary">
              {{ totalLeave }} Pengajuan
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-for="item in leaveRecap" :key="item.label" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">{{ item.label }}</span>
              <span class="font-medium">{{ item.count }}</span>
            </div>
            <div class="h-2 w-full rounded-full bg-muted">
              <div
                class="h-2 rounded-full bg-primary"
                :style="{ width: `${(item.count / maxLeave) * 100}%` }"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="xl:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between gap-3">
            <div>
              <CardTitle class="text-base">
                Pengajuan Terbaru
              </CardTitle>
              <CardDescription>Aktivitas approval HR terbaru</CardDescription>
            </div>
            <NuxtLink to="/hr/leave" class="text-sm font-medium text-primary hover:underline">
              Lihat Semua
            </NuxtLink>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div
            v-for="item in recentSubmissions"
            :key="item.id"
            class="flex items-center justify-between gap-3 rounded-lg border bg-background p-3 text-sm"
          >
            <div class="flex min-w-0 items-center gap-3">
              <Avatar class="size-9">
                <AvatarImage v-if="item.avatarUrl" :src="item.avatarUrl" />
                <AvatarFallback>{{ item.name.charAt(0) }}</AvatarFallback>
              </Avatar>
              <div class="min-w-0">
                <p class="truncate font-medium">
                  {{ item.name }}
                </p>
                <p class="truncate text-xs text-muted-foreground">
                  {{ item.type }} · {{ item.date }}
                </p>
              </div>
            </div>
            <Badge :variant="item.status === 'approved' ? 'default' : 'secondary'">
              {{ item.status === 'approved' ? 'Disetujui' : 'Menunggu' }}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>