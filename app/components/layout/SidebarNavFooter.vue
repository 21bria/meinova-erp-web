<script setup lang="ts">
import { useSidebar } from '~/components/ui/sidebar'

const props = defineProps<{
  user: {
    name: string
    email: string
    // Dihitung backend dari nama atau email. Perhitungan di sini
    // ("ambil huruf pertama tiap kata") menghasilkan satu huruf untuk
    // username seperti `demo.hrmanager` yang tidak punya spasi.
    initials?: string
    avatar: string
  }
}>()

const { isMobile, setOpenMobile } = useSidebar()
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

function handleLogout() {
  auth.clear()
  navigateTo('/login')
}

const showModalTheme = ref(false)

const initials = computed(() => {
  if (props.user?.initials)
    return props.user.initials

  return (props.user?.name ?? "?")
    .split(" ")
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
})
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage :src="user.avatar" :alt="user.name" />
              <AvatarFallback class="rounded-lg">
                {{ initials }}
              </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{{ user.name }}</span>
              <span class="truncate text-xs">{{ user.email }}</span>
            </div>
            <Icon name="i-lucide-chevrons-up-down" class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="min-w-56 w-[--radix-dropdown-menu-trigger-width] rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="user.avatar" :alt="user.name" />
                <AvatarFallback class="rounded-lg">
                  {{ initials }}
                </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ user.name }}</span>
                <span class="truncate text-xs">{{ user.email }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <!--
            **Ruang pribadi pemegang akun.** Paling atas karena inilah
            yang dicari orang saat menekan namanya sendiri. Keduanya
            menunjuk Self Service (`/me`), bukan `/hr/my-profile` yang
            lama — layar itu sekarang cuma mengalihkan ke sini.
          -->
          <DropdownMenuGroup>
            <DropdownMenuItem as-child>
              <NuxtLink to="/me" @click="setOpenMobile(false)">
                <Icon name="i-lucide-house" />
                {{ $t('navigation.items.myWorkspace') }}
              </NuxtLink>
            </DropdownMenuItem>

            <DropdownMenuItem as-child>
              <NuxtLink to="/me/profile" @click="setOpenMobile(false)">
                <Icon name="i-lucide-id-card" />
                {{ $t('navigation.items.myProfile') }}
              </NuxtLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <!--
            **Satu pintu ke Pengaturan, bukan dua.**

            Sebelumnya ada "Akun" → `/settings/profile` dan "Pengaturan"
            → `/settings`. Keduanya mendarat di halaman yang sama persis:
            `nuxt.config.ts` mengalihkan `/settings` ke
            `/settings/profile`. Dua item yang membuka satu halaman
            membuat orang menekan keduanya untuk memastikan, lalu
            menyimpulkan salah satunya rusak.

            Yang tinggal menunjuk **rute seksinya** (`/settings`), bukan
            tab bawaannya: kalau suatu hari tab pertamanya berganti,
            menu ini tidak ikut salah.
          -->
          <DropdownMenuGroup>
            <DropdownMenuItem as-child>
              <NuxtLink to="/settings" @click="setOpenMobile(false)">
                <Icon name="i-lucide-settings" />
                {{ $t('common.labels.settings') }}
              </NuxtLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <!--
            **Preferensi orangnya**, dikelompokkan sendiri.

            Bahasa duduk di sini dan bukan di header: bahasa adalah
            preferensi milik orangnya — satu tempat dengan Tema — bukan
            kontrol per layar.
          -->
          <DropdownMenuGroup>
            <LayoutLanguageSwitcher />

            <DropdownMenuItem @click="showModalTheme = true">
              <Icon name="i-lucide-paintbrush" />
              {{ $t('common.labels.theme') }}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem @click="handleLogout">
            <Icon name="i-lucide-log-out" />
            {{ $t('common.labels.logout') }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>

  <Dialog v-model:open="showModalTheme">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Customize</DialogTitle>
        <DialogDescription class="text-xs text-muted-foreground">
          Customize & Preview in Real Time
        </DialogDescription>
      </DialogHeader>
      <ThemeCustomize />
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>
