<script setup lang="ts">
/**
 * Kepala halaman: foto, identitas, dan penempatan sekilas.
 *
 * Dipakai `/me` dan `/me/profile` supaya orang yang berpindah antara
 * keduanya tidak merasa berpindah aplikasi.
 *
 * Susunannya mendatar di desktop dan menumpuk di ponsel — lewat
 * `flex-col sm:flex-row`, bukan lewat penyembunyian: fotonya tetap
 * terlihat di layar sempit, cuma lebih kecil.
 */
import type { SelfProfile } from '../types'
import SelfAvatar from './SelfAvatar.vue'

const props = defineProps<{
  profile: SelfProfile
  avatarUrl: string | null
}>()

/** Baris keterangan di bawah nama; yang kosong tidak ikut tampil. */
const meta = computed(() => {
  const org = props.profile.organization

  return [
    org.position?.name,
    org.department?.name,
    org.company?.name,
    org.location?.name,
  ].filter((value): value is string => Boolean(value))
})
</script>

<template>
  <Card>
    <CardContent class="py-6">
      <div class="flex flex-col gap-5 sm:flex-row sm:items-start">
        <SelfAvatar
          :src="avatarUrl"
          :name="profile.identity.full_name"
          :initials="profile.photo.initials"
          size="lg"
          class="shrink-0"
        />

        <div class="min-w-0 flex-1 space-y-3">
          <div class="space-y-1">
            <h1 class="text-xl font-semibold tracking-tight break-words sm:text-2xl">
              {{ profile.identity.full_name }}
            </h1>

            <p class="font-mono text-sm text-muted-foreground">
              {{ profile.identity.employee_number }}
            </p>
          </div>

          <p v-if="meta.length" class="text-sm text-muted-foreground break-words">
            {{ meta.join(' · ') }}
          </p>

          <!--
          | Status tidak disampaikan lewat warna saja: badge-nya membawa
          | kata-katanya sendiri, jadi ia tetap terbaca oleh yang tidak
          | membedakan warna dan oleh pembaca layar.
          -->
          <div class="flex flex-wrap items-center gap-2">
            <Badge :variant="profile.identity.is_active ? 'default' : 'secondary'">
              {{
                profile.identity.is_active
                  ? $t('me.status.active')
                  : $t('me.status.inactive')
              }}
            </Badge>

            <Badge v-if="profile.employment.type" variant="outline">
              {{ profile.employment.type.name }}
            </Badge>

            <slot name="badges" />
          </div>
        </div>

        <div class="sm:self-center">
          <slot name="actions" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>
