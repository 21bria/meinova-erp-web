import type { MasterHubItem } from '~/features/master-hub'

import type { NavHubItem, NavMenu, NavMenuItems } from '~/types/nav'

import {
  payrollBpjsItems,
} from '~/registry/section-hub/payroll-bpjs'

import {
  payrollTaxItems,
} from '~/registry/section-hub/payroll-tax'

/*
 * Rute + izin tiap kartu hub, untuk dipakai penyaring sidebar.
 *
 * Diturunkan dari registry hub-nya, bukan ditulis ulang di sini: dua
 * daftar yang harus sama tapi disimpan terpisah pada akhirnya selalu
 * berbeda, dan bedanya tidak menghasilkan error — cuma menu yang
 * tampil untuk orang yang tidak punya isinya.
 */
function toHubItems(items: MasterHubItem[]): NavHubItem[] {
  return items.map(item => ({
    link: item.link,
    permission: item.permission,
  }))
}

export const appMenus = []

export const moduleMenus: Record<string, NavMenu[]> = {
  hr: [
    {
      heading: 'Human Resources', headingKey: 'navigation.groups.humanResources',
      items: [
        { title: 'Dashboard', titleKey: 'navigation.items.dashboard', icon: 'i-lucide-layout-dashboard', link: '/hr' },
        // **My Profile tidak lagi di sini.** Kartu pegawai milik
        // sendiri bukan fitur HR: ia dibuka siapa pun yang punya
        // akun, dan tidak ada hubungannya dengan mengelola pegawai.
        // Ia sekarang `/me/profile`, dijangkau lewat menu avatar di
        // kaki sidebar dan lewat kartu My Workspace di launcher.
        //
        // `/hr/my-profile` dipertahankan sebagai pengalihan supaya
        // penanda halaman lama tidak mati.
        { title: 'Employees', titleKey: 'navigation.items.employees', icon: 'i-lucide-users', link: '/hr/employees' },
        // Dokumen perubahan kepegawaian — kontrak, jenis, penempatan,
        // gaji. Punya menu sendiri, bukan cuma tab di dalam Employee:
        // yang mengurus persetujuannya sering bukan orang yang membuka
        // kartu pegawainya.
        { title: 'Employee Actions', titleKey: 'navigation.items.employeeActions', icon: 'i-lucide-file-signature', link: '/hr/employee-actions' },
      ],
    },

    {
      heading: 'Masters', headingKey: 'navigation.groups.masters',
      items: [
        { title: 'Masters', titleKey: 'navigation.items.masters', icon: 'i-lucide-database', link: '/hr/masters' },
      ],
    },

    // Tiga hub seksi, masing-masing satu item — polanya sama dengan
    // Masters di atas.
    //
    // Sebelumnya ketiganya berupa grup berisi 5 + 5 + 3 item, dan
    // sidebar HR jadi dua puluh baris: yang dicari harus ditelusuri
    // dengan mata tiap kali, dan menambah satu layar berarti menambah
    // satu baris lagi ke daftar yang sudah terlalu panjang. Isinya
    // sekarang jadi kartu berkategori di halaman hub-nya — bisa dicari
    // dan punya keterangan, dua hal yang tidak bisa diberikan sebuah
    // item sidebar.
    //
    // **Kartunya ikut tersaring `RoleMenuPermission`** lewat
    // `MasterHub`, jadi memindahkan layar ke dalam hub tidak melonggarkan
    // satu pun pembatasan menu — kartu adalah pintu kedua ke layar yang
    // sama, dan pintu kedua yang tidak dijaga adalah kebocoran yang
    // tidak berbunyi.
    //
    // Ketiganya sengaja **tidak** dicampur jadi satu hub: yang dibuka
    // orang setiap hari berbeda-beda menurut pekerjaannya, dan hub yang
    // memuat tiga urusan sekaligus mengembalikan persoalan yang sama —
    // daftar panjang, cuma pindah tempat.
    {
      heading: 'Attendance & Leave', headingKey: 'navigation.groups.attendanceLeave',
      items: [
        { title: 'Attendance & Leave', titleKey: 'navigation.items.attendanceLeave', icon: 'i-lucide-calendar-check', link: '/hr/attendance-leave' },
      ],
    },

    {
      heading: 'Roster & Travel', headingKey: 'navigation.groups.rosterTravel',
      items: [
        { title: 'Roster & Travel', titleKey: 'navigation.items.rosterTravel', icon: 'i-lucide-plane', link: '/hr/roster-travel' },
      ],
    },

    // Hub tersendiri, bukan disisipkan ke Roster & Travel. Yang di atas
    // adalah perjalanan **pegawai** — bersandar pada Point of Hire, blok
    // roster, dan saldo cuti. Yang di sini kedatangan **tamu**, dan
    // tidak satu pun dari ketiganya berlaku padanya. Keduanya kebetulan
    // sama-sama menyangkut tiket dan penginapan, dan itu satu-satunya
    // kemiripannya: orang yang membuka salah satunya tidak pernah
    // sedang mencari yang lain.
    {
      heading: 'Visitor', headingKey: 'navigation.groups.visitor',
      items: [
        { title: 'Visitor', titleKey: 'navigation.items.visitor', icon: 'i-lucide-door-open', link: '/hr/visitor' },
      ],
    },

    {
      heading: 'Development', headingKey: 'navigation.groups.development',
      items: [
        { title: 'Training', titleKey: 'navigation.items.training', icon: 'i-lucide-graduation-cap', link: '/hr/training' },
        { title: 'Recruitment', titleKey: 'navigation.items.recruitment', icon: 'i-lucide-user-plus', link: '/hr/recruitment' },
        { title: 'Candidates', titleKey: 'navigation.items.candidates', icon: 'i-lucide-contact', link: '/hr/candidates' },
      ],
    },
  ],

  payroll: [
    {
      heading: 'Payroll', headingKey: 'navigation.groups.payroll',
      items: [
        {
          title: 'Dashboard', titleKey: 'navigation.items.dashboard',
          icon: 'i-lucide-layout-dashboard',
          link: '/payroll/dashboard',
        },
      ],
    },

    {
      heading: 'Masters', headingKey: 'navigation.groups.masters',
      items: [
        {
        title: 'Masters', titleKey: 'navigation.items.masters',
        icon: 'i-lucide-database',
        link: '/payroll/masters',
        },
      ],
    },

    {
      heading: 'Processing', headingKey: 'navigation.groups.processing',
      items: [
        {
          title: 'Payroll Periods', titleKey: 'navigation.items.payrollPeriods',
          icon: 'i-lucide-calendar-range',
          link: '/payroll/payroll-periods',
        },
        {
          title: 'Payroll Run', titleKey: 'navigation.items.payrollRun',
          icon: 'i-lucide-calculator',
          link: '/payroll/payroll-runs',
        },
        // Dulu bernama "Payroll Adjustments" dan menunjuk
        // `/payroll/adjustments` — halaman yang tidak pernah ada.
        // Koreksi/adjustment adalah salah satu jenis Payroll Input,
        // bukan modul tersendiri, jadi tautannya diarahkan ke layar
        // yang memang memuatnya.
        {
          title: 'Payroll Input', titleKey: 'navigation.items.payrollInput',
          icon: 'i-lucide-sliders-horizontal',
          link: '/payroll/inputs',
        },
        {
          title: 'Payroll Review', titleKey: 'navigation.items.payrollReview',
          icon: 'i-lucide-search-check',
          link: '/payroll/payroll-run-employees',
        },
        {
          title: 'Payslips', titleKey: 'navigation.items.payslips',
          icon: 'i-lucide-receipt-text',
          link: '/payroll/payslips',
        },
      ],
    },

    // Dua item, dan itu memang batasnya. Sebelum ini Compliance memuat
    // tujuh baris — Tax ditambah enam resource BPJS satu per satu —
    // yang mencerminkan tabel backend, bukan pekerjaan siapa pun.
    // Tidak ada layar yang dibuang: keenamnya pindah ke dalam workspace
    // BPJS, rutenya tetap sama persis, dan bookmark lama tetap hidup.
    //
    // `hubItems` bukan duplikasi daftar: ia diturunkan dari registry
    // hub-nya supaya penyaring hak akses di sidebar dan di dalam
    // hub-nya membaca sumber yang sama. Tanpa itu, item hub yang
    // rutenya belum terdaftar di tabel `Menu` akan tampil untuk role
    // yang seluruh menu BPJS-nya justru sudah dicabut.
    {
      heading: 'Compliance', headingKey: 'navigation.groups.compliance',
      items: [
        {
          title: 'Tax', titleKey: 'navigation.items.tax',
          icon: 'i-lucide-file-text',
          link: '/payroll/tax',
          hubItems: toHubItems(payrollTaxItems),
        },
        {
          title: 'BPJS', titleKey: 'navigation.items.bpjs',
          icon: 'i-lucide-landmark',
          link: '/payroll/bpjs',
          hubItems: toHubItems(payrollBpjsItems),
        },
      ],
    },

    {
      heading: 'Reports', headingKey: 'navigation.groups.reports',
      items: [
        {
          title: 'Payroll Summary', titleKey: 'navigation.items.payrollSummary',
          icon: 'i-lucide-chart-column',
          link: '/payroll/reports/summary',
        },
        // Bank Transfer dan Tax Report **belum punya halaman**, dan
        // itemnya sudah ada di sini sejak sebelum modul Payroll
        // dikerjakan — jadi keduanya mendarat di "Page not found".
        // Dilepas sampai halamannya benar-benar ada; menu yang
        // menjanjikan layar yang tidak pernah terbuka lebih buruk
        // daripada menu yang belum muncul. Mengembalikannya nanti cukup
        // menambahkan kembali dua blok ini beserta barisnya di
        // `seed_menus` backend.
      ],
    },
  ],

  workflow: [
    {
      heading: 'Workflow', headingKey: 'navigation.groups.workflow',
      items: [
        { title: 'Dashboard', titleKey: 'navigation.items.dashboard', icon: 'i-lucide-layout-dashboard', link: '/workflow' },
        { title: 'My Approvals', titleKey: 'navigation.items.myApprovals', icon: 'i-lucide-inbox', link: '/workflow/inbox' },
        { title: 'My Submissions', titleKey: 'navigation.items.mySubmissions', icon: 'i-lucide-send', link: '/workflow/submissions' },
      ],
    },

    {
      heading: 'Monitoring', headingKey: 'navigation.groups.monitoring',
      items: [
        { title: 'Running Documents', titleKey: 'navigation.items.runningDocuments', icon: 'i-lucide-git-branch', link: '/workflow/instances' },
      ],
    },

    {
      heading: 'Configuration', headingKey: 'navigation.groups.configuration',
      items: [
        // Mengubah alur = menentukan siapa menyetujui dokumen siapa,
        // jadi menunya disembunyikan dari yang tidak berhak. API-nya
        // tetap menolak 403 sendiri — ini supaya orang tidak disodori
        // layar yang pasti menolaknya.
        { title: 'Workflow Definitions', titleKey: 'navigation.items.workflowDefinitions', icon: 'i-lucide-workflow', link: '/workflow/definitions', permission: 'workflow.configure' },
        { title: 'Approval Steps', titleKey: 'navigation.items.approvalSteps', icon: 'i-lucide-list-ordered', link: '/workflow/steps', permission: 'workflow.configure' },

        // Surat kuasa sengaja terbuka: atasan yang mau cuti harus bisa
        // menyerahkan persetujuannya sendiri tanpa menunggu IT.
        { title: 'Delegations', titleKey: 'navigation.items.delegations', icon: 'i-lucide-user-round-cog', link: '/workflow/delegations' },
      ],
    },
  ],

  /*
   * Reports — aplikasi laporan lintas modul, seluruhnya read-only.
   *
   * Sengaja aplikasi tersendiri, bukan grup di dalam HR: satu laporan
   * manajemen membaca Attendance, Leave, Overtime, Roster, dan Employee
   * sekaligus, dan menaruhnya di HR membuat laporan Payroll/SCM/Finance
   * nanti tidak punya tempat yang setara.
   *
   * Daftarnya tumbuh per laporan yang **sudah ada layarnya**. Item menu
   * yang menunjuk rute yang belum dibuat menghasilkan halaman kosong,
   * dan itu lebih buruk daripada menu yang belum ada.
   */
  reports: [
    {
      heading: 'Reports', headingKey: 'navigation.groups.reports',
      items: [
        { title: 'All Reports', titleKey: 'navigation.items.allReports', icon: 'i-lucide-layout-dashboard', link: '/reports' },
      ],
    },

    {
      heading: 'HR', headingKey: 'navigation.groups.hr',
      items: [
        { title: 'HR Period Summary', titleKey: 'navigation.items.hrPeriodSummary', icon: 'i-lucide-table-2', link: '/reports/hr/period-summary' },
        { title: 'Employee Reporting Audit', titleKey: 'navigation.items.employeeReportingAudit', icon: 'i-lucide-network', link: '/reports/hr/employee-reporting-audit' },
        { title: 'Manpower Summary', titleKey: 'navigation.items.manpowerSummary', icon: 'i-lucide-users-round', link: '/reports/hr/manpower-summary' },
        { title: 'Contract Expiry', titleKey: 'navigation.items.contractExpiry', icon: 'i-lucide-file-clock', link: '/reports/hr/contract-expiry' },
      ],
    },
  ],

  scm: [
    {
      heading: 'Supply Chain', headingKey: 'navigation.groups.supplyChain',
      items: [
        { title: 'Dashboard', titleKey: 'navigation.items.dashboard', icon: 'i-lucide-layout-dashboard', link: '/scm' },
        { title: 'Purchase Request', titleKey: 'navigation.items.purchaseRequest', icon: 'i-lucide-clipboard-list', link: '/scm/purchase-requests', badge: '18' },
        { title: 'Purchase Order', titleKey: 'navigation.items.purchaseOrder', icon: 'i-lucide-package-check', link: '/scm/purchase-orders' },
        { title: 'Vendors', titleKey: 'navigation.items.vendors', icon: 'i-lucide-users-round', link: '/scm/vendors' },
        { title: 'Inventory', titleKey: 'navigation.items.inventory', icon: 'i-lucide-boxes', link: '/scm/inventory' },
        { title: 'Warehouses', titleKey: 'navigation.items.warehouses', icon: 'i-lucide-warehouse', link: '/scm/warehouses' },
        { title: 'Stock Movement', titleKey: 'navigation.items.stockMovement', icon: 'i-lucide-package', link: '/scm/stock-movement' },
        { title: 'Goods Receipt', titleKey: 'navigation.items.goodsReceipt', icon: 'i-lucide-truck', link: '/scm/goods-receipt' },
      ],
    },
  ],

  // Lima item lama di sini — Cash & Bank, AP, AR, Budget, Fixed Assets —
  // menunjuk halaman yang **tidak pernah ada**, dan `badge: '12'` pada
  // Journal Entries adalah angka hardcode yang tidak menunjuk data apa
  // pun. Ketiganya gagal tanpa suara: rute yang halamannya tidak ada
  // mendarat di 404 hanya kalau ada yang menekannya, dan angka lencana
  // yang salah tidak pernah terbaca sebagai bug.
  //
  // Yang tersisa cuma layar yang benar-benar ada. Sisanya menyusul
  // bersama modulnya masing-masing — lihat `docs/claude/finance.md`.
  finance: [
    {
      heading: 'Finance', headingKey: 'navigation.groups.finance',
      items: [
        { title: 'Dashboard', titleKey: 'navigation.items.dashboard', icon: 'i-lucide-layout-dashboard', link: '/finance' },
      ],
    },
    {
      heading: 'General Ledger', headingKey: 'navigation.groups.generalLedger',
      items: [
        { title: 'Journals', titleKey: 'navigation.items.journals', icon: 'i-lucide-file-text', link: '/finance/journals' },
        { title: 'Account Ledger', titleKey: 'navigation.items.accountLedger', icon: 'i-lucide-book-open-text', link: '/finance/account-ledger' },
        { title: 'Trial Balance', titleKey: 'navigation.items.trialBalance', icon: 'i-lucide-scale', link: '/finance/trial-balance' },
        { title: 'Accounting Events', titleKey: 'navigation.items.accountingEvents', icon: 'i-lucide-radio', link: '/finance/accounting-events' },
      ],
    },
    {
      heading: 'Setup', headingKey: 'navigation.groups.financeSetup',
      items: [
        { title: 'Chart of Accounts', titleKey: 'navigation.items.chartOfAccounts', icon: 'i-lucide-book-open', link: '/finance/chart-of-accounts' },
        { title: 'Fiscal Years', titleKey: 'navigation.items.fiscalYears', icon: 'i-lucide-calendar-range', link: '/finance/fiscal-years' },
        { title: 'Accounting Periods', titleKey: 'navigation.items.accountingPeriods', icon: 'i-lucide-calendar-check', link: '/finance/accounting-periods' },
        { title: 'Accounting Dimensions', titleKey: 'navigation.items.accountingDimensions', icon: 'i-lucide-tags', link: '/finance/accounting-dimensions' },
        { title: 'Accounting Policies', titleKey: 'navigation.items.accountingPolicies', icon: 'i-lucide-file-cog', link: '/finance/accounting-policies' },
        { title: 'Account Mapping', titleKey: 'navigation.items.accountMappings', icon: 'i-lucide-arrow-left-right', link: '/finance/account-mappings' },
      ],
    },
  ],

  // Asset Management (ASSET-6). Hanya layar yang benar-benar ada:
  // Entitlement, Fixed Asset Accounting, dan Depreciation belum
  // diimplementasikan, jadi tidak ada menunya (lihat komentar finance di
  // atas — menu tanpa halaman gagal tanpa suara). Custody dan riwayat
  // sengaja bukan menu: tempatnya tab di layar detail aset.
  assets: [
    {
      heading: 'Asset Management', headingKey: 'navigation.groups.assetManagement',
      items: [
        { title: 'Asset Register', titleKey: 'navigation.items.assetRegister', icon: 'i-lucide-package', link: '/assets/register' },
        { title: 'Assignments', titleKey: 'navigation.items.assetAssignments', icon: 'i-lucide-user-check', link: '/assets/assignments' },
        { title: 'Transfers', titleKey: 'navigation.items.assetTransfers', icon: 'i-lucide-arrow-left-right', link: '/assets/transfers' },
        { title: 'Returns', titleKey: 'navigation.items.assetReturns', icon: 'i-lucide-undo-2', link: '/assets/returns' },
      ],
    },
    {
      heading: 'Setup', headingKey: 'navigation.groups.assetSetup',
      items: [
        { title: 'Asset Categories', titleKey: 'navigation.items.assetCategories', icon: 'i-lucide-tags', link: '/assets/categories' },
      ],
    },
  ],
    administration: [
    {
      heading: 'Administration', headingKey: 'navigation.groups.administration',
      items: [
        { title: 'Dashboard', titleKey: 'navigation.items.dashboard', icon: 'i-lucide-layout-dashboard', link: '/administration' },
        { title: 'Organization', titleKey: 'navigation.items.organization', icon: 'i-lucide-building-2', link: '/administration/organization' },
        {title:  'Currency',icon: 'i-lucide-badge-dollar-sign',link:  '/administration/currency'},
        { title: 'Calendar', titleKey: 'navigation.items.calendar', icon: 'i-lucide-calendar-days', link: '/administration/calendar' },
        // Kelola user & role = wewenang paling berbahaya di sistem.
        // API-nya menolak 403 sendiri; menunya disembunyikan supaya
        // orang tidak disodori layar yang pasti menolaknya.
        { title: 'Security', titleKey: 'navigation.items.security', icon: 'i-lucide-shield-check', link: '/administration/security', permission: 'security.manage' },
        { title: 'Settings', titleKey: 'navigation.items.settings', icon: 'i-lucide-settings-2', link: '/administration/settings' },
        { title: 'Audit Trail', titleKey: 'navigation.items.auditTrail', icon: 'i-lucide-history', link: '/administration/audit' },
        
      ],
    },
    {
      heading: 'References', headingKey: 'navigation.groups.references',
      items: [
        { title: 'Geography', titleKey: 'navigation.items.geography', icon: 'i-lucide-map', link: '/administration/master/geography' },
        { title: 'Organization', titleKey: 'navigation.items.organization', icon: 'i-lucide-building', link: '/administration/master/organization' },
        { title: 'Bank', titleKey: 'navigation.items.bank', icon: 'i-lucide-landmark', link: '/administration/master/bank' },
        { title: 'HR Reference', titleKey: 'navigation.items.hrReference', icon: 'i-lucide-user-cog', link: '/administration/master/hr' },
      ],
    },
    {
      // Notifikasi. Grup tersendiri, bukan disisipkan ke Settings:
      // yang diatur di sini bukan satu form melainkan tiga hal yang
      // dibuka bergantian saat menelusuri satu keluhan — "kenapa saya
      // tidak dapat emailnya" dijawab dengan membaca Log, memeriksa
      // Rules, lalu membetulkan Template.
      heading: 'Notifications', headingKey: 'navigation.groups.notifications',
      items: [
        { title: 'Email Templates', titleKey: 'navigation.items.emailTemplates', icon: 'i-lucide-mail', link: '/administration/email-templates' },
        { title: 'Notification Rules', titleKey: 'navigation.items.notificationRules', icon: 'i-lucide-bell-ring', link: '/administration/notification-rules' },
        { title: 'Notification Log', titleKey: 'navigation.items.notificationLog', icon: 'i-lucide-mail-check', link: '/administration/notification-logs' },
        { title: 'Notification Setting', titleKey: 'navigation.items.notificationSetting', icon: 'i-lucide-sliders-horizontal', link: '/administration/notification-settings' },
      ],
    },
    {
      // Layar penulis panduan. Help Center-nya sendiri ada di `/help`
      // dan sengaja tidak didaftarkan di sini — halaman bantuan harus
      // terbuka untuk semua orang, sementara menu di sini bisa dicabut
      // per role.
      heading: 'Help Center', headingKey: 'navigation.groups.helpCenter',
      items: [
        { title: 'Help Categories', titleKey: 'navigation.items.helpCategories', icon: 'i-lucide-folder-tree', link: '/administration/help-categories' },
        { title: 'Help Articles', titleKey: 'navigation.items.helpArticles', icon: 'i-lucide-book-open', link: '/administration/help-articles' },
      ],
    },
  ],
}

export const navMenu: NavMenu[] = []

export const navMenuBottom: NavMenuItems = [
  // `AppSidebar` menyisipkan rute yang sedang dibuka sebagai
  // `?route=` supaya halaman bantuan bisa menawarkan panduan layar
  // itu lebih dulu. Tautannya tetap sah tanpa parameter itu.
  { title: 'Help & Support', titleKey: 'navigation.items.helpSupport', icon: 'i-lucide-circle-help', link: '/help' },
  { title: 'Feedback', titleKey: 'navigation.items.feedback', icon: 'i-lucide-send', link: '#' },
]