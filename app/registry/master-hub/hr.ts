// app/registry/master-hub/hr.ts
//
// Isi HR Master Hub. Polanya sama dengan Payroll: kartu berkategori,
// bukan daftar tab panjang.
//
// Sebagian besar referensi HR (Gender, Leave Type, Shift, …) tinggal di
// satu workspace bertab di /administration/master/hr. Kartu di sini
// menautkan langsung ke tabnya lewat query `?group=&item=`, jadi orang
// tidak perlu menghafal referensi mana ada di kelompok apa.
//
// Yang punya halaman sendiri cuma master yang isinya aturan, bukan
// daftar kode-nama: Leave Policy dan Roster Policy.

import type {
  MasterHubCategory,
  MasterHubItem,
} from '~/features/master-hub'

/** Tautan ke satu tab di workspace referensi HR. */
function reference(group: string, item: string) {
  return `/administration/master/hr?group=${group}&item=${item}`
}

export const hrMasterCategories: MasterHubCategory[] = [
  { key: 'policy', label: 'Policy', order: 10 },
  { key: 'roster', label: 'Roster & Calendar', order: 20 },
  { key: 'employment', label: 'Employment', order: 30 },
  { key: 'leave', label: 'Leave & Attendance', order: 40 },
  { key: 'recruitment', label: 'Recruitment & Training', order: 50 },
  { key: 'personal', label: 'Personal Data', order: 60 },
  // Kategori sendiri, tidak dititipkan ke 'Roster & Calendar'.
  // Master di sana mengatur perjalanan **pegawai**; yang di sini
  // mengatur kedatangan **tamu**, dan orang yang mencari salah
  // satunya tidak pernah sedang mencari yang lain.
  { key: 'visitor', label: 'Visitor', order: 70 },
]

export const hrMasterItems: MasterHubItem[] = [
  // ---------------------------------------------------------------
  // Kebijakan — master yang isinya aturan, bukan daftar kode-nama
  // ---------------------------------------------------------------
  {
    key: 'leave-policies',
    title: 'Leave Policy',
    description:
      'Jatah cuti: berapa hari, masa tunggu sejak Join Date, prorata, dan sisa tahun lalu.',
    icon: 'i-lucide-scale',
    link: '/hr/leave-policies',
    category: 'policy',
    order: 10,
    keywords: ['jatah', 'saldo', 'entitlement', 'prorata', 'cuti tahunan'],
  },
  {
    key: 'employee-data-policies',
    title: 'Employee Data Policy',
    description:
      'Bagian data pegawai yang dirahasiakan — riwayat gaji dan pengunduran diri hanya untuk yang berhak.',
    icon: 'i-lucide-shield',
    link: '/hr/employee-data-policies',
    category: 'policy',
    order: 17,
    keywords: ['rahasia', 'privasi', 'gaji', 'riwayat', 'confidential'],
  },
  {
    key: 'attendance-policies',
    title: 'Attendance Policy',
    description:
      'Toleransi keterlambatan dan ambang lembur, dibedakan per lokasi — kantor pusat dan site tidak harus sama.',
    icon: 'i-lucide-timer',
    link: '/hr/attendance-policies',
    category: 'policy',
    order: 12,
    keywords: ['telat', 'toleransi', 'lembur', 'overtime', 'presensi', 'absensi'],
  },
  {
    key: 'employee-action-policies',
    title: 'Employee Action Policy',
    description:
      'Siapa yang boleh mengusulkan perubahan kepegawaian — gaji dan promosi oleh Kepala Departemen, transfer oleh Atasan Langsung.',
    icon: 'i-lucide-user-cog',
    link: '/hr/employee-action-policies',
    category: 'policy',
    order: 15,
    keywords: ['pengusul', 'requester', 'promosi', 'gaji', 'mutasi', 'employee action'],
  },
  {
    key: 'roster-policies',
    title: 'Roster Policy',
    description:
      'Pola siklus (6:2, 8:2, custom), hari perjalanan menurut Point of Hire, rasio konversi, dan aturan rotation credit.',
    icon: 'i-lucide-route',
    link: '/hr/roster-policies',
    category: 'policy',
    order: 20,
    keywords: [
      'travel days',
      'point of hire',
      'rasio',
      'field break',
      'siklus',
      'cycle',
      'rotation credit',
    ],
  },
  {
    key: 'reminder-policy',
    title: 'Reminder Policy',
    description:
      'Berapa hari sebelum masa percobaan, kontrak, dan ulang tahun pengingatnya muncul di dashboard HR.',
    icon: 'i-lucide-bell-ring',
    link: '/hr/reminder-policy',
    category: 'policy',
    order: 30,
    keywords: ['probation', 'kontrak', 'ulang tahun', 'pengingat', 'h-'],
  },

  // ---------------------------------------------------------------
  // Roster & kalender
  // ---------------------------------------------------------------
  {
    key: 'roster-crews',
    title: 'Roster Crew',
    description:
      'Gelombang rotasi site beserta tanggal jangkar siklusnya.',
    icon: 'i-lucide-users-round',
    link: '/administration/calendar?tab=roster-crews',
    category: 'roster',
    order: 10,
    keywords: ['gelombang', 'crew', 'siklus', 'swing'],
  },
  {
    key: 'work-calendars',
    title: 'Work Calendar',
    description:
      'Hari kerja per company/site. Menentukan potongan cuti pegawai non-roster.',
    icon: 'i-lucide-calendar-days',
    link: '/administration/calendar?tab=work-calendars',
    category: 'roster',
    order: 20,
    keywords: ['kalender', 'hari kerja', 'senin jumat'],
  },
  {
    key: 'holidays',
    title: 'Holiday',
    description: 'Hari libur nasional dan libur khusus site.',
    icon: 'i-lucide-party-popper',
    link: '/administration/calendar?tab=holidays',
    category: 'roster',
    order: 30,
    keywords: ['libur', 'tanggal merah'],
  },
  {
    key: 'work-schedules',
    title: 'Work Schedule',
    description:
      'Pola kerja: Regular 5 Days dan pola roster (42/14, 56/14).',
    icon: 'i-lucide-calendar-clock',
    // Modulnya sudah ada tapi belum didaftarkan sebagai tab di
    // workspace referensi HR, jadi kartunya mendarat di grup yang
    // benar dan penggunanya memilih sendiri. Hapus catatan ini begitu
    // tabnya ditambahkan.
    link: reference('attendance-leave', 'shift-groups'),
    category: 'roster',
    order: 40,
    keywords: ['pola', 'roster', 'shift', '42/14', '56/14'],
  },
  {
    key: 'shifts',
    title: 'Shift & Shift Group',
    description: 'Jam kerja dan pengelompokannya.',
    icon: 'i-lucide-clock',
    link: reference('attendance-leave', 'shift-groups'),
    category: 'roster',
    order: 50,
  },

  // ---------------------------------------------------------------
  // Cuti & absensi
  // ---------------------------------------------------------------
  {
    key: 'leave-types',
    title: 'Leave Type',
    description: 'Jenis cuti: tahunan, sakit, melahirkan, dan seterusnya.',
    icon: 'i-lucide-calendar-off',
    link: reference('attendance-leave', 'leave-types'),
    category: 'leave',
    order: 10,
  },
  {
    key: 'rotation-purposes',
    title: 'Travel Purpose',
    description:
      'Alasan blok off: Field Break, Cuti Tahunan, Dinas. Penanda deducts_leave ada di sini.',
    icon: 'i-lucide-list-checks',
    link: reference('attendance-leave', 'rotation-purposes'),
    category: 'leave',
    order: 20,
    keywords: ['field break', 'potong saldo'],
  },
  {
    key: 'leave-reasons',
    title: 'Leave Reason',
    description: 'Alasan cuti yang bisa dipilih di form.',
    icon: 'i-lucide-message-square-text',
    link: reference('attendance-leave', 'leave-reasons'),
    category: 'leave',
    order: 30,
  },
  {
    key: 'attendance-statuses',
    title: 'Attendance Status',
    description: 'Status kehadiran: hadir, alpa, izin, dan seterusnya.',
    icon: 'i-lucide-user-check',
    link: reference('attendance-leave', 'attendance-statuses'),
    category: 'leave',
    order: 40,
  },
  {
    key: 'overtime-types',
    title: 'Overtime Type',
    description: 'Jenis lembur dan pengelompokannya.',
    icon: 'i-lucide-timer',
    link: reference('attendance-leave', 'overtime-types'),
    category: 'leave',
    order: 50,
  },
  {
    key: 'transport-modes',
    title: 'Transport Mode & Accommodation',
    description:
      'Moda perjalanan dan jenis akomodasi untuk Travel Request.',
    icon: 'i-lucide-plane',
    // Sama seperti Work Schedule: modulnya ada, tabnya belum.
    link: reference('attendance-leave', 'rotation-purposes'),
    category: 'leave',
    order: 60,
  },

  // ---------------------------------------------------------------
  // Kepegawaian
  // ---------------------------------------------------------------
  {
    key: 'employment-types',
    title: 'Employment Type & Status',
    description: 'Permanent, Contract, Daily, Intern, dan status kerjanya.',
    icon: 'i-lucide-briefcase',
    link: reference('employment', 'employment-types'),
    category: 'employment',
    order: 10,
  },
  {
    key: 'employee-groups',
    title: 'Employee Group',
    description:
      'Golongan pegawai. Dipakai Leave Policy untuk membedakan jatah site dan kantor.',
    icon: 'i-lucide-users',
    link: reference('employment', 'employee-groups'),
    category: 'employment',
    order: 20,
  },
  {
    key: 'contract-types',
    title: 'Contract & Probation Type',
    description: 'PKWT, Project, Seasonal, dan jenis masa percobaan.',
    icon: 'i-lucide-file-signature',
    link: reference('employment', 'contract-types'),
    category: 'employment',
    order: 30,
  },
  {
    key: 'job-levels',
    title: 'Job Level, Grade & Category',
    description: 'Jenjang jabatan dan pengelompokan pekerjaan.',
    icon: 'i-lucide-layers',
    link: reference('employment', 'job-levels'),
    category: 'employment',
    order: 40,
  },
  {
    key: 'termination-reasons',
    title: 'Termination Reason',
    description: 'Alasan berakhirnya hubungan kerja.',
    icon: 'i-lucide-door-open',
    link: reference('employee-separation', 'termination-reasons'),
    category: 'employment',
    order: 50,
  },

  // ---------------------------------------------------------------
  // Rekrutmen & pelatihan
  // ---------------------------------------------------------------
  {
    key: 'recruitment-sources',
    title: 'Recruitment Source',
    description: 'Sumber pelamar: job portal, referral, walk-in.',
    icon: 'i-lucide-user-plus',
    link: reference('recruitment', 'recruitment-sources'),
    category: 'recruitment',
    order: 10,
  },
  {
    key: 'candidate-statuses',
    title: 'Candidate Status & Interview Type',
    description: 'Tahapan kandidat dan jenis wawancara.',
    icon: 'i-lucide-contact',
    link: reference('recruitment', 'candidate-statuses'),
    category: 'recruitment',
    order: 20,
  },
  {
    key: 'training-categories',
    title: 'Training Category & Provider',
    description: 'Pengelompokan pelatihan dan penyelenggaranya.',
    icon: 'i-lucide-graduation-cap',
    link: reference('employee-training', 'training-category'),
    category: 'recruitment',
    order: 30,
  },
  {
    key: 'skills',
    title: 'Skill, Certificate & License',
    description: 'Kompetensi, sertifikat, dan izin yang dipegang pegawai.',
    icon: 'i-lucide-award',
    link: reference('skills-qualification', 'skills'),
    category: 'recruitment',
    order: 40,
  },

  // ---------------------------------------------------------------
  // Data pribadi
  // ---------------------------------------------------------------
  {
    key: 'personal',
    title: 'Gender, Religion & Nationality',
    description: 'Referensi data pribadi pegawai.',
    icon: 'i-lucide-id-card',
    link: reference('personal', 'genders'),
    category: 'personal',
    order: 10,
  },
  {
    key: 'marital-statuses',
    title: 'Marital Status & Blood Type',
    description:
      'Status kawin (S/M/D/W) dan golongan darah. PTKP ada di master Payroll, bukan di sini.',
    icon: 'i-lucide-heart',
    link: reference('personal', 'marital-statuses'),
    category: 'personal',
    order: 20,
    keywords: ['ptkp', 'status kawin'],
  },
  {
    key: 'educations',
    title: 'Education, Degree & Study Field',
    description: 'Jenjang pendidikan, gelar, dan bidang studi.',
    icon: 'i-lucide-book-open',
    link: reference('education', 'educations'),
    category: 'personal',
    order: 30,
  },
  {
    key: 'family-relationships',
    title: 'Family & Emergency Relationship',
    description: 'Hubungan keluarga dan kontak darurat.',
    icon: 'i-lucide-users',
    link: reference('family-emergency', 'family-relationships'),
    category: 'personal',
    order: 40,
  },

  // ---------------------------------------------------------------
  // Visitor Management
  // ---------------------------------------------------------------
  //
  // Dua master, bukan satu, dan itu bukan kerapian: "kenapa datang"
  // (rapat, audit) dan "datang sebagai apa" (vendor, pelanggan) adalah
  // dua sumbu. Satu master yang merangkap keduanya menghasilkan daftar
  // perkalian silang — "Rapat Vendor", "Rapat Pelanggan", "Audit
  // Vendor" — yang tidak bisa dilaporkan per salah satu sumbunya.
  {
    key: 'visit-purposes',
    title: 'Visit Purpose',
    description:
      'Alasan kunjungan tamu: Business Meeting, Site Visit, Audit, Interview, Vendor Visit.',
    icon: 'i-lucide-clipboard-list',
    link: reference('visitor', 'visit-purposes'),
    category: 'visitor',
    order: 10,
    keywords: ['tamu', 'kunjungan', 'visitor', 'keperluan', 'audit', 'vendor'],
  },
  {
    key: 'visit-types',
    title: 'Visit Type',
    description:
      'Sifat kunjungan: Official, Vendor, Customer, Contractor, Government.',
    icon: 'i-lucide-tags',
    link: reference('visitor', 'visit-types'),
    category: 'visitor',
    order: 20,
    keywords: ['tamu', 'visitor', 'jenis kunjungan', 'vendor', 'pelanggan'],
  },
]
