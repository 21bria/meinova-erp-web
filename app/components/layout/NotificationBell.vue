<script setup lang="ts">
import { Bell, CheckCheck, Inbox } from 'lucide-vue-next'

import type { NotificationItem } from '~/composables/useNotifications'

/**
 * Bel di header.
 *
 * Dua bagian yang sengaja tidak dicampur. Di atas: dokumen yang
 * menunggu keputusan pengguna ini — **satu baris ringkasan menuju kotak
 * masuk**, bukan daftar yang bisa dibersihkan satu-satu. Di bawah:
 * notifikasi yang sifatnya memberi tahu, dan ini yang bisa ditandai
 * terbaca.
 *
 * Pemisahan itu bukan soal tampilan. Kalau permintaan persetujuan ikut
 * jadi baris yang bisa dibuang dari bel, orang akan membersihkan belnya
 * dan mengira pekerjaannya selesai — padahal dokumennya masih berdiri
 * di mejanya.
 */

const {
  items,
  unreadCount,
  waitingForMe,
  badge,
  load,
  markRead,
  markAllRead,
} = useNotifications()

const open = ref(false)

onMounted(() => {
  load()
})

/**
 * Dimuat ulang tiap kali dibuka.
 *
 * Statenya bertahan lintas navigasi supaya belnya tidak menembak API
 * tiap pindah halaman, tapi begitu orang benar-benar menengok isinya,
 * angka basi jauh lebih buruk daripada satu permintaan tambahan.
 */
watch(open, (value) => {
  if (value)
    load(true)
})

const TYPE_DOT: Record<string, string> = {
  INFO: 'bg-sky-500',
  SUCCESS: 'bg-emerald-500',
  WARNING: 'bg-amber-500',
  ERROR: 'bg-rose-500',
}

function dotClass(type: string) {
  return TYPE_DOT[type] ?? TYPE_DOT.INFO
}

/**
 * "3 hari lalu", bukan tanggal penuh.
 *
 * Yang ditanyakan orang pada notifikasi adalah seberapa baru, bukan
 * kapan persisnya — tanggal lengkapnya ada di dokumennya sendiri.
 */
function relativeTime(value: string) {
  const then = new Date(value).getTime()

  if (Number.isNaN(then))
    return ''

  const seconds = Math.round((Date.now() - then) / 1000)

  if (seconds < 60)
    return 'just now'

  const minutes = Math.round(seconds / 60)

  if (minutes < 60)
    return `${minutes}m ago`

  const hours = Math.round(minutes / 60)

  if (hours < 24)
    return `${hours}h ago`

  const days = Math.round(hours / 24)

  if (days < 30)
    return `${days}d ago`

  return new Date(value).toLocaleDateString()
}

async function openItem(item: NotificationItem) {
  await markRead(item.id)

  if (item.link) {
    open.value = false
    await navigateTo(item.link)
  }
}

async function openInbox() {
  open.value = false
  await navigateTo('/workflow/inbox')
}

const badgeLabel = computed(() =>
  badge.value > 99 ? '99+' : String(badge.value),
)
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        class="relative"
        aria-label="Notifications"
      >
        <Bell class="h-4 w-4" />

        <span
          v-if="badge > 0"
          class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium leading-none text-white"
        >
          {{ badgeLabel }}
        </span>
      </Button>
    </PopoverTrigger>

    <PopoverContent align="end" class="w-96 p-0">
      <div class="flex items-center justify-between border-b px-4 py-3">
        <p class="text-sm font-medium">
          Notifications
        </p>

        <Button
          v-if="unreadCount > 0"
          variant="ghost"
          size="sm"
          class="h-7 gap-1.5 px-2 text-xs"
          @click="markAllRead"
        >
          <CheckCheck class="h-3.5 w-3.5" />
          Mark all read
        </Button>
      </div>

      <!--
        Bagian approval. Satu baris menuju kotak masuk, tanpa tombol
        tandai-terbaca — yang menutupnya cuma keputusan yang sungguhan.
      -->
      <button
        v-if="waitingForMe > 0"
        type="button"
        class="flex w-full items-center gap-3 border-b bg-muted/40 px-4 py-3 text-left transition hover:bg-muted"
        @click="openInbox"
      >
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Inbox class="h-4 w-4 text-primary" />
        </span>

        <span class="min-w-0 flex-1">
          <span class="block text-sm font-medium">
            {{ waitingForMe }} document{{ waitingForMe > 1 ? 's' : '' }}
            waiting for your approval
          </span>

          <span class="block text-xs text-muted-foreground">
            Open approval inbox
          </span>
        </span>
      </button>

      <div class="max-h-80 overflow-y-auto">
        <button
          v-for="item in items"
          :key="item.id"
          type="button"
          class="flex w-full items-start gap-3 border-b px-4 py-3 text-left transition last:border-b-0 hover:bg-muted/60"
          :class="item.is_read ? '' : 'bg-muted/30'"
          @click="openItem(item)"
        >
          <span
            class="mt-1.5 h-2 w-2 shrink-0 rounded-full"
            :class="item.is_read ? 'bg-transparent' : dotClass(item.type)"
          />

          <span class="min-w-0 flex-1">
            <span
              class="block truncate text-sm"
              :class="item.is_read ? 'text-muted-foreground' : 'font-medium'"
            >
              {{ item.title }}
            </span>

            <span
              v-if="item.message"
              class="mt-0.5 block line-clamp-2 text-xs text-muted-foreground"
            >
              {{ item.message }}
            </span>

            <span class="mt-1 block text-[11px] text-muted-foreground">
              {{ relativeTime(item.created_at) }}
            </span>
          </span>
        </button>

        <!--
          Kosong itu keadaan yang sah, bukan gagal memuat — sampai tugas
          harian pengingat dinyalakan, memang belum ada yang menulis
          baris notifikasi.
        -->
        <p
          v-if="!items.length && waitingForMe === 0"
          class="px-4 py-8 text-center text-sm text-muted-foreground"
        >
          No notifications.
        </p>
      </div>
    </PopoverContent>
  </Popover>
</template>
