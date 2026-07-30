<script setup lang="ts">
import { Search } from 'lucide-vue-next'

const route = useRoute()

const showGlobalSearch = computed(() => Boolean(route.meta.showGlobalSearch))

function setLinks() {
  if (route.fullPath === '/') {
    return [{ title: 'Home', href: '/' }]
  }

  const segments = route.fullPath.split('/').filter(item => item !== '')

  const breadcrumbs = segments.map((item, index) => {
    const str = item.replace(/-/g, ' ')
    const title = str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')

    return {
      title,
      href: `/${segments.slice(0, index + 1).join('/')}`,
    }
  })

  return [{ title: 'Home', href: '/' }, ...breadcrumbs]
}

const links = computed(() => setLinks())
</script>

<template>
  <header
    class="sticky top-0 z-20 flex h-(--header-height) items-center border-b bg-background/95 px-4 backdrop-blur md:px-6"
  >
    <!-- Left -->
    <div class="flex min-w-0 flex-1 items-center gap-4">
      <SidebarTrigger />

      <!-- Desktop -->
      <div class="hidden items-center gap-4 md:flex">
        <Separator orientation="vertical" />
        <BaseBreadcrumbCustom :links="links" />
      </div>

      <!-- Mobile -->
      <h1 class="truncate text-base font-medium md:hidden">
        {{ links.at(-1)?.title ?? 'Dashboard' }}
      </h1>
    </div>

    <!-- Center -->
    <div
      v-if="showGlobalSearch"
      class="hidden w-full max-w-xl flex-none px-6 xl:block"
    >
      <LayoutGlobalCommandSearch />
    </div>

    <!-- Right -->
    <div class="flex flex-1 justify-end">
      <slot />
    </div>
  </header>
</template>