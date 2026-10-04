<script setup lang="ts">
/*
 * Panel Advanced Filter untuk dashboard/laporan.
 *
 * Pola yang sama dengan toolbar CRUD (`MCrudToolbar`): tombol berbadge
 * di kepala halaman, panel geser dari kanan, Reset di dalamnya. Ditulis
 * ulang di sini alih-alih memakai `MCrudToolbar` apa adanya karena yang
 * dirender berbeda — filter dashboard adalah `MLookupSelect` berjenjang
 * yang membaca `depends_on`/`lookup_params`, bukan `CrudFilter` — tapi
 * bentuk dan sebutannya sengaja dijaga sama persis. Orang yang sudah
 * hafal Advanced Filter di layar Employee tidak perlu belajar lagi di
 * layar laporan.
 *
 * Filternya **langsung berlaku saat dipilih**, tanpa tombol Apply.
 * Sengaja: `useDashboard` sudah memuat ulang tiap kali filter berubah,
 * dan menambahkan Apply berarti dua keadaan yang bisa berbeda — yang
 * terlihat di panel dan yang sedang dihitung — tanpa ada di layar yang
 * memberi tahu bedanya.
 */
import { ref } from "vue"

import type {
  DashboardLookupFilter,
} from "@framework/core/types/dashboard"

type FilterValue = string | number | number[] | null

defineProps<{
  filters: DashboardLookupFilter[]
  values: Record<string, FilterValue>
  activeCount?: number
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: "update:filter", key: string, value: FilterValue): void
  (e: "reset"): void
}>()

const open = ref(false)
</script>

<template>
  <Button
    type="button"
    variant="outline"
    class="h-9"
    :disabled="disabled"
    @click="open = true"
  >
    <Icon name="i-lucide-sliders-horizontal" class="mr-2 size-4" />
    Advanced Filter

    <Badge
      v-if="activeCount"
      variant="secondary"
      class="ml-2 px-1.5 tabular-nums"
    >
      {{ activeCount }}
    </Badge>
  </Button>

  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
      @click.self="open = false"
    >
      <aside
        class="ml-auto flex h-full w-full max-w-md flex-col border-l bg-background shadow-xl"
      >
        <div class="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 class="text-base font-semibold">
              Advanced Filter
            </h2>
            <p class="text-sm text-muted-foreground">
              Persempit laporan dengan kriteria yang lebih rinci.
            </p>
          </div>

          <Button variant="ghost" size="icon" @click="open = false">
            <Icon name="i-lucide-x" class="size-4" />
          </Button>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto p-5">
          <MDashboardFilters
            :lookup-filters="filters"
            :filters="values"
            layout="panel"
            @update:filter="(key, value) => emit('update:filter', key, value)"
          />
        </div>

        <div class="flex items-center justify-between gap-2 border-t px-5 py-4">
          <Button
            type="button"
            variant="ghost"
            @click="emit('reset')"
          >
            <Icon name="i-lucide-rotate-ccw" class="mr-2 size-4" />
            Reset
          </Button>

          <Button type="button" @click="open = false">
            Selesai
          </Button>
        </div>
      </aside>
    </div>
  </Teleport>
</template>
