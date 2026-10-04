<script setup lang="ts">
const auth = useAuthStore()

const { locale } = useLocale()

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
        <!--
          `:key="locale"` — isi halaman dirakit ulang saat bahasa
          berganti.

          Teks di template sudah reaktif sendiri lewat `$t`. Yang tidak:
          label yang **dihitung sekali** lalu disimpan sebagai
          konfigurasi — judul kolom tabel, label field form, opsi
          filter. Semuanya dirakit di `setup` dan tidak pernah dihitung
          ulang, jadi tanpa ini separuh layar berganti bahasa dan
          separuhnya lagi tidak.

          Kuncinya ditaruh di isi halaman saja, bukan di seluruh
          layout: sidebar dan header tetap hidup, jadi menu tidak
          berkedip dan posisi gulir sidebar tidak hilang.
        -->
        <div :key="locale" class="@container/main grow overflow-y-auto hide-scrollbar p-4 lg:p-6">
          <slot />
        </div>
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>