<script setup lang="ts">
import { ArrowUpRight, PlayCircle } from 'lucide-vue-next'

defineProps<{
  article: {
    slug: string
    title: string
    summary?: string | null
    icon?: string | null
    snippet?: string | null
    category_name?: string | null
    has_video?: boolean
  }
  /**
   * Ditampilkan pada hasil pencarian, tempat satu daftar memuat
   * artikel dari beberapa kategori sekaligus. Di dalam kategorinya
   * sendiri, label itu cuma mengulang judul di atasnya.
   */
  showCategory?: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="`/help/${article.slug}`"
    class="group block rounded-lg border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex min-w-0 items-start gap-3">
        <!--
          Ikon yang namanya tidak dikenal jatuh ke kotak kosong tanpa
          error — gagal tanpa suara, bukan menjatuhkan halaman.
        -->
        <Icon
          v-if="article.icon"
          :name="article.icon"
          class="mt-0.5 size-5 shrink-0 text-primary"
        />

        <div class="min-w-0">
          <p class="flex items-center gap-2 font-medium leading-tight">
            {{ article.title }}
            <PlayCircle
              v-if="article.has_video"
              class="size-4 shrink-0 text-muted-foreground"
            />
          </p>

          <p
            v-if="showCategory && article.category_name"
            class="mt-1 text-xs text-muted-foreground"
          >
            {{ article.category_name }}
          </p>

          <p
            v-if="article.snippet || article.summary"
            class="mt-1.5 text-sm text-muted-foreground"
          >
            {{ article.snippet || article.summary }}
          </p>
        </div>
      </div>

      <ArrowUpRight
        class="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </div>
  </NuxtLink>
</template>
