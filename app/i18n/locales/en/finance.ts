export default {
  title: 'Finance',
  chartOfAccounts: 'Chart of Accounts',
  journalEntry: 'Journal Entry',
  journalEntryPlural: 'Journal Entries',
  accountsPayable: 'Accounts Payable',
  accountsReceivable: 'Accounts Receivable',
  cashBank: 'Cash & Bank',
  budget: 'Budget',
  fixedAssets: 'Fixed Assets',

  fields: {
    account: 'Account',
    debit: 'Debit',
    credit: 'Credit',
    amount: 'Amount',
    currency: 'Currency',
    posting_date: 'Posting Date',
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
      account: 'Account',
      code: 'Code',
      company: 'Company',
      event_type: 'Event Type',
      is_active: 'Active',
      mapping_key: 'Mapping Key',
      name: 'Name',
      specificity: 'Specificity',
    },
  },
  'accounting-dimensions': {
    fields: {
      code: 'Code',
      data_type: 'Data Type',
      is_active: 'Active',
      is_locked: 'Built-in',
      is_required: 'Required on Every Line',
      name: 'Name',
    },
  },
  'accounting-events': {
    fields: {
      company: 'Company',
      event_date: 'Event Date',
      event_type: 'Event Type',
      journal_number: 'Journal',
      source_id: 'Source ID',
      source_module: 'Source Module',
      source_type: 'Source Type',
      status: 'Status',
    },
  },
  'accounting-periods': {
    fields: {
      code: 'Code',
      end_date: 'End Date',
      fiscal_year: 'Fiscal Year',
      name: 'Name',
      period_number: 'No.',
      start_date: 'Start Date',
      status: 'Status',
    },
  },
  'accounting-policies': {
    fields: {
      code: 'Code',
      company: 'Company',
      event_type: 'Event Type',
      is_active: 'Active',
      name: 'Name',
      rule_count: 'Rules',
    },
  },
  'accounting-policy-rules': {
    fields: {
      iterate_over: 'Iterate Over',
      policy: 'Policy',
      stop_on_match: 'Stop On Match',
    },
  },
  'chart-of-accounts': {
    fields: {
      account_category: 'Category',
      account_type: 'Account Type',
      code: 'Account Code',
      company: 'Company',
      effective_normal_balance: 'Normal Balance',
      is_active: 'Active',
      name: 'Account Name',
      parent: 'Parent Account',
      posting_allowed: 'Posting Allowed',
    },
  },
  'fiscal-years': {
    fields: {
      code: 'Code',
      company: 'Company',
      end_date: 'End Date',
      is_current: 'Current Fiscal Year',
      name: 'Name',
      period_count: 'Periods',
      start_date: 'Start Date',
      status: 'Status',
    },
  },
  'journals': {
    fields: {
      company: 'Company',
      description: 'Description',
      journal_number: 'Journal No.',
      journal_type: 'Journal Type',
      posting_date: 'Posting Date',
      source_module: 'Source Module',
      status: 'Status',
      total_credit: 'Total Credit',
      total_debit: 'Total Debit',
    },
  },
} as const
