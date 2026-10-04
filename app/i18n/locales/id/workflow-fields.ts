/*
| Label field layar Workflow — sisi Bahasa Indonesia.
|
| Kalimat-kalimat ini **persis yang tampil sebelum tahap ini**, waktu
| masih ditulis di `apps/workflow/api/*/

export default {
  definitions: {
    fields: {
      code: 'Kode',
      name: 'Nama',
      module: 'Modul',
      document_type: 'Jenis Dokumen',
      status: 'Status',
      version: 'Versi',
      description: 'Keterangan',
      company: 'Perusahaan',
      branch: 'Cabang',
      location: 'Lokasi',
      employee_group: 'Kelompok Pegawai',
      scope_label: 'Berlaku Untuk',
      specificity: 'Skor Prioritas',
      is_active: 'Aktif',
      instances: 'Dokumen Berjalan',
    },
    // Grid Approval Step yang tertanam di layar ini menampilkan
    // field milik resource LAIN. Ruang kuncinya sendiri supaya
    // `name` di sini ('Nama Tahap') tidak bertabrakan dengan
    // `fields.name` milik Definition ('Nama').
    steps: {
      fields: {
        definition: 'Alur Kerja',
        sequence: 'Tahap',
        name: 'Nama Tahap',
        description: 'Keterangan',
        approver_type: 'Tipe Penyetuju',
        level: 'Tingkat',
        approver_role: 'Peran',
        approver_scope: 'Cakupan Peran',
        approver_user: 'Pengguna',
        approver_position: 'Jabatan',
        fallback_role: 'Peran Cadangan',
        approval_mode: 'Mode Persetujuan',
        minimum_approvals: 'Minimum Persetujuan',
        is_required: 'Wajib',
        can_reject: 'Boleh Menolak',
        can_return: 'Boleh Mengembalikan',
        condition: 'Syarat',
      },
    },
    tabs: {
      general: 'Umum',
      scope: 'Cakupan',
      steps: 'Tahapan Persetujuan',
    },
  },

  steps: {
    fields: {
      definition: 'Alur Kerja',
      sequence: 'Tahap',
      name: 'Nama Tahap',
      description: 'Keterangan',
      approver_type: 'Tipe Penyetuju',
      level: 'Tingkat',
      approver_role: 'Peran',
      approver_scope: 'Cakupan Peran',
      approver_user: 'Pengguna',
      approver_position: 'Jabatan',
      fallback_role: 'Peran Cadangan',
      approval_mode: 'Mode Persetujuan',
      minimum_approvals: 'Minimum Persetujuan',
      is_required: 'Wajib',
      can_reject: 'Boleh Menolak',
      can_return: 'Boleh Mengembalikan',
      condition: 'Syarat',
      is_active: 'Aktif',
    },
  },

  instances: {
    fields: {
      document_number: 'No. Dokumen',
      document_label: 'Dokumen',
      module: 'Modul',
      document_type: 'Jenis Dokumen',
      subject_employee: 'Pegawai',
      subject_number: 'No. Pegawai',
      status: 'Status',
      current_step_name: 'Menunggu Di',
      definition_name: 'Alur Kerja',
      submitted_at: 'Diajukan Pada',
      completed_at: 'Selesai Pada',
      submitted_by_name: 'Diajukan Oleh',
      notes: 'Catatan',
      company_name: 'Perusahaan',
      location_name: 'Lokasi',
    },
    tabs: {
      document: 'Dokumen',
      state: 'Alur Kerja',
    },
  },

  delegations: {
    fields: {
      delegator: 'Pemberi Kuasa',
      delegate: 'Penerima Kuasa',
      starts_at: 'Mulai',
      ends_at: 'Berakhir',
      is_active: 'Aktif',
      is_running: 'Berlaku Sekarang',
      module: 'Modul',
      document_type: 'Jenis Dokumen',
      reason: 'Alasan',
    },
  },

} as const
