/*
| Dialog rincian (drill-down) laporan dashboard — `MDashboardTable`.
| Lihat versi `en` untuk aturan kodenya.
*/
export default {
  viewDetails: 'Lihat rincian',
  title: 'Rincian',
  intro: 'Catatan sumber yang menyusun angka ini.',
  loadError: 'Gagal memuat rincian',
  empty: 'Tidak ada catatan untuk angka ini.',
  truncated: 'Hanya sebagian catatan yang ditampilkan.',
  openSource: 'Buka {source}',

  columns: {
    date: 'Tanggal',
    description: 'Keterangan',
    reference: 'Referensi',
    value: 'Nilai',
    scheduled_in: 'Jadwal Masuk',
    actual_in: 'Aktual Masuk',
    scheduled_out: 'Jadwal Pulang',
    actual_out: 'Aktual Pulang',
    late_duration: 'Durasi Terlambat',
    early_duration: 'Durasi Pulang Cepat',
    duration: 'Durasi',
    worked_duration: 'Durasi Kerja',
    clock_in: 'Jam Masuk',
    clock_out: 'Jam Pulang',
    start: 'Mulai',
    end: 'Selesai',
    overtime_type: 'Jenis Lembur',
    reason: 'Alasan',
    leave_type: 'Jenis Cuti',
    date_range: 'Periode Cuti',
    quantity: 'Hari',
    document: 'No. Dokumen',
    status: 'Status',
    source: 'Sumber',
  },

  sources: {
    attendance: 'Kehadiran',
    leave: 'Cuti',
    overtime: 'Lembur',
    roster: 'Jadwal Roster',
  },

  summary: {
    occurrence: '{count} kejadian',
    occurrences: '{count} kejadian',
    day: '{count} hari',
    days: '{count} hari',
    record: '{count} catatan',
    records: '{count} catatan',
    total: 'total {duration}',
    totalHours: 'total {duration} = {hours} jam',
    source: 'sumber {source}',
    missingDuration: '{count} tanpa durasi tercatat',
  },

  duration: {
    minutes: '{m}m',
    hours: '{h}j',
    hoursMinutes: '{h}j {m}m',
  },

  excused: '{duration} diizinkan',
  noRecord: 'Tidak ada catatan kehadiran',
} as const
