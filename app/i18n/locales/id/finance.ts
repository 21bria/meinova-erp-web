export default {
  title: 'Keuangan',
  chartOfAccounts: 'Bagan Akun',
  journalEntry: 'Jurnal',
  journalEntryPlural: 'Jurnal',
  accountsPayable: 'Utang Usaha',
  accountsReceivable: 'Piutang Usaha',
  cashBank: 'Kas & Bank',
  budget: 'Anggaran',
  fixedAssets: 'Aset Tetap',

  fields: {
    account: 'Akun',
    debit: 'Debit',
    credit: 'Kredit',
    amount: 'Jumlah',
    currency: 'Mata Uang',
    posting_date: 'Tanggal Posting',
  },
  /*
   * -- generated module labels --
   *
   * Kunci per module hasil generator: `finance.<module>.fields.<kolom>`.
   * Namespace-nya **diturunkan** dari `framework_module` di backend
   * (`derive_i18n_namespace`), bukan ditulis tangan — jadi kunci di
   * sini harus memakai tanda hubung persis seperti rutenya.
   *
   * Kunci yang belum ada jatuh ke teks Inggris di argumen kedua
   * `resourceLabel()`, jadi module tetap benar sebelum diterjemahkan —
   * dan kunci yang salah ketik **tidak** berbunyi sebagai error, ia
   * cuma diam-diam tidak pernah ikut diterjemahkan.
   */
  'account-mappings': {
    fields: {
      account: 'Akun',
      code: 'Kode',
      company: 'Perusahaan',
      event_type: 'Jenis Kejadian',
      is_active: 'Aktif',
      mapping_key: 'Kunci Pemetaan',
      name: 'Nama',
      specificity: 'Kekhususan',
    },
  },
  'accounting-dimensions': {
    fields: {
      code: 'Kode',
      data_type: 'Tipe Data',
      is_active: 'Aktif',
      is_locked: 'Bawaan',
      is_required: 'Wajib di Setiap Baris',
      name: 'Nama',
    },
  },
  'accounting-events': {
    fields: {
      company: 'Perusahaan',
      event_date: 'Tanggal Kejadian',
      event_type: 'Jenis Kejadian',
      journal_number: 'Jurnal',
      source_id: 'ID Sumber',
      source_module: 'Modul Sumber',
      source_type: 'Jenis Sumber',
      status: 'Status',
    },
  },
  'accounting-periods': {
    fields: {
      code: 'Kode',
      end_date: 'Tanggal Akhir',
      fiscal_year: 'Tahun Buku',
      name: 'Nama',
      period_number: 'No.',
      start_date: 'Tanggal Mulai',
      status: 'Status',
    },
  },
  'accounting-policies': {
    fields: {
      code: 'Kode',
      company: 'Perusahaan',
      event_type: 'Jenis Kejadian',
      is_active: 'Aktif',
      name: 'Nama',
      rule_count: 'Aturan',
    },
  },
  'accounting-policy-rules': {
    fields: {
      iterate_over: 'Ulangi Per Baris',
      policy: 'Kebijakan',
      stop_on_match: 'Berhenti Jika Cocok',
    },
  },
  'chart-of-accounts': {
    fields: {
      account_category: 'Kategori',
      account_type: 'Golongan Akun',
      code: 'Kode Akun',
      company: 'Perusahaan',
      effective_normal_balance: 'Saldo Normal',
      is_active: 'Aktif',
      name: 'Nama Akun',
      parent: 'Akun Induk',
      posting_allowed: 'Boleh Diposting',
    },
  },
  'fiscal-years': {
    fields: {
      code: 'Kode',
      company: 'Perusahaan',
      end_date: 'Tanggal Akhir',
      is_current: 'Tahun Buku Berjalan',
      name: 'Nama',
      period_count: 'Periode',
      start_date: 'Tanggal Mulai',
      status: 'Status',
    },
  },
  'journals': {
    fields: {
      company: 'Perusahaan',
      description: 'Keterangan',
      journal_number: 'No. Jurnal',
      journal_type: 'Jenis Jurnal',
      posting_date: 'Tanggal Posting',
      source_module: 'Modul Sumber',
      status: 'Status',
      total_credit: 'Total Kredit',
      total_debit: 'Total Debit',
    },
  },
} as const
