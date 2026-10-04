export default {
  employee: {
    title: 'Karyawan',
    titlePlural: 'Karyawan',
    fields: {
      employee_no: 'Nomor Karyawan',
      name: 'Nama',
      department: 'Departemen',
      section: 'Seksi',
      position: 'Jabatan',
      company: 'Perusahaan',
      location: 'Lokasi',
      join_date: 'Tanggal Bergabung',
      employment_type: 'Jenis Kepegawaian',
      cost_center: 'Pusat Biaya',
    },
  },

  attendance: {
    title: 'Kehadiran',
    fields: {
      work_date: 'Tanggal Kerja',
      check_in: 'Masuk',
      check_out: 'Pulang',
      shift: 'Shift',
    },
  },

  leave: {
    title: 'Cuti',
    titlePlural: 'Pengajuan Cuti',
    actions: {
      record: 'Catat Cuti',
      recorded: 'Cuti dicatat.',
      recordFailed: 'Cuti tidak bisa dicatat.',
    },
    annual: 'Cuti Tahunan',
    sick: 'Cuti Sakit',
    unpaid: 'Cuti Tanpa Gaji',
    maternity: 'Cuti Melahirkan',
    fields: {
      leave_type: 'Jenis Cuti',
      start_date: 'Tanggal Mulai',
      end_date: 'Tanggal Selesai',
      days: 'Jumlah Hari',
      balance: 'Sisa Cuti',
      reason: 'Alasan',
    },
  },

  calendar: {
    title: 'Kalender Kerja',
    holiday: 'Hari Libur',
    holidayPlural: 'Hari Libur',
  },

  shiftCalendar: {
    mySchedule: 'Jadwal Saya',
    showMySchedule: 'Tampilkan Jadwal Saya',
    employee: 'Pegawai',
  },

  roster: {
    title: 'Roster',
    adjustment: 'Penyesuaian Roster',
  },

  travel: {
    title: 'Pengajuan Perjalanan',
  },

  visitor: {
    title: 'Tamu',
  },

  /*
  | Travel Request (TR-CLEANUP-2) — teks bantu tab, kunci
  | `hr.travel-requests.tabHints.<tab>` dari generator.
  */
  'travel-requests': {
    tabHints: {
      accommodation: 'Setiap penginapan melekat pada satu rute perjalanan. Menambah baris di sini juga menambah rute — lengkapi atau koreksi di Travel Arrangement. Untuk menghapus penginapan, kosongkan kolomnya lalu simpan; rutenya tetap ada.',
    },
  },

  /*
  | Business Trip (BT-5) — kunci yang dipancarkan generator untuk modul
  | `hr/business-trips` dan `hr/business-trip-legs`, plus tab detail.
  */
  'business-trips': {
    title: 'Perjalanan Dinas',
    titlePlural: 'Perjalanan Dinas',
    placeholder: {
      search: 'Cari nomor dokumen, pegawai, tujuan…',
    },
    saveFirst: {
      assignment: 'Simpan Perjalanan Dinas terlebih dahulu — penugasan karyawan direkam saat disimpan.',
      travel: 'Simpan Perjalanan Dinas terlebih dahulu untuk menambahkan detail perjalanan dan akomodasi.',
      approval: 'Simpan Perjalanan Dinas terlebih dahulu untuk melihat persetujuan dan riwayatnya.',
    },
    tabs: {
      general: 'Umum',
      trip: 'Informasi Perjalanan',
      attachments: 'Lampiran',
      assignment: 'Penugasan',
      travel: 'Perjalanan & Akomodasi',
      approval: 'Persetujuan / Riwayat',
    },
    fields: {
      document_number: 'No. Dokumen',
      employee: 'Karyawan',
      request_date: 'Tanggal Pengajuan',
      status: 'Status',
      requester: 'Pengaju',
      purpose_category: 'Tujuan Dinas',
      purpose: 'Rincian Tujuan',
      destination_type: 'Jenis Tujuan',
      destination_location: 'Lokasi Tujuan',
      destination_city: 'Kota Tujuan',
      destination_country: 'Negara Tujuan',
      destination_detail: 'Keterangan Tujuan',
      destination_summary: 'Tujuan',
      origin_location: 'Asal',
      departure_datetime: 'Rencana Berangkat',
      return_datetime: 'Rencana Kembali',
      actual_departure_datetime: 'Berangkat Aktual',
      actual_return_datetime: 'Kembali Aktual',
      supersedes: 'Menggantikan / Memperpanjang',
      supersede_type: 'Jenis Hubungan',
      notes: 'Catatan',
      attachment: 'Lampiran',
      company: 'Perusahaan',
      branch: 'Cabang',
      location: 'Lokasi Kerja',
      division: 'Divisi',
      department: 'Departemen',
      section: 'Seksi',
      position: 'Jabatan',
      cost_center: 'Pusat Biaya',
      cancellation_reason: 'Alasan Pembatalan',
      is_active: 'Aktif',
      submitted_at: 'Diajukan',
      approved_at: 'Disetujui',
      rejected_at: 'Ditolak',
      completed_at: 'Selesai',
      cancelled_at: 'Dibatalkan',
      departed_at: 'Berangkat',
      assignment: 'Penugasan',
      travel: 'Perjalanan & Akomodasi',
      approval: 'Persetujuan / Riwayat',
    },
    actions: {
      submit: {
        label: 'Ajukan Persetujuan',
        confirm: {
          title: 'Ajukan perjalanan dinas ini?',
          description: 'Dokumen dikirim ke alur persetujuan dan tidak bisa disunting sampai keputusannya keluar.',
        },
      },
      approve: {
        label: 'Setujui',
      },
      reject: {
        label: 'Tolak',
        fields: {
          notes: 'Alasan',
        },
      },
      return: {
        label: 'Kembalikan untuk Revisi',
        fields: {
          notes: 'Alasan',
        },
      },
      withdraw: {
        label: 'Tarik Pengajuan',
      },
      depart: {
        label: 'Tandai Berangkat',
      },
      complete: {
        label: 'Selesaikan Perjalanan',
        fields: {
          actual_return_datetime: 'Kembali Aktual',
        },
      },
      cancel: {
        label: 'Batalkan Perjalanan',
        fields: {
          cancellation_reason: 'Alasan Pembatalan',
        },
      },
    },
    assignment: {
      hint: 'Diisi otomatis dari penempatan pegawai dan dibekukan saat diajukan. Tidak bisa diubah di sini.',
    },
    legs: {
      description: 'Itinerary berurutan: ruas berangkat, transit, dan kembali, lengkap dengan transportasi dan akomodasi.',
      empty: 'Belum ada ruas perjalanan.',
      locked: 'Ruas hanya bisa diubah selama perjalanan dinas masih bisa disunting (Draft atau Ditolak).',
    },
    lifecycle: {
      title: 'Progres Perjalanan',
      extensionHint: 'Kembali lebih lambat dari rencana adalah perpanjangan: perlu perjalanan dinas tersendiri yang disetujui. Selesaikan Perjalanan hanya menerima waktu kembali paling lambat sesuai rencana.',
    },
    cancellation: {
      title: 'Dibatalkan',
    },
    links: {
      title: 'Perjalanan Dinas Terkait',
      supersedes: {
        replacement: 'Menggantikan',
        extension: 'Memperpanjang',
      },
      supersededBy: {
        replacement: 'Digantikan oleh',
        extension: 'Diperpanjang oleh',
      },
    },
    approval: {
      title: 'Persetujuan',
      notSubmitted: 'Belum diajukan. Jejak persetujuan muncul setelah diajukan.',
      waitingFor: 'Menunggu {step} ({approver})',
    },
    timeline: {
      title: 'Riwayat',
    },
  },

  'business-trip-legs': {
    fields: {
      trip: 'Perjalanan Dinas',
      direction: 'Arah',
      sequence: 'Urutan',
      travel_start_date: 'Tanggal Berangkat',
      travel_end_date: 'Tanggal Tiba',
      origin: 'Dari',
      destination: 'Ke',
      transport_mode: 'Transportasi',
      transport_detail: 'Rincian Transportasi',
      ticket_number: 'No. Tiket',
      accommodation_needed: 'Perlu Akomodasi',
      accommodation_type: 'Jenis Akomodasi',
      accommodation_name: 'Akomodasi',
      check_in_date: 'Check-in',
      check_out_date: 'Check-out',
      notes: 'Catatan',
      is_active: 'Aktif',
    },
  },
} as const
