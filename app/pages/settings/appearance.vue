<script setup lang="ts">

</script>

<template>
  <SettingsLayout>
    <!--
      Bahasa duduk di halaman Appearance, sederajat dengan tema.

      Bukan di dalam `SettingsAppearanceForm`: form itu punya tombol
      Submit sendiri, sementara pemilih bahasa berlaku seketika dan
      langsung tersimpan ke akun. Menaruhnya di dalam form berarti ada
      satu kontrol yang tidak menunggu Submit di tengah kontrol yang
      menunggu — dan tidak ada yang bisa menebak yang mana.
    -->
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-medium">
          {{ $t('common.labels.language') }}
        </h3>
        <p class="text-sm text-muted-foreground">
          {{ $t('settings.languageHint') }}
        </p>
      </div>

      <LayoutLanguageSwitcher variant="inline" />
    </div>

    <Separator />

    <SettingsAppearanceForm />
  </SettingsLayout>
</template>

<style scoped>

</style>
