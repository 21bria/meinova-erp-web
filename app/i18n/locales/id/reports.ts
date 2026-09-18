/*
| Katalog modul Reports — lihat versi `en`.
*/
export default {
  hr: {
    'period-summary': {
      description: {
        attendance_trend: 'Hadir, telat, dan tidak hadir per satuan periode. Cuti, libur, dan hari off tidak dihitung sebagai peluang hadir.',
        leave_breakdown: 'Annual, Sick, Other Leave, dan Unpaid adalah pengelompokan laporan; tipe cuti aslinya tetap terbaca di drill-down.',
        overtime_trend: 'Jam lembur per kategori hari — terjadwal, off, dan libur.',
        department_comparison: 'Hadir dan tidak hadir per department.',
        employee_period_summary: 'Satu baris per pegawai untuk periode dan filter yang sedang dipilih. Tekan angkanya untuk melihat catatan sumbernya.',
      },
      fields: {
        employee_number: 'ID Karyawan',
        employee: 'Karyawan',
        location: 'Lokasi',
        scheduled: 'Terjadwal',
        present: 'Hadir',
        absent: 'Tidak Hadir',
        annual: 'Cuti Tahunan',
        sick: 'Sakit',
        other_leave: 'Cuti Lainnya',
        unpaid: 'Cuti Tanpa Upah',
        field_break: 'Field Break',
        off_worked: 'Masuk Hari Off',
        holiday_worked: 'Masuk Hari Libur',
        late: 'Terlambat',
        early: 'Pulang Cepat',
        ot_regular: 'Lembur Reguler',
        ot_off: 'Lembur Hari Off',
        ot_holiday: 'Lembur Hari Libur',
        ot_total: 'Total Lembur',
      },
    },
  },
} as const
