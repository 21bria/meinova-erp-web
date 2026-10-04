// app/registry/section-hub/hr-visitor.ts
//
// Isi hub Visitor — kedatangan **tamu**, bukan perjalanan pegawai.
//
// Berdiri sendiri, tidak dititipkan ke Roster & Travel. Keduanya
// kebetulan sama-sama menyangkut tiket dan penginapan, dan itu
// satu-satunya kemiripannya: orang yang membuka salah satunya tidak
// pernah sedang mencari yang lain.
//
// Master Visit Purpose dan Visit Type sengaja **tidak** ada di sini —
// tempatnya HR Master Hub, kategori Visitor. Hub ini isinya layar yang
// dipakai sehari-hari; master yang diatur sekali saat menyiapkan sistem
// bercampur di dalamnya cuma membuat keduanya lebih sulit dicari.

import type {
  MasterHubCategory,
  MasterHubItem,
} from '~/features/master-hub'

export const hrVisitorCategories: MasterHubCategory[] = [
  { key: 'visit', label: 'Visit', order: 10 },
  { key: 'registry', label: 'Registration', order: 20 },
]

export const hrVisitorItems: MasterHubItem[] = [
  {
    key: 'visitor-requests',
    title: 'Visitor Request',
    description:
      'Pengajuan satu kunjungan — tamu, tujuan, tuan rumah, dan perjalanannya. Lengkap dengan check-in dan check-out.',
    icon: 'i-lucide-door-open',
    link: '/hr/visitor-requests',
    category: 'visit',
    order: 10,
    keywords: ['tamu', 'kunjungan', 'vr', 'check-in', 'gate'],
  },
  {
    key: 'external-visitors',
    title: 'Visitor Master',
    description:
      'Daftar tamu luar beserta identitasnya. Vendor yang datang dua belas kali setahun mengetik datanya sekali.',
    icon: 'i-lucide-contact-round',
    link: '/hr/external-visitors',
    category: 'registry',
    order: 20,
    keywords: ['tamu luar', 'vendor', 'vis', 'ktp', 'blacklist'],
  },
  {
    key: 'visitor-passes',
    title: 'Visitor Pass',
    description:
      'Kartu yang dipegang tamu selama di lokasi — nomor, masa berlaku, dan apakah sudah dikembalikan.',
    icon: 'i-lucide-id-card',
    link: '/hr/visitor-passes',
    category: 'registry',
    order: 30,
    keywords: ['kartu', 'badge', 'vp', 'kembali', 'hilang'],
  },
]
