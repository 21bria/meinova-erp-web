<script setup lang="ts">
const auth = useAuthStore()

onMounted(async () => {
  auth.loadFromStorage()

  if (auth.isAuthed && !auth.meLoaded) {
    try {
      await auth.fetchMe()
    } catch {
      auth.clear()
      await navigateTo("/login")
    }
  }
})
</script>


<template>
  <SidebarProvider>
    <LayoutAppSidebar />

    <SidebarInset>
      <LayoutHeader />

      <!-- <main class="flex flex-col flex-1 overflow-hidden"> -->
      <main class="scroll-thin-page h-[calc(100dvh-56px)] overflow-y-auto">
        <div class="@container/main grow overflow-y-auto hide-scrollbar p-4 lg:p-6">
          <slot />
        </div>
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>