<script setup lang="ts">
import type { SelfErrorCode } from '../types'

/**
 * Keadaan non-data: memuat, dan empat sebab kegagalan yang berbeda.
 *
 * **Teks galat mentah dari backend tidak pernah jadi UX utama.**
 * Kalimat yang dilihat orang ditulis di katalog i18n; `code` dari
 * backend cuma memilih kalimat mana. Itu yang membuat satu perbaikan
 * tata bahasa di Django tidak mengubah apa yang dibaca pegawai, dan
 * yang membuat halaman ini bisa berbahasa Indonesia maupun Inggris.
 *
 * Keempatnya dibedakan karena yang harus dilakukan orangnya memang
 * berbeda: akun yang belum ditautkan menghubungi HR, pegawai nonaktif
 * menghubungi HR dengan pertanyaan lain, yang belum login masuk lagi,
 * dan gangguan jaringan cukup dicoba ulang.
 */
import { RefreshCw } from 'lucide-vue-next'

defineProps<{
  pending: boolean
  code?: SelfErrorCode | null
}>()

defineEmits<{ retry: [] }>()

const MESSAGE_KEY: Record<SelfErrorCode, string> = {
  employee_not_linked: 'me.states.notLinked',
  employee_inactive: 'me.states.inactive',
  avatar_not_set: 'me.states.genericError',
  avatar_unavailable: 'me.states.genericError',
  not_authenticated: 'me.states.notAuthenticated',
  unknown: 'me.states.genericError',
}

function messageKey(code: SelfErrorCode) {
  return MESSAGE_KEY[code] ?? 'me.states.genericError'
}

/** Gangguan boleh dicoba lagi; keadaan yang perlu HR tidak. */
const RETRYABLE: SelfErrorCode[] = ['unknown', 'not_authenticated']
</script>

<template>
  <div v-if="pending" class="space-y-6" data-testid="self-loading">
    <Card>
      <CardContent class="flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
        <Skeleton class="size-16 shrink-0 rounded-xl sm:size-20" />

        <div class="w-full space-y-2">
          <Skeleton class="h-5 w-48 max-w-full" />
          <Skeleton class="h-4 w-32 max-w-full" />
        </div>
      </CardContent>
    </Card>

    <Card v-for="n in 2" :key="n">
      <CardContent class="space-y-3 py-6">
        <Skeleton class="h-4 w-40 max-w-full" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-2/3" />
      </CardContent>
    </Card>
  </div>

  <Card v-else-if="code" data-testid="self-error">
    <CardContent class="py-10">
      <Empty class="border-0">
        <EmptyHeader>
          <EmptyTitle>{{ $t('me.states.unavailable') }}</EmptyTitle>

          <EmptyDescription>{{ $t(messageKey(code)) }}</EmptyDescription>
        </EmptyHeader>

        <EmptyContent v-if="RETRYABLE.includes(code)">
          <Button variant="outline" size="sm" @click="$emit('retry')">
            <RefreshCw class="mr-2 size-4" aria-hidden="true" />
            {{ $t('me.actions.retry') }}
          </Button>
        </EmptyContent>
      </Empty>
    </CardContent>
  </Card>
</template>
