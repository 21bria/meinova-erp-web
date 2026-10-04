export default {
  /*
   * Keadaan pengecualian pada baris presensi (`permission_state`).
   *
   * Ber-field, **bukan** di `common.status`: kode `partial` sudah
   * dipakai domain lain dengan arti yang sama sekali berbeda ("Partially
   * Paid" pada status pembayaran). Satu kata milik satu kolom yang
   * ditaruh di katalog bersama mengganti nama kode domain lain tanpa
   * peringatan — dan yang menemukannya nanti bukan test, tapi orang yang
   * membaca tagihannya.
   */
  permission_state: {
    pending: 'Izin Menunggu Persetujuan',
    excused: 'Tertutup Izin',
    partial: 'Sebagian Tertutup Izin',
    unauthorized: 'Tanpa Izin',
  },

  approver_type: {
    user: 'Pengguna Tertentu',
    role: 'Pemegang Peran',
    position: 'Hierarki Jabatan',
    manager: 'Atasan Langsung',
    department_head: 'Kepala Departemen',
  },

  assignment_type: {
    user: 'Pengguna Tertentu',
    role: 'Pemegang Peran',
    position: 'Hierarki Jabatan',
    manager: 'Atasan Langsung',
    department_head: 'Kepala Departemen',
    fallback_role: 'Peran Cadangan',
  },

  approver_scope: {
    tenant: 'Seluruh Tenant',
    company: 'Perusahaan',
    branch: 'Cabang',
    location: 'Lokasi',
    division: 'Divisi',
    department: 'Departemen',
    section: 'Seksi',
  },

  approval_mode: {
    any: 'Cukup Salah Satu',
    all: 'Semua Penyetuju',
  },
  /*
   * Nama modul sebagai kode enum (kolom "Module" di Help Center dan
   * Audit). Ditaruh per field, bukan di `common.status`, karena `hr`
   * dan `workflow` di sana sudah dipakai sebagai induk kode ber-titik
   * (`hr.contract_end`) — satu kunci tidak bisa sekaligus jadi teks
   * dan jadi induk.
   */
  module: {
    administration: 'Administrasi',
    finance: 'Keuangan',
    hr: 'HR',
    payroll: 'Penggajian',
    scm: 'Rantai Pasok',
    workflow: 'Alur Kerja',
  },

  /*
   * Business Trip (BT-5). Per field: `return`, `other`, `meeting` adalah
   * kode generik yang bisa berarti lain di modul lain.
   */
  purpose_category: {
    duty: 'Tugas Dinas',
    site_visit: 'Kunjungan Site',
    meeting: 'Rapat',
    training: 'Pelatihan',
    audit: 'Audit / Inspeksi',
    other: 'Lainnya',
  },

  destination_type: {
    internal_location: 'Lokasi Perusahaan',
    external_domestic: 'Eksternal — Dalam Negeri',
    external_international: 'Eksternal — Luar Negeri',
  },

  supersede_type: {
    replacement: 'Pengganti',
    extension: 'Perpanjangan',
  },

  // Arah ruas Business Trip.
  direction: {
    outbound: 'Berangkat',
    return: 'Kembali',
    intermediate: 'Transit',
  },
  /*
   * Manajemen Aset (ASSET-6). Jenis penguasaan dibatasi per field karena
   * `common.status.employee` sudah bermakna lain di domain lain.
   */
  custody_type: {
    employee: 'Pegawai',
    organization: 'Departemen',
    storage: 'Penyimpanan',
  },
  source_custody_type: {
    employee: 'Pegawai',
    organization: 'Departemen',
    storage: 'Penyimpanan',
  },
  target_custody_type: {
    employee: 'Pegawai',
    organization: 'Departemen',
    storage: 'Penyimpanan',
  },
  condition: {
    good: 'Baik',
    fair: 'Cukup',
    damaged: 'Rusak',
    unserviceable: 'Tidak Layak Pakai',
  },
  handover_condition: {
    good: 'Baik',
    fair: 'Cukup',
    damaged: 'Rusak',
    unserviceable: 'Tidak Layak Pakai',
  },
  return_condition: {
    good: 'Baik',
    fair: 'Cukup',
    damaged: 'Rusak',
    unserviceable: 'Tidak Layak Pakai',
  },
  transfer_condition: {
    good: 'Baik',
    fair: 'Cukup',
    damaged: 'Rusak',
    unserviceable: 'Tidak Layak Pakai',
  },
  // Alasan Pengembalian + Transfer Aset (kodenya tidak tumpang tindih).
  reason: {
    end_of_use: 'Selesai Dipakai',
    separation: 'Pegawai Keluar',
    replacement: 'Penggantian',
    damage: 'Kerusakan',
    reassignment: 'Pindah Pemegang',
    pic_change: 'Ganti PIC',
    relocation: 'Relokasi',
    reorganization: 'Reorganisasi',
  },
  // Sumber riwayat kondisi aset — dibaca eksplisit oleh tab riwayat.
  condition_source: {
    registration: 'Registrasi',
    inspection: 'Inspeksi',
    handover: 'Serah Terima',
    return: 'Pengembalian',
    transfer: 'Transfer',
  },
  // Employee Group — dokumen perjalanan turunan (TR/BT POLICY-1).
  travel_document: {
    travel_request: 'Travel Request',
    business_trip: 'Perjalanan Dinas',
    both: 'Travel Request + Perjalanan Dinas',
    none: 'Tidak ada dokumen perjalanan yang aktif',
  },
  // Employee Group — peringatan konfigurasi; tidak pernah menahan simpan.
  travel_document_warnings: {
    both: 'Pegawai dalam grup ini dapat menggunakan Travel Request dan Perjalanan Dinas. Gunakan masing-masing dokumen sesuai tujuan perjalanannya.',
    none: 'Pegawai dalam grup ini tidak dapat menggunakan Travel Request maupun Perjalanan Dinas.',
  },
} as const
