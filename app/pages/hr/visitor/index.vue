<script setup lang="ts">
import { MasterHub } from '~/features/master-hub'

import {
  hrVisitorCategories,
  hrVisitorItems,
} from '~/registry/section-hub/hr-visitor'

definePageMeta({
  title: 'Visitor',
  module: 'hr',
})

useHead({
  title: 'Visitor',
})
</script>

<template>
  <div class="p-4 md:p-6">
    <MasterHub
      title="Visitor Management"
      description="Kunjungan tamu ke kantor dan site — pengajuan, kedatangan, dan kartu tamu."
      search-placeholder="Cari layar"
      all-category-label="All Screens"
      item-noun="screen"
      item-noun-plural="screens"
      empty-title="Tidak ada layar yang cocok"
      empty-description="Coba kata lain, atau pilih kategori yang berbeda."
      :categories="hrVisitorCategories"
      :items="hrVisitorItems"
    />
  </div>
</template>
