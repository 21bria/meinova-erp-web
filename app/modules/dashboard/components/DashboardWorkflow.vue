<script setup lang="ts">
import type { WorkflowItem } from '../types'

/**
 * Dokumen terakhir yang melibatkan pengguna, versi kolom sempit.
 *
 * Barisnya rapat dan **tanpa kartu di dalam kartu**: kotak berbingkai
 * untuk tiap dokumen di dalam kolom selebar 320px menyisakan ruang
 * teks selebar setengahnya, dan judul dokumen ERP jarang yang pendek.
 *
 * Datanya, tautannya, dan urutannya tidak berubah sedikit pun dari
 * versi kartu besar sebelumnya.
 */
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    items: WorkflowItem[]
    /**
     * Lima baris, bukan sepuluh yang dikirim backend.
     *
     * Kartu ini satu-satunya yang terbuka secara bawaan; sepuluh baris
     * membuatnya lebih tinggi daripada panel aplikasi di sebelahnya,
     * dan yang mencari dokumen lama memang butuh filter — yang ada di
     * "View all", bukan di sini.
     */
    limit?: number
  }>(),
  { limit: 5 },
)

const visibleItems = computed(() => props.items.slice(0, props.limit))

const { t, te } = useI18n()

/**
 * Dokumen yang sudah berhenti tidak boleh terlihat seperti masih
 * menunggu — badge abu-abu yang sama untuk "Pending" dan "Rejected"
 * membuat orang mengira masih ada yang harus menekan tombol.
 *
 * Dicocokkan dengan **kode** status, bukan labelnya: begitu labelnya
 * diterjemahkan, `status === 'Approved'` tidak pernah benar lagi dalam
 * bahasa Indonesia dan seluruh badge jatuh ke abu-abu.
 */
function badgeVariant(code: string) {
  if (code === 'approved')
    return 'default'

  if (code === 'rejected' || code === 'cancelled')
    return 'destructive'

  return 'secondary'
}

/** Label status: kode yang diterjemahkan, label backend sebagai cadangan. */
function statusLabel(item: WorkflowItem) {
  const key = `common.status.${item.status_code}`

  return te(key) ? t(key) : item.status
}
</script>

<template>
  <div>
    <ul v-if="visibleItems.length" class="divide-y">
      <li v-for="item in visibleItems" :key="item.id">
        <NuxtLink
          :to="`/workflow/instances/${item.id}`"
          class="flex items-start gap-2 py-2 transition-colors hover:text-foreground"
        >
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm font-medium">
              {{ item.title }}
            </span>

            <span class="mt-0.5 block truncate text-xs text-muted-foreground">
              {{ item.module }} · {{ item.requester }} · {{ item.created_at }}
            </span>
          </span>

          <Badge
            :variant="badgeVariant(item.status_code)"
            class="shrink-0 px-1.5 text-[11px] font-normal"
          >
            {{ statusLabel(item) }}
          </Badge>
        </NuxtLink>
      </li>
    </ul>

    <p v-else class="py-4 text-center text-xs text-muted-foreground">
      {{ $t('home.documents.empty') }}
    </p>

    <div v-if="items.length" class="mt-1 flex justify-end border-t pt-2">
      <!--
        Tautan ke daftar penuh, bukan sekadar menambah baris di
        kartunya: yang mencari dokumen lama butuh filter dan pencarian,
        dan itu sudah ada di layar Running Documents.
      -->
      <NuxtLink
        to="/workflow/instances"
        class="text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        {{ $t('home.utility.viewAll') }}
      </NuxtLink>
    </div>
  </div>
</template>
