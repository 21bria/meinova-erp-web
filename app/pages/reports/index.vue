<script setup lang="ts">
import { MasterHub } from '~/features/master-hub'

import { reportsCategories, reportsItems } from '~/registry/section-hub/reports'

definePageMeta({
  layout: 'default',
  title: 'Reports',
  module: 'reports',
})

useHead({
  title: 'Reports',
})
</script>

<template>
  <div class="p-4 md:p-6">
    <MasterHub
      title="Reports"
      description="Laporan manajemen lintas modul. Seluruhnya hanya membaca data."
      search-placeholder="Cari laporan"
      all-category-label="All Reports"
      item-noun="report"
      item-noun-plural="reports"
      empty-title="Tidak ada laporan yang cocok"
      empty-description="Coba kata lain, atau pilih kategori yang berbeda."
      :categories="reportsCategories"
      :items="reportsItems"
    />
  </div>
</template>
