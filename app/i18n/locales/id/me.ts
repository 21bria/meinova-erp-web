export default {
  workspace: {
    title: 'Ruang Kerja Saya',
    subtitle: 'Berikut ringkasan aktivitas dan pekerjaan Anda hari ini.',
    detailHint: 'Mencari data lengkap Anda? Buka Profil Saya.',
    greeting: {
      morning: 'Selamat pagi',
      afternoon: 'Selamat siang',
      evening: 'Selamat sore',
      night: 'Selamat malam',
    },
  },

  profile: {
    title: 'Profil Saya',
    readOnlyHint:
      'Halaman ini hanya untuk dibaca. Hubungi HR kalau ada yang perlu diperbaiki.',
  },

  /*
  | Satuan durasi, **netral terhadap kartunya**.
  |
  | Dibaca `durationText()`, yang dipakai kartu Lembur di `/me` maupun
  | kartu Jam Kerja dan kolom tabel di `/me/attendance`. Dulu kunci ini
  | tinggal di `cards.overtime`, dan di situ satu perbaikan kalimat
  | lembur akan ikut mengubah cara jam kerja ditulis.
  */
  duration: {
    hours: '{hours} jam',
    hoursMinutes: '{hours} jam {minutes} menit',
    minutes: '{minutes} menit',
  },

  attendance: {
    title: 'Kehadiran Saya',
    subtitle: 'Ringkasan kehadiran dan jam kerja Anda.',

    range: {
      label: 'Periode',
      previous: 'Periode sebelumnya',
      next: 'Periode berikutnya',
      pick: 'Pilih tanggal',
      apply: 'Terapkan',
      max: 'Maksimal {days} hari per periode.',
      /* Ditampilkan hanya saat pengguna memilih rentang yang ditolak
         backend — kalimatnya menyebut batasnya, bukan "terjadi
         kesalahan". */
      tooLong: 'Rentang maksimal {days} hari. Persempit tanggalnya.',
    },

    presets: {
      last7: '7 Hari',
      last14: '14 Hari',
      last30: '30 Hari',
      thisMonth: 'Bulan Ini',
      lastMonth: 'Bulan Lalu',
      custom: 'Kustom',
    },

    summary: {
      title: 'Ringkasan Kehadiran',
      workDays: 'Hari Kerja',
      present: 'Hadir',
      late: 'Terlambat',
      absent: 'Tidak Hadir',
      businessTrip: 'Perjalanan Dinas',
      leave: 'Cuti / Izin',
      workedHours: 'Jam Kerja',
      overtime: 'Lembur',
      /* Bukan nol. Dipakai saat Employee Group mematikan prosesnya. */
      notApplicable: 'Tidak berlaku',
      notApplicableHint: 'Proses ini tidak berlaku untuk Anda.',
      days: '{count} hari',
    },

    chart: {
      title: 'Ringkasan Periode',
      legend: 'Warna mengikuti status tiap hari dalam periode.',
      empty: 'Belum ada hari yang bisa dirangkum pada periode ini.',
    },

    outcome: {
      present: 'Hadir',
      late: 'Terlambat',
      absent: 'Tidak Hadir',
      leave: 'Cuti / Izin',
      business_trip: 'Perjalanan Dinas',
      extra: 'Kerja di Luar Jadwal',
      off: 'Tidak Dijadwalkan',
    },

    history: {
      title: 'Riwayat Kehadiran',
      empty: 'Tidak ada catatan kehadiran pada periode ini.',
      emptyHint: 'Coba ubah periodenya.',
      columns: {
        date: 'Tanggal',
        shift: 'Shift',
        status: 'Status',
        source: 'Sumber',
        checkIn: 'Masuk',
        checkOut: 'Pulang',
        worked: 'Kerja',
        late: 'Telat',
        overtime: 'Lembur',
      },
      /* Menit ditulis apa adanya di kolom sempit; jam-menit dipakai di
         kartu. Keduanya sengaja berbeda supaya kolomnya tidak pecah. */
      minutes: '{minutes}m',
      noTime: '—',
    },

    pagination: {
      perPage: '{count} / halaman',
      summary: '{from}–{to} dari {count}',
      previous: 'Sebelumnya',
      next: 'Berikutnya',
    },
  },

  punch: {
    title: 'Absen Masuk',
    subtitle: 'Catat kehadiran Anda: lokasi, selfie, lalu kirim.',
    viewAttendance: 'Lihat Absensi',
    notEnabled: 'Absen dari Self Service tidak diaktifkan untuk akun Anda.',
    trialNotice: 'Uji coba absensi GPS — lokasi dan selfie diperiksa, tetapi absensi belum dicatat.',
    step: {
      location: '1. Lokasi',
      selfie: '2. Selfie',
      submit: '3. Kirim',
    },
    getLocation: 'Ambil lokasi saya',
    refreshLocation: 'Ambil lokasi ulang',
    locating: 'Mengambil lokasi…',
    acquired: 'Lokasi didapat',
    notAcquired: 'Lokasi belum didapat',
    accuracy: 'Akurasi ±{value} m',
    lowAccuracy: 'Akurasi lebih buruk dari batas {limit} m. Pindah ke tempat terbuka lalu coba lagi.',
    selfieHint: 'Ambil selfie dengan kamera depan.',
    selfieTake: 'Ambil selfie',
    selfieRetake: 'Ambil ulang selfie',
    selfieReady: 'Selfie siap',
    checkIn: 'Check in',
    checkOut: 'Check out',
    sending: 'Mengirim…',
    errors: {
      insecure_context: 'Lokasi hanya bisa dipakai di alamat aman (HTTPS). Buka halaman ini lewat https:// lalu coba lagi.',
      unsupported: 'Browser ini tidak bisa memberikan lokasi.',
      permission_denied: 'Izin lokasi ditolak. Izinkan lokasi untuk situs ini di pengaturan browser, lalu coba lagi.',
      position_unavailable: 'Lokasi Anda tidak tersedia. Nyalakan GPS/Layanan Lokasi lalu coba lagi.',
      timeout: 'Pengambilan lokasi terlalu lama. Coba lagi, sebaiknya di tempat terbuka.',
      upload: 'Selfie gagal diunggah. Coba lagi.',
      submit: 'Tap gagal dikirim. Coba lagi.',
    },
    result: {
      heading: {
        trial: 'Hasil uji coba — absensi belum dicatat',
        success: 'Absensi tercatat',
        warning: 'Dicatat untuk ditinjau HR',
        error: 'Tidak diterima',
      },
      location: 'GPS',
      geofence: 'Area kerja',
      distance: '{distance} m dari titik pusat area kerja (radius {radius} m)',
      selfie: 'Selfie',
      selfieStored: 'Tersimpan sebagai bukti',
      selfieMissing: 'Tidak dikirim',
      biometric: 'Verifikasi wajah',
      biometricUnavailable: 'Tidak aktif pada uji coba ini',
      attendance: 'Kehadiran',
      attendanceNotRecorded: 'Tidak dicatat (uji coba)',
      attendanceRecorded: 'Tercatat',
    },
    values: {
      pass: 'OK',
      low_accuracy: 'Akurasi terlalu rendah',
      unavailable: 'Tidak tersedia',
      inside: 'Di dalam',
      outside: 'Di luar',
      no_geofence: 'Area kerja belum diatur',
      no_work_location: 'Lokasi kerja tidak ada',
      not_run: 'Tidak diperiksa',
      not_configured: 'Belum terpasang',
      error: 'Galat',
    },
  },

  sections: {
    today: 'Hari Ini',
    myServices: 'Layanan Saya',
    latestPayslip: 'Slip Gaji Terbaru',
    quickActions: 'Aksi Cepat',
    workInfo: 'Informasi Pekerjaan',
    personal: 'Informasi Pribadi',
    contact: 'Kontak & Alamat',
    employment: 'Kepegawaian',
    organization: 'Organisasi',
    emergency: 'Kontak Darurat',
    emergencyHint: 'Yang kami hubungi kalau terjadi sesuatu pada Anda saat bekerja.',
  },

  cards: {
    profile: {
      title: 'Profil Saya',
      description: 'Data pribadi dan kepegawaian Anda.',
    },

    schedule: {
      title: 'Jadwal Hari Ini',
      empty: 'Tidak ada jadwal hari ini',
      noShift: 'Tidak ada shift yang dijadwalkan',
    },

    attendance: {
      title: 'Kehadiran',
      empty: 'Belum ada catatan kehadiran hari ini',
      checkIn: 'Masuk {time}',
      checkOut: 'Keluar {time}',
      noCheckOut: 'Belum checkout',
      late: 'Terlambat {minutes} menit',
    },

    requests: {
      title: 'Tugas & Permintaan',
      empty: 'Tidak ada permintaan yang menunggu',
      waiting: '{count} menunggu',
      needsAction: '{count} perlu tindakan',
    },

    leave: {
      title: 'Cuti',
      empty: 'Belum ada saldo cuti tercatat',
      days: 'Sisa {days} hari',
    },

    permission: {
      title: 'Izin',
      empty: 'Belum ada pengajuan izin',
      latest: 'Pengajuan terakhir',
      pending: '{count} menunggu keputusan',
    },

    overtime: {
      title: 'Lembur',
      empty: 'Belum ada lembur bulan ini',
      thisMonth: 'Bulan ini',
    },

    payslip: {
      title: 'Slip Gaji Terbaru',
      empty: 'Belum ada slip gaji',
      issued: 'terbit {date}',
    },
  },

  /*
  | Dua kelompok kode yang **tidak** punya rumah di katalog bersama.
  |
  | Status kehadiran (`late`, `present`, …) dan status dokumen
  | (`approved`, `in_review`, …) sengaja TIDAK ada di sini: keduanya
  | sudah lengkap di `common.status.*` untuk kedua bahasa, dibaca
  | seluruh tabel HR lewat `codeLabel()`. Menyalinnya ke sini berarti
  | "Terlambat" punya dua sumber kata yang harus tetap sepakat — dan
  | yang satu akan ketinggalan.
  |
  | Yang tinggal di bawah cuma yang memang tidak punya padanan di sana.
  */
  rosterState: {
    work: 'Masuk Kerja',
    field_break: 'Field Break',
    travel_out: 'Perjalanan Berangkat',
    travel_in: 'Perjalanan Pulang',
    off: 'Libur',
    holiday: 'Hari Libur',
    recovery: 'Hari Pemulihan',
    unplanned: 'Belum Dijadwalkan',
    not_applicable: 'Tidak Berlaku',
  },

  permissionType: {
    late_arrival: 'Datang Terlambat',
    early_leave: 'Pulang Awal',
    temporary_out: 'Keluar Sementara',
    full_day: 'Izin Sehari Penuh',
  },

  status: {
    active: 'Aktif',
    inactive: 'Tidak Aktif',
  },

  /*
  | Label tombol, **dikunci ke `code` yang dikirim backend**.
  |
  | Backend yang memutuskan tombol mana yang layak tampil dan ke mana ia
  | menuju; katalog ini cuma memberi kata-katanya. Tombol dengan kode
  | yang belum diterjemahkan tidak akan pernah muncul tanpa teks — yang
  | muncul kodenya sendiri, dan itu langsung terlihat salah.
  */
  actions: {
    viewProfile: 'Lihat Profil',
    retry: 'Coba lagi',

    profile: 'Profil Saya',
    check_in: 'Absen Masuk',
    schedule: 'Lihat Jadwal',
    attendance: 'Lihat Kehadiran',
    approvals: 'Perlu Tindakan',
    submissions: 'Permintaan Saya',
    leave_request: 'Ajukan Cuti',
    permission_request: 'Ajukan Izin',
    overtime_request: 'Ajukan Lembur',
    payslip: 'Lihat Slip Gaji',
  },

  requests: {
    employee: 'Karyawan',
    personalHint: 'Pengajuan ini untuk diri Anda sendiri. Untuk mengajukan atas nama orang lain, gunakan modul HR.',
    submit: 'Kirim Pengajuan',
    submitting: 'Mengirim…',
    cancel: 'Batal',
    submitted: 'Pengajuan dikirim untuk persetujuan.',
    failed: 'Pengajuan tidak dapat dikirim.',
  },

  states: {
    unavailable: 'Profil tidak bisa dibuka',
    notLinked:
      'Akun Anda belum ditautkan ke data pegawai. Silakan hubungi HR.',
    inactive:
      'Data pegawai Anda tidak aktif, jadi Self Service tidak bisa dibuka. Hubungi HR kalau ini keliru.',
    notAuthenticated: 'Sesi Anda sudah berakhir. Silakan masuk lagi.',
    genericError: 'Profil Anda gagal dimuat. Silakan coba lagi.',
  },

  fields: {
    gender: 'Jenis Kelamin',
    birthPlace: 'Tempat Lahir',
    birthDate: 'Tanggal Lahir',
    maritalStatus: 'Status Pernikahan',
    nationality: 'Kewarganegaraan',
    bloodType: 'Golongan Darah',
    religion: 'Agama',

    personalEmail: 'Email Pribadi',
    workEmail: 'Email Kantor',
    phone: 'Telepon',
    mobile: 'Ponsel',
    address: 'Alamat',

    employmentStatus: 'Status Kepegawaian',
    employmentType: 'Jenis Kepegawaian',
    joinDate: 'Tanggal Bergabung',
    effectiveDate: 'Tanggal Berlaku',
    confirmationDate: 'Tanggal Pengangkatan',
    jobLocation: 'Lokasi Kerja',

    company: 'Perusahaan',
    branch: 'Cabang',
    location: 'Lokasi',
    division: 'Divisi',
    department: 'Departemen',
    section: 'Seksi',
    position: 'Jabatan',
    jobLevel: 'Jenjang Jabatan',
    jobGrade: 'Golongan',
    costCenter: 'Cost Center',
    supervisor: 'Atasan',

    emergencyName: 'Nama Kontak',
    emergencyPhone: 'Telepon Kontak',
  },
} as const
