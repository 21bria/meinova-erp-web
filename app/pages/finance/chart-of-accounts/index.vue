<script setup lang="ts">
/*
 * Rute ini **tidak** me-mount `page.vue` hasil generator langsung.
 *
 * §24 menuntut tampilan pohon: hierarki, pencarian, buka/tutup cabang,
 * buat akun anak, dan penanda jelas akun grup vs akun posting.
 * Generator `crud-dialog` menghasilkan tabel rata — bentuk yang benar
 * untuk mencari satu akun, dan tidak bisa menjawab "susunannya seperti
 * apa".
 *
 * `ChartOfAccountsScreen` membungkus keduanya dan memakai ulang tabel
 * generator apa adanya, jadi regenerate module ini tetap aman.
 */
import ChartOfAccountsScreen from '~/modules/finance/chart-of-accounts/tree/ChartOfAccountsScreen.vue'

definePageMeta({
  layout: 'default',
  title: 'Chart of Accounts',
  module: 'finance',
})

useHead({ title: 'Chart of Accounts' })
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <ChartOfAccountsScreen />
    </div>
  </div>
</template>
