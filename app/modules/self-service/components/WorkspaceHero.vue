<script setup lang="ts">
import type { SelfHero, SelfPhoto } from '../types'

/**
 * Konteks kerja pemegang akun — kepala **dashboard**, bukan kepala
 * halaman profil.
 *
 * Sengaja **bukan** `SelfHeader.vue`. Keduanya menampilkan orang yang
 * sama, tapi menjawab pertanyaan berbeda: yang di profil memperkenalkan
 * sebuah dokumen ("ini kartu siapa"), yang di sini menyiapkan hari kerja
 * ("saya siapa, di mana"). Memakai satu komponen untuk keduanya persis
 * yang membuat `/me` dan `/me/profile` terbaca sebagai halaman yang sama
 * dengan jumlah field berbeda.
 *
 * **Fotonya `MAvatar`, komponen yang sama dengan kartu pegawai HR** —
 * bulat, `object-cover`, dan jatuh ke inisial saat fotonya tidak ada
 * atau gagal dimuat. Yang **tidak** dipakai bersama HR adalah
 * alamatnya: sumbernya tetap `avatarUrl` milik `useSelfAvatar()`, yaitu
 * `/api/me/avatar/` yang dijaga identitas — bukan `preview/` milik
 * pegawai, yang menuntut izin HR.
 *
 * **Fotonya bisa diklik** (`preview`) dan terbuka utuh di kotak yang
 * sama dengan lampiran unggahan, memakai blob yang sudah diambil —
 * membukanya tidak menembak `/api/me/avatar/` untuk kedua kali. Yang
 * tampil inisial tidak bisa diklik sama sekali.
 *
 * **Enam field, dan batasnya disengaja.** Tanggal bergabung, atasan,
 * cost center, job grade, dan seluruh alamat tinggal di `/me/profile`.
 *
 * **Dipadatkan dengan sadar.** Padding dipegang `Card` (`py-5`) alih-alih
 * ditumpuk lagi di `CardContent`, avatarnya 64px (bukan 72–88px milik
 * halaman profil), dan tiga baris identitasnya rapat. Yang dibeli dengan itu: "Hari Ini" naik ke
 * atas lipatan layar 1100px. Kepala halaman yang megah tapi mendorong
 * isinya keluar layar adalah banner, bukan dashboard.
 */
import { MAvatar } from '@framework'
import { ArrowRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  fullName: string
  employeeNumber: string
  isActive: boolean
  photo: SelfPhoto
  hero: SelfHero
  avatarUrl: string | null
}>()

const { t } = useI18n()

/**
 * Baris konteks di bawah nama. Yang kosong tidak ikut — bukan dicetak em
 * dash: kepala dashboard bukan formulir, dan tanda hubung berderet di
 * sini cuma memberitahukan bahwa ada kolom yang belum diisi HR.
 */
const context = computed(() =>
  [
    props.hero.department?.name,
    props.hero.company?.name,
    props.hero.location?.name,
  ].filter((value): value is string => Boolean(value)),
)

const position = computed(() => props.hero.position?.name)
</script>

<template>
  <Card class="gap-0 py-5">
    <CardContent class="flex flex-col gap-4 sm:flex-row sm:items-center">
      <MAvatar
        :src="avatarUrl"
        :name="fullName"
        :initials="photo.initials"
        size="size-16"
        fallback-class="text-lg"
        preview
        :preview-title="fullName"
        class="shrink-0 ring-1 ring-border"
      />

      <div class="min-w-0 flex-1 space-y-1">
        <div class="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <h2 class="text-xl font-semibold tracking-tight break-words">
            {{ fullName }}
          </h2>

          <!--
            Status dibawa kata-katanya sendiri, bukan cuma warna badge:
            yang tidak membedakan warna dan pembaca layar tetap harus
            bisa tahu ia aktif atau tidak.
          -->
          <Badge :variant="isActive ? 'default' : 'secondary'">
            {{ isActive ? t('me.status.active') : t('me.status.inactive') }}
          </Badge>

          <Badge v-if="hero.employment_type" variant="outline">
            {{ hero.employment_type.name }}
          </Badge>
        </div>

        <p class="text-sm break-words">
          <span class="font-mono text-muted-foreground">{{ employeeNumber }}</span>

          <template v-if="position">
            · <span class="font-medium">{{ position }}</span>
          </template>
        </p>

        <!--
          Departemen · Perusahaan · Lokasi pada satu baris, bukan tiga
          baris label–nilai. Ini konteks yang dibaca sekilas, dan daftar
          berlabel di kepala halaman membuat mata menelusuri alih-alih
          menangkap.
        -->
        <p v-if="context.length" class="text-xs text-muted-foreground break-words">
          {{ context.join(' · ') }}
        </p>
      </div>

      <NuxtLink
        to="/me/profile"
        class="
          group inline-flex shrink-0 items-center gap-1.5 self-start rounded-md
          px-1 py-0.5 text-sm font-medium text-primary transition-colors
          hover:text-primary/75
          focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none
          sm:self-center
        "
      >
        {{ t('me.actions.viewProfile') }}

        <ArrowRight
          class="size-3.5 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </NuxtLink>
    </CardContent>
  </Card>
</template>
