// app/registry/section-hub/hr-roster-travel.ts
//
// Isi hub Roster & Travel — perjalanan dan jadwal kerja **pegawai**:
// kepulangan site (Travel Request), perjalanan dinas (Business Trip),
// dan jadwal roster.
//
// Kedatangan tamu tinggal di hub Visitor yang berdiri sendiri: yang di
// sini bersandar pada Point of Hire, blok roster, dan saldo cuti, dan
// tidak satu pun dari ketiganya berlaku pada tamu.

import type {
  MasterHubCategory,
  MasterHubItem,
} from '~/features/master-hub'

export const hrRosterTravelCategories: MasterHubCategory[] = [
  { key: 'travel', label: 'Travel', order: 10 },
  { key: 'roster', label: 'Roster', order: 20 },
]

export const hrRosterTravelItems: MasterHubItem[] = [
  {
    key: 'travel-requests',
    title: 'Travel Request',
    description:
      'Pengajuan satu kepulangan dari site — tanggal, etape perjalanan, tiket, dan penginapan transit.',
    icon: 'i-lucide-plane',
    link: '/hr/travel-requests',
    category: 'travel',
    order: 10,
    keywords: ['tr', 'kepulangan', 'tiket', 'field break', 'poh'],
  },
  {
    // Perjalanan dinas resmi — dokumennya sendiri, **bukan** Travel
    // Request (kepulangan site) dan bukan Visitor Request (tamu). Orang
    // kantor yang paling sering memakainya; pegawai roster pulang lewat
    // Travel Request. Menu bukan izin: API yang menegakkan cakupannya.
    key: 'business-trips',
    title: 'Business Trip',
    description:
      'Perjalanan dinas resmi pegawai — tujuan, jadwal berangkat/kembali, itinerary dan akomodasi, persetujuan, serta keberangkatan dan kepulangan aktual.',
    icon: 'i-lucide-briefcase',
    link: '/hr/business-trips',
    category: 'travel',
    order: 15,
    keywords: ['bt', 'dinas', 'perjalanan dinas', 'business trip', 'sppd', 'itinerary'],
  },
  {
    key: 'site-rotations',
    title: 'Roster Schedule',
    // Keterangannya menyebut shift normal sejak tombol Set Shift
    // Pattern ada di layar ini. Selama kartunya cuma berbunyi "blok
    // kerja dan field break", orang mencari tempat menetapkan shift di
    // layar lain — dan menemukannya, lalu menyusun jadwalnya dua kali.
    description:
      'Jadwal kerja setahun per pegawai — blok kerja, field break, hari perjalanan, dan shift normal tiap blok.',
    icon: 'i-lucide-calendar-range',
    link: '/hr/site-rotations',
    category: 'roster',
    order: 20,
    keywords: ['jadwal', 'siklus', 'rotasi', 'rst', 'swing', 'shift', 'pola shift'],
  },
  {
    key: 'roster-setups',
    title: 'Roster Setup',
    description:
      'Menerbitkan jadwal untuk banyak pegawai sekaligus — satu dokumen, satu pengajuan, satu persetujuan.',
    icon: 'i-lucide-calendar-plus',
    link: '/hr/roster-setups',
    category: 'roster',
    order: 30,
    keywords: ['massal', 'batch', 'rsu', 'terbitkan jadwal'],
  },
  {
    key: 'roster-adjustments',
    title: 'Roster Adjustment',
    description:
      'Penyesuaian jadwal yang sudah berjalan — kapal digeser, blok diperpanjang, cuti dimundurkan.',
    icon: 'i-lucide-calendar-cog',
    link: '/hr/roster-adjustments',
    category: 'roster',
    order: 40,
    keywords: ['geser', 'raj', 'delay', 'perpanjang', 'penyesuaian'],
  },
  {
    key: 'rotation-credits',
    title: 'Rotation Credit',
    description:
      'Ledger hak off tambahan dari kelebihan hari di site — terpisah dari saldo cuti tahunan.',
    icon: 'i-lucide-coins',
    link: '/hr/rotation-credits',
    category: 'roster',
    order: 50,
    keywords: ['kredit', 'ledger', 'kompensasi', 'off tambahan'],
  },
]
