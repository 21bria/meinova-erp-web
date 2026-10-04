<script setup lang="ts">
/**
 * Satu kartu berisi kelompok informasi.
 *
 * Grid-nya satu kolom di ponsel, dua di tablet, tiga di desktop —
 * ditulis sebagai kelas responsif, bukan sebagai lebar tetap, supaya
 * kartunya ikut wadahnya alih-alih memaksakan ukuran layar tertentu.
 */
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <Card>
    <CardHeader class="pb-3">
      <CardTitle class="text-base">
        {{ title }}
      </CardTitle>

      <CardDescription v-if="description">
        {{ description }}
      </CardDescription>
    </CardHeader>

    <CardContent>
      <dl
        class="
          grid grid-cols-1 gap-x-8 gap-y-5
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        <slot />
      </dl>
    </CardContent>
  </Card>
</template>
