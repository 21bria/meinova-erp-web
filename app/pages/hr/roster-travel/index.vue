<script setup lang="ts">
import { MasterHub } from '~/features/master-hub'

import {
  hrRosterTravelCategories,
  hrRosterTravelItems,
} from '~/registry/section-hub/hr-roster-travel'

definePageMeta({
  title: 'Roster & Travel',
  module: 'hr',
})

useHead({
  title: 'Roster & Travel',
})
</script>

<template>
  <div class="p-4 md:p-6">
    <MasterHub
      title="Roster & Travel"
      description="Jadwal kerja site, pengajuan kepulangan, dan perjalanan dinas pegawai."
      search-placeholder="Cari layar"
      all-category-label="All Screens"
      item-noun="screen"
      item-noun-plural="screens"
      empty-title="Tidak ada layar yang cocok"
      empty-description="Coba kata lain, atau pilih kategori yang berbeda."
      :categories="hrRosterTravelCategories"
      :items="hrRosterTravelItems"
    />
  </div>
</template>
