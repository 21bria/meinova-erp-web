<script setup lang="ts">
/**
 * **My Profile** (`/me/profile`) — kartu pribadi, read-only.
 *
 * Bukan layar administratif, dan sengaja tidak menyerupainya: tidak ada
 * form, tidak ada input yang dinonaktifkan, tidak ada tab CRUD. Yang
 * dibaca orang saat membuka profilnya sendiri adalah informasi, bukan
 * formulir yang kebetulan terkunci.
 *
 * Susunannya mengikuti kontrak Stage 4 (`GET /api/me/profile/`) yang
 * sudah berbentuk seksi — **bukan** `ui-schema` milik Employee Master
 * seperti layar lama. Itu yang membuat halaman ini tetap berdiri saat HR
 * memindahkan sebuah kolom antar tab.
 */
import { useI18n } from 'vue-i18n'

import InfoRow from '../components/InfoRow.vue'
import ProfileSection from '../components/ProfileSection.vue'

import SelfHeader from '../components/SelfHeader.vue'
import SelfStateView from '../components/SelfStateView.vue'
import { useSelfAvatar } from '../composables/useSelfAvatar'
import { useSelfProfile } from '../composables/useSelfProfile'

const { t } = useI18n()

const { profile, pending, error, load } = useSelfProfile()
const { url: avatarUrl, load: loadAvatar } = useSelfAvatar()

/** Alamat dirangkai dari yang terisi saja, dari detail ke provinsi. */
const address = computed(() => {
  const contact = profile.value?.contact

  if (!contact)
    return null

  return [
    contact.address,
    contact.village?.name,
    contact.district?.name,
    contact.city?.name,
    contact.province?.name,
  ]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(', ')
})

async function refresh() {
  await load()

  // Fotonya diambil hanya kalau backend memang menyatakan ada. Tanpa
  // penjagaan ini, setiap pegawai tanpa foto menghasilkan satu 404 di
  // konsol tiap kali halamannya dibuka — bukan kerusakan, tapi berisik,
  // dan yang berisik menenggelamkan galat yang sungguhan.
  if (profile.value?.photo.url)
    await loadAvatar()
}

onMounted(refresh)
</script>

<template>
  <div class="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6">
    <SelfStateView
      v-if="pending || error"
      :pending="pending"
      :code="error?.code ?? null"
      @retry="refresh"
    />

    <template v-else-if="profile">
      <SelfHeader :profile="profile" :avatar-url="avatarUrl" />

      <ProfileSection :title="t('me.sections.personal')">
        <InfoRow :label="t('me.fields.gender')" :value="profile.personal.gender?.name" />
        <InfoRow :label="t('me.fields.birthPlace')" :value="profile.personal.birth_place" />
        <InfoRow :label="t('me.fields.birthDate')" :value="profile.personal.birth_date" />
        <InfoRow :label="t('me.fields.maritalStatus')" :value="profile.personal.marital_status?.name" />
        <InfoRow :label="t('me.fields.nationality')" :value="profile.personal.nationality?.name" />
        <InfoRow :label="t('me.fields.bloodType')" :value="profile.personal.blood_type?.name" />
        <InfoRow :label="t('me.fields.religion')" :value="profile.personal.religion?.name" />
      </ProfileSection>

      <ProfileSection :title="t('me.sections.contact')">
        <InfoRow :label="t('me.fields.personalEmail')" :value="profile.contact.personal_email" />
        <InfoRow :label="t('me.fields.workEmail')" :value="profile.contact.work_email" />
        <InfoRow :label="t('me.fields.phone')" :value="profile.contact.phone" />
        <InfoRow :label="t('me.fields.mobile')" :value="profile.contact.mobile" />

        <!--
        | Alamat memakan lebar penuh: dirangkai dari lima bagian, ia
        | hampir selalu lebih panjang daripada kolom grid biasa.
        -->
        <div class="sm:col-span-2 lg:col-span-3">
          <InfoRow :label="t('me.fields.address')" :value="address" />
        </div>
      </ProfileSection>

      <ProfileSection :title="t('me.sections.employment')">
        <InfoRow :label="t('me.fields.employmentStatus')" :value="profile.employment.status?.name" />
        <InfoRow :label="t('me.fields.employmentType')" :value="profile.employment.type?.name" />
        <InfoRow :label="t('me.fields.joinDate')" :value="profile.employment.join_date" />
        <InfoRow :label="t('me.fields.effectiveDate')" :value="profile.employment.effective_date" />
        <InfoRow :label="t('me.fields.confirmationDate')" :value="profile.employment.confirmation_date" />
        <InfoRow :label="t('me.fields.jobLocation')" :value="profile.employment.job_location" />
      </ProfileSection>

      <ProfileSection :title="t('me.sections.organization')">
        <InfoRow :label="t('me.fields.company')" :value="profile.organization.company?.name" />
        <InfoRow :label="t('me.fields.branch')" :value="profile.organization.branch?.name" />
        <InfoRow :label="t('me.fields.location')" :value="profile.organization.location?.name" />
        <InfoRow :label="t('me.fields.division')" :value="profile.organization.division?.name" />
        <InfoRow :label="t('me.fields.department')" :value="profile.organization.department?.name" />
        <InfoRow :label="t('me.fields.section')" :value="profile.organization.section?.name" />
        <InfoRow :label="t('me.fields.position')" :value="profile.organization.position?.name" />
        <InfoRow :label="t('me.fields.jobLevel')" :value="profile.organization.job_level?.name" />
        <InfoRow :label="t('me.fields.jobGrade')" :value="profile.organization.job_grade?.name" />
        <InfoRow :label="t('me.fields.costCenter')" :value="profile.organization.cost_center?.name" />
        <InfoRow :label="t('me.fields.supervisor')" :value="profile.organization.supervisor?.full_name" />
        <InfoRow :label="t('me.fields.effectiveDate')" :value="profile.organization.effective_date" />
      </ProfileSection>

      <ProfileSection
        :title="t('me.sections.emergency')"
        :description="t('me.sections.emergencyHint')"
      >
        <InfoRow :label="t('me.fields.emergencyName')" :value="profile.emergency_contact.name" />
        <InfoRow :label="t('me.fields.emergencyPhone')" :value="profile.emergency_contact.phone" />
      </ProfileSection>

      <p class="text-xs text-muted-foreground">
        {{ t('me.profile.readOnlyHint') }}
      </p>
    </template>
  </div>
</template>
