<script setup lang="ts">
import type { SelfRequests } from '../types'

/**
 * Dua angka dari engine workflow, dan keduanya menjawab pertanyaan yang
 * berbeda:
 *
 *   Perlu Tindakan   — dokumen orang lain yang menunggu **tanda tangan saya**
 *   Permintaan Saya  — dokumen saya sendiri yang masih berjalan
 *
 * Menjumlahkannya jadi satu angka "2 permintaan" adalah cara tercepat
 * membuat approver mengira ia sedang menunggu dirinya sendiri.
 *
 * Karena itu kartu ini punya **dua** tombol, dan `WorkspaceCard` cuma
 * menampung satu. Rangkanya karena itu ditulis ulang di sini — satu
 * satunya kartu yang begitu, dan bentuknya sengaja dijaga identik:
 * padding, ikon, garis pemisah, dan tinggi footer-nya sama persis.
 */
import { ArrowRight, Inbox } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ requests: SelfRequests }>()

const { t } = useI18n()

const links = computed(() =>
  [props.requests.approvals_action, props.requests.submissions_action]
    .filter(action => action !== null),
)

const empty = computed(() => props.requests.state === 'empty')
</script>

<template>
  <Card class="flex h-full flex-col gap-0 py-5">
    <CardContent class="flex flex-1 flex-col">
      <div class="flex items-center gap-2">
        <span
          class="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
        >
          <Inbox class="size-3.5" aria-hidden="true" />
        </span>

        <h3 class="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          {{ t('me.cards.requests.title') }}
        </h3>
      </div>

      <div
        v-if="empty"
        class="flex flex-1 flex-col items-start gap-2.5 py-3"
      >
        <span
          class="flex size-9 items-center justify-center rounded-lg border border-dashed text-muted-foreground/60"
        >
          <Inbox class="size-4" aria-hidden="true" />
        </span>

        <p class="text-sm text-muted-foreground">
          {{ t('me.cards.requests.empty') }}
        </p>
      </div>

      <div v-else class="flex flex-1 flex-col justify-start py-3">
        <!--
          Yang menunggu tanda tangan saya dapat chip beraksen; yang saya
          ajukan dapat chip netral. Dua-duanya aksen berarti tidak ada
          yang menonjol, dan yang paling mendesak justru ikut tenggelam.
        -->
        <div class="flex flex-wrap items-center gap-2">
          <Badge v-if="requests.waiting_for_me > 0">
            {{ t('me.cards.requests.needsAction', { count: requests.waiting_for_me }) }}
          </Badge>

          <Badge v-if="requests.my_open_submissions > 0" variant="secondary">
            {{ t('me.cards.requests.waiting', { count: requests.my_open_submissions }) }}
          </Badge>
        </div>
      </div>

      <div v-if="links.length" class="mt-auto flex flex-wrap gap-x-4 gap-y-1 border-t pt-3">
        <NuxtLink
          v-for="link in links"
          :key="link.code"
          :to="link.route"
          class="
            group -mx-1 inline-flex items-center gap-1.5 rounded-md px-1 py-0.5
            text-sm font-medium text-primary transition-colors
            hover:text-primary/75
            focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none
          "
        >
          {{ t(`me.actions.${link.code}`) }}

          <ArrowRight
            class="size-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>
    </CardContent>
  </Card>
</template>
