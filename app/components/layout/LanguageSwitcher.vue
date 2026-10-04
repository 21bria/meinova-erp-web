<script setup lang="ts">
import type { LocaleCode } from '~/i18n/config'

/*
 * Pemilih bahasa.
 *
 * Dua bentuk dari satu komponen, dipilih lewat prop `variant`:
 *
 *   - `menu`   — sub-menu di dropdown profil (bentuk yang dipakai shell)
 *   - `inline` — deretan tombol, untuk halaman Settings
 *
 * Keduanya memanggil `useLocale().setLocale()` yang sama, jadi tidak ada
 * dua jalur ganti bahasa yang bisa berbeda perilaku.
 */
withDefaults(defineProps<{
  variant?: 'menu' | 'inline'
}>(), {
  variant: 'menu',
})

const { locale, locales, setLocale } = useLocale()

async function choose(code: LocaleCode) {
  if (code === locale.value)
    return

  await setLocale(code)
}
</script>

<template>
  <!--
    Bentuk menu. `DropdownMenuSub` dan bukan daftar datar: item profil
    sudah tujuh baris, dan menambahkan dua baris bahasa di sana membuat
    yang dicari harus dibaca satu per satu.
  -->
  <DropdownMenuSub v-if="variant === 'menu'">
    <DropdownMenuSubTrigger>
      <Icon name="i-lucide-languages" class="mr-2 size-4" />
      {{ $t('common.labels.language') }}
    </DropdownMenuSubTrigger>

    <DropdownMenuSubContent>
      <DropdownMenuItem
        v-for="item in locales"
        :key="item.code"
        @click="choose(item.code)"
      >
        <Icon
          name="i-lucide-check"
          class="mr-2 size-4"
          :class="item.code === locale ? 'opacity-100' : 'opacity-0'"
        />
        {{ item.label }}
      </DropdownMenuItem>
    </DropdownMenuSubContent>
  </DropdownMenuSub>

  <!--
    Bentuk inline. Nama bahasa sengaja ditulis dalam bahasanya sendiri
    ("Bahasa Indonesia", bukan "Indonesian"): orang yang tersesat di
    antarmuka berbahasa asing mencari nama yang ia kenali.
  -->
  <div v-else class="space-y-1.5">
    <Label>{{ $t('common.labels.language') }}</Label>
    <!--
      `flex`, bukan `grid-cols-N` yang dirakit dari `locales.length`:
      Tailwind memindai kelas sebagai teks statis, jadi kelas yang
      dirangkai saat runtime tidak pernah ikut ter-generate — dan
      gagalnya diam, cuma tata letak yang salah.
    -->
    <div class="flex flex-wrap gap-2">
      <Button
        v-for="item in locales"
        :key="item.code"
        type="button"
        variant="outline"
        class="flex-1"
        :class="{ 'border-primary! border-2 bg-primary/10!': item.code === locale }"
        @click="choose(item.code)"
      >
        {{ item.label }}
      </Button>
    </div>
  </div>
</template>
