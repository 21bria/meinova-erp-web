<script setup lang="ts">
import {
  computed,
  ref,
  type Component,
} from "vue"

import WorkCalendar from "./work-calendar/page.vue"
import Holiday from "./holiday/page.vue"
import RosterCrew from "./roster-crew/page.vue"

type CalendarItem = {
  value: string
  label: string
  description: string
  component: Component
}

type CalendarGroup = {
  value: string
  label: string
  items: CalendarItem[]
}

// Dua kelompok karena pemakainya memang beda: periode akuntansi dipakai
// Finance untuk menutup buku, pola kerja dipakai HR untuk absensi dan
// perhitungan hari cuti.
const groups: CalendarGroup[] = [
  {
    value: "work-pattern",
    label: "Work Pattern",
    items: [
      {
        value: "work-calendars",
        label: "Work Calendar",
        description:
          "Hari kerja mingguan per company/location. Dipakai menghitung "
          + "hari cuti pegawai non-roster.",
        component: WorkCalendar,
      },
      {
        value: "holidays",
        label: "Holiday",
        description:
          "Hari libur nasional dan libur khusus lokasi. Tidak memotong "
          + "saldo cuti.",
        component: Holiday,
      },
      {
        value: "roster-crews",
        label: "Roster Crew",
        description:
          "Gelombang rotasi pegawai site beserta tanggal mulai siklusnya "
          + "— titik jangkar pola 6 minggu on / 2 minggu off.",
        component: RosterCrew,
      },
    ],
  },
]

// Kelompok "Accounting Period" **tidak lagi di sini.** Tahun buku dan
// periode akuntansi pindah ke Finance bersama kepemilikan modelnya —
// layarnya sekarang di `/finance/fiscal-years` dan
// `/finance/accounting-periods`, dan endpoint lamanya di
// `/api/administration/calendar/` sudah tidak ada.
//
// Yang tinggal di kalender ini pola kerja dan hari libur: kapan orang
// bekerja. Kapan sebuah transaksi boleh dibukukan pertanyaan yang
// berbeda, dan jawabannya sekarang punya satu rumah.

const firstGroup = groups[0]!

const activeGroup = ref<CalendarGroup["value"]>(firstGroup.value)
const activeTab = ref(firstGroup.items[0]?.value ?? "")

const currentGroup = computed<CalendarGroup>(() => {
  return (
    groups.find(group => group.value === activeGroup.value)
    ?? firstGroup
  )
})

const currentItems = computed<CalendarItem[]>(() => {
  return currentGroup.value.items
})

const currentItem = computed<CalendarItem | null>(() => {
  return (
    currentItems.value.find(item => item.value === activeTab.value)
    ?? currentItems.value[0]
    ?? null
  )
})

function selectGroup(value: CalendarGroup["value"]) {
  activeGroup.value = value

  const group = groups.find(item => item.value === value)

  activeTab.value = group?.items[0]?.value ?? ""
}
</script>

<template>
  <main class="mx-auto max-w-screen-2xl px-0 py-0">
    <section class="mb-6 flex flex-col gap-1">
      <h1 class="text-2xl font-normal tracking-tight">
        Calendar
      </h1>

      <p class="max-w-3xl text-muted-foreground">
        Kalender kerja, hari libur, dan gelombang roster yang dipakai
        modul HR untuk absensi dan perhitungan hari cuti — plus periode
        akuntansi yang dipakai Finance.
      </p>
    </section>

    <div class="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside class="space-y-1 py-1">
        <button
          v-for="group in groups"
          :key="group.value"
          type="button"
          class="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition hover:bg-muted/70"
          :class="
            activeGroup === group.value
              ? 'bg-muted font-medium text-foreground'
              : 'text-muted-foreground'
          "
          @click="selectGroup(group.value)"
        >
          {{ group.label }}
        </button>
      </aside>

      <section class="min-w-0">
        <Tabs
          v-if="currentItems.length"
          v-model="activeTab"
          class="w-full"
        >
          <div class="mb-6 overflow-x-auto border-b">
            <TabsList
              class="inline-flex h-auto w-fit justify-start bg-transparent p-0"
            >
              <TabsTrigger
                v-for="tab in currentItems"
                :key="tab.value"
                :value="tab.value"
                class="shrink-0 rounded-none border-b-2 border-transparent px-5 py-3 text-sm font-medium whitespace-nowrap text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                {{ tab.label }}
              </TabsTrigger>
            </TabsList>
          </div>

          <p
            v-if="currentItem"
            class="mb-4 max-w-3xl text-sm text-muted-foreground"
          >
            {{ currentItem.description }}
          </p>

          <component
            v-if="currentItem"
            :is="currentItem.component"
          />
        </Tabs>

        <div
          v-else
          class="rounded-xl border border-dashed p-8 text-sm text-muted-foreground"
        >
          Belum ada data kalender untuk kelompok ini.
        </div>
      </section>
    </div>
  </main>
</template>
