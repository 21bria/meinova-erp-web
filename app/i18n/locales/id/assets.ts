/*
| Manajemen Aset (ASSET-6). Struktur kuncinya cermin `en/assets.ts`.
|
| Istilah yang dipakai konsisten di seluruh modul:
|   Asset Register → Register Aset      Assignment → Penyerahan Aset
|   Transfer → Transfer Aset            Return → Pengembalian Aset
|   Custody → Penguasaan                Storage → Penyimpanan
|   Condition → Kondisi                 PIC → PIC
*/
export default {
  title: 'Manajemen Aset',

  categories: {
    fields: {
      code: 'Kode',
      name: 'Nama',
      description: 'Deskripsi',
      sort_order: 'Urutan',
      is_active: 'Aktif',
      requires_serial_number: 'Wajib Nomor Seri',
      allow_employee_custody: 'Boleh Dipegang Pegawai',
      allow_organization_custody: 'Boleh Dipegang Departemen',
    },
    placeholder: { search: 'Cari kode atau nama...' },
  },

  register: {
    fields: {
      asset_code: 'Kode Aset',
      status: 'Status',
      company: 'Perusahaan Pemilik',
      category: 'Kategori',
      name: 'Nama',
      description: 'Deskripsi',
      manufacturer: 'Pabrikan',
      model: 'Model',
      serial_number: 'Nomor Seri',
      tag_number: 'Nomor Tag',
      condition: 'Kondisi',
      location: 'Lokasi',
      facility: 'Fasilitas',
      custody_type: 'Penguasaan',
      custody_holder: 'Pemegang',
      current_custody: 'Penguasaan Saat Ini',
      acquisition_date: 'Tanggal Perolehan',
      acquisition_reference: 'Referensi Perolehan',
      supplier_name: 'Pemasok',
      warranty_until: 'Garansi Sampai',
      activated_at: 'Diaktifkan Pada',
      activated_by: 'Diaktifkan Oleh',
      is_active: 'Aktif',
      overview: 'Ringkasan',
      custody_history: 'Riwayat Penguasaan',
      condition_history: 'Riwayat Kondisi',
      documents: 'Dokumen',
    },
    tabs: {
      general: 'Umum',
      placement: 'Penempatan',
      acquisition: 'Perolehan',
    },
    actions: {
      activate: {
        label: 'Aktifkan',
        confirm: {
          title: 'Aktifkan aset ini?',
          description: 'Aset masuk penguasaan Penyimpanan di lokasinya. Sesudah aktif, aset hanya berpindah lewat dokumen penguasaan dan tidak bisa dihapus.',
        },
      },
      record_condition: {
        label: 'Catat Kondisi',
        fields: {
          condition: 'Kondisi',
          note: 'Catatan',
        },
      },
    },
    placeholder: { search: 'Cari kode aset, nomor seri, tag, atau nama...' },
  },

  assignments: {
    fields: {
      document_number: 'No. Dokumen',
      status: 'Status',
      summary: 'Ringkasan',
      target_custody_type: 'Diserahkan Kepada',
      asset: 'Aset',
      employee: 'Pegawai',
      cross_company_reason: 'Alasan Lintas Perusahaan',
      department: 'Departemen',
      pic_employee: 'PIC',
      location: 'Lokasi Tujuan',
      facility: 'Fasilitas Tujuan',
      purpose: 'Keperluan',
      notes: 'Catatan',
      company: 'Perusahaan Pemilik',
      source_location: 'Lokasi Asal',
      source_custody: 'Penguasaan Asal',
      is_cross_company: 'Lintas Perusahaan',
      employee_company: 'Perusahaan Pegawai',
      employee_location: 'Lokasi Pegawai',
      employee_department: 'Departemen Pegawai',
      handover_date: 'Tanggal Serah Terima',
      handover_condition: 'Kondisi Saat Serah Terima',
      resulting_custody: 'Penguasaan Hasil',
      submitted_at: 'Diajukan Pada',
      approved_at: 'Disetujui Pada',
      rejected_at: 'Ditolak Pada',
      cancelled_at: 'Dibatalkan Pada',
      completed_at: 'Selesai Pada',
      completed_by: 'Diselesaikan Oleh',
      is_active: 'Aktif',
    },
    tabs: {
      general: 'Umum',
      result: 'Hasil',
    },
    actions: {
      submit: {
        label: 'Ajukan',
        fields: {
          notes: 'Catatan',
        },
      },
      approve: {
        label: 'Setujui',
        fields: {
          notes: 'Catatan',
        },
      },
      reject: {
        label: 'Tolak',
        fields: {
          notes: 'Catatan',
        },
      },
      complete: {
        label: 'Selesaikan Serah Terima',
        fields: {
          handover_date: 'Tanggal Serah Terima',
          condition: 'Kondisi Saat Serah Terima',
          note: 'Catatan',
        },
        confirm: {
          title: 'Selesaikan serah terima?',
          description: 'Penguasaan aset berpindah dari penyimpanan ke penerima. Dokumen tidak bisa diubah lagi.',
        },
      },
      cancel: {
        label: 'Batalkan',
        fields: {
          notes: 'Catatan',
        },
      },
    },
    placeholder: { search: 'Cari no. dokumen, aset, atau no. pegawai...' },
  },

  returns: {
    fields: {
      document_number: 'No. Dokumen',
      status: 'Status',
      summary: 'Ringkasan',
      asset: 'Aset',
      reason: 'Alasan',
      destination_location: 'Lokasi Penyimpanan',
      destination_facility: 'Fasilitas Penyimpanan',
      notes: 'Catatan',
      company: 'Perusahaan Pemilik',
      source_custody: 'Penguasaan Asal',
      source_custody_type: 'Dikembalikan Dari',
      source_employee: 'Pegawai',
      source_department: 'Departemen',
      source_pic_employee: 'PIC',
      source_location: 'Lokasi Asal',
      source_facility: 'Fasilitas Asal',
      return_date: 'Tanggal Pengembalian',
      return_condition: 'Kondisi Saat Kembali',
      resulting_custody: 'Penguasaan Hasil',
      submitted_at: 'Diajukan Pada',
      approved_at: 'Disetujui Pada',
      rejected_at: 'Ditolak Pada',
      cancelled_at: 'Dibatalkan Pada',
      completed_at: 'Selesai Pada',
      completed_by: 'Diselesaikan Oleh',
      is_active: 'Aktif',
    },
    tabs: {
      general: 'Umum',
      source: 'Asal',
      result: 'Hasil',
    },
    actions: {
      submit: {
        label: 'Ajukan',
        fields: {
          notes: 'Catatan',
        },
      },
      approve: {
        label: 'Setujui',
        fields: {
          notes: 'Catatan',
        },
      },
      reject: {
        label: 'Tolak',
        fields: {
          notes: 'Catatan',
        },
      },
      complete: {
        label: 'Terima Pengembalian',
        fields: {
          return_date: 'Tanggal Pengembalian',
          condition: 'Kondisi Saat Kembali',
          note: 'Catatan',
        },
        confirm: {
          title: 'Terima pengembalian?',
          description: 'Penguasaan aset kembali ke penyimpanan tujuan. Dokumen tidak bisa diubah lagi.',
        },
      },
      cancel: {
        label: 'Batalkan',
        fields: {
          notes: 'Catatan',
        },
      },
    },
    placeholder: { search: 'Cari no. dokumen, aset, atau no. pegawai...' },
  },

  transfers: {
    fields: {
      document_number: 'No. Dokumen',
      status: 'Status',
      summary: 'Ringkasan',
      asset: 'Aset',
      target_custody_type: 'Ditransfer Ke',
      reason: 'Alasan',
      target_employee: 'Pegawai',
      cross_company_reason: 'Alasan Lintas Perusahaan',
      target_department: 'Departemen',
      target_pic_employee: 'PIC',
      target_location: 'Lokasi Tujuan',
      target_facility: 'Fasilitas Tujuan',
      notes: 'Catatan',
      company: 'Perusahaan Pemilik',
      source_custody: 'Penguasaan Asal',
      source_custody_type: 'Dari',
      source_employee: 'Pegawai',
      source_department: 'Departemen',
      source_pic_employee: 'PIC',
      source_location: 'Lokasi Asal',
      source_facility: 'Fasilitas Asal',
      is_cross_company: 'Lintas Perusahaan',
      employee_company: 'Perusahaan Pegawai',
      employee_location: 'Lokasi Pegawai',
      employee_department: 'Departemen Pegawai',
      transfer_date: 'Tanggal Transfer',
      transfer_condition: 'Kondisi Saat Transfer',
      resulting_custody: 'Penguasaan Hasil',
      submitted_at: 'Diajukan Pada',
      approved_at: 'Disetujui Pada',
      rejected_at: 'Ditolak Pada',
      cancelled_at: 'Dibatalkan Pada',
      completed_at: 'Selesai Pada',
      completed_by: 'Diselesaikan Oleh',
      is_active: 'Aktif',
    },
    tabs: {
      general: 'Umum',
      source: 'Asal',
      result: 'Hasil',
    },
    actions: {
      submit: {
        label: 'Ajukan',
        fields: {
          notes: 'Catatan',
        },
      },
      approve: {
        label: 'Setujui',
        fields: {
          notes: 'Catatan',
        },
      },
      reject: {
        label: 'Tolak',
        fields: {
          notes: 'Catatan',
        },
      },
      complete: {
        label: 'Selesaikan Transfer',
        fields: {
          transfer_date: 'Tanggal Transfer',
          condition: 'Kondisi Saat Transfer',
          note: 'Catatan',
        },
        confirm: {
          title: 'Selesaikan transfer?',
          description: 'Penguasaan aset berpindah ke tujuan. Dokumen tidak bisa diubah lagi.',
        },
      },
      cancel: {
        label: 'Batalkan',
        fields: {
          notes: 'Catatan',
        },
      },
    },
    placeholder: { search: 'Cari no. dokumen, aset, atau no. pegawai...' },
  },

  ui: {
    custody: {
      title: 'Penguasaan Saat Ini',
      none: 'Belum ada penguasaan — aset masuk Penyimpanan saat diaktifkan.',
      holder: 'Pemegang',
      employee: 'Pegawai',
      department: 'Departemen',
      pic: 'PIC',
      noPic: 'Tanpa PIC',
      location: 'Lokasi',
      facility: 'Fasilitas',
      since: 'Sejak',
      openedBy: 'Dibuka Oleh',
      until: 'Sampai',
      current: 'Saat Ini',
      condition: 'Kondisi',
      storage: 'Di penyimpanan — bisa diserahkan lewat Penyerahan Aset bila kondisinya layak.',
    },
    overview: {
      identity: 'Identitas',
      acquisition: 'Perolehan',
      noValue: 'Nilai buku dan penyusutan dicatat di Aset Tetap, bukan di sini.',
    },
    history: {
      custodyEmpty: 'Belum ada riwayat penguasaan.',
      conditionEmpty: 'Belum ada riwayat kondisi.',
      recordedBy: 'Dicatat Oleh',
      source: 'Sumber',
      from: 'Dari',
      to: 'Menjadi',
      note: 'Catatan',
      loadFailed: 'Riwayat tidak bisa dimuat.',
    },
    documents: {
      assignments: 'Penyerahan Aset',
      transfers: 'Transfer Aset',
      returns: 'Pengembalian Aset',
      empty: 'Tidak ada dokumen.',
      open: 'Buka',
      date: 'Tanggal',
    },
    lifecycle: {
      title: 'Siklus Dokumen',
      from: 'Dari',
      to: 'Ke',
      approval: 'Persetujuan',
      noWorkflow: 'Tidak ada alur persetujuan — dokumen langsung disetujui saat diajukan.',
      hint: {
        draft: 'Draf — belum ada yang dipesan. Ajukan untuk memesan aset.',
        submitted: 'Diajukan — aset dipesan selama menunggu persetujuan.',
        approved: 'Disetujui — menunggu serah terima fisik. Penguasaan belum berpindah.',
        completed: 'Selesai — penguasaan sudah berpindah. Dokumen tidak bisa diubah lagi.',
        rejected: 'Ditolak — pemesanan aset sudah dilepas.',
        cancelled: 'Dibatalkan — pemesanan aset sudah dilepas.',
      },
      approvedBadge: 'Disetujui — menunggu serah terima',
    },
  },
}
