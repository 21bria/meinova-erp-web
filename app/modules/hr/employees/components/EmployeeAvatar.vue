<script setup lang="ts">
/**
 * Foto pegawai untuk layar HR.
 *
 * Pembungkus tipis di atas `MAvatar`: yang ditambahkannya hanya cara
 * membaca baris pegawai (`employeeAvatar()`) dan tiga ukuran baku.
 * Pengambilan berautentikasi, `object-cover`, dan jatuh ke inisial saat
 * foto tidak ada atau gagal dimuat — semuanya milik `MAvatar`.
 */
import type { EmployeesRow } from "../types"

import { MAvatar } from "@framework"

import { employeeAvatar } from "../avatar"

const props = withDefaults(
  defineProps<{
    employee?: Partial<EmployeesRow> | null
    size?: "sm" | "md" | "lg"

    /**
     * Klik foto → lihat utuh. Dinyalakan kepala halaman Detail/Edit,
     * **tidak** oleh baris daftar: sel identitas 32px sudah punya
     * arti klik sendiri (membuka recordnya).
     */
    preview?: boolean
  }>(),
  {
    employee: null,
    size: "md",
    preview: false,
  },
)

const SIZES = {
  // Baris tabel: setinggi dua baris teks di sel identitas.
  sm: { size: "size-8", fallback: "text-[0.7rem]" },
  // Kepala halaman Detail/Edit: 56px.
  md: { size: "size-14", fallback: "text-base" },
  lg: { size: "size-16", fallback: "text-lg" },
} as const

const avatar = computed(() => employeeAvatar(props.employee))

const sizing = computed(() => SIZES[props.size])
</script>

<template>
  <MAvatar
    :src="avatar.src"
    :name="avatar.name"
    :initials="avatar.initials"
    :size="sizing.size"
    :fallback-class="sizing.fallback"
    :preview="props.preview"
    :preview-title="avatar.name"
  />
</template>
