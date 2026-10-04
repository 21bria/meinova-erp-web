/*
| Kode enum stabil yang dikirim API -> kalimat yang dibaca orang.
|
| Dikelompokkan **per nama field**, bukan dalam satu ruang datar:
| `codes.approver_type.role`, bukan `codes.role`. Kode enum di ERP ini
| pendek dan generik (`role`, `manager`, `user`, `position`), jadi satu
| ruang datar berarti enum HR bernama `manager` suatu hari memungut
| label milik Workflow — dan salahnya tidak berbunyi.
|
| **Yang tersimpan tetap kodenya.** `approver_type` di database dan di
| payload API tetap `"role"`; berkas ini hanya menentukan kata yang
| tampil. Tidak ada satu pun perbandingan di kode yang boleh memakai
| nilai dari sini.
|
| Kode yang tidak ada di sini jatuh ke `common.status.<kode>`, lalu ke
| label Inggris yang dikirim API. Jadi menambah anggota enum di backend
| tidak pernah menghasilkan layar kosong — cuma layar yang belum
| diterjemahkan.
|
| Status umum (approved/rejected/pending/draft/...) sengaja **tidak**
| diulang di sini; tempatnya `common.status.*`, dipakai bersama seluruh
| modul.
*/
export default {
  /*
   * Exception state on an attendance row (`permission_state`).
   *
   * Field-scoped, **not** in `common.status`: the code `partial` is
   * already used by another domain with an entirely different meaning
   * ("Partially Paid" on payment status). A word belonging to one column
   * placed in the shared catalogue renames another domain's code with no
   * warning — and the person who finds it is not a test but whoever
   * reads the invoice.
   */
  permission_state: {
    pending: 'Permit Awaiting Approval',
    excused: 'Covered By A Permit',
    partial: 'Partly Covered By A Permit',
    unauthorized: 'Without A Permit',
  },

  approver_type: {
    user: 'Specific User',
    role: 'Role Holder',
    position: 'Position Hierarchy',
    manager: 'Direct Manager',
    department_head: 'Department Head',
  },

  assignment_type: {
    user: 'Specific User',
    role: 'Role Holder',
    position: 'Position Hierarchy',
    manager: 'Direct Manager',
    department_head: 'Department Head',
    fallback_role: 'Fallback Role',
  },

  approver_scope: {
    tenant: 'Entire Tenant',
    company: 'Company',
    branch: 'Branch',
    location: 'Location',
    division: 'Division',
    department: 'Department',
    section: 'Section',
  },

  approval_mode: {
    any: 'Any Approver',
    all: 'All Approvers',
  },
  /*
   * Nama modul sebagai kode enum (kolom "Module" di Help Center dan
   * Audit). Ditaruh per field, bukan di `common.status`, karena `hr`
   * dan `workflow` di sana sudah dipakai sebagai induk kode ber-titik
   * (`hr.contract_end`) — satu kunci tidak bisa sekaligus jadi teks
   * dan jadi induk.
   */
  module: {
    administration: 'Administration',
    finance: 'Finance',
    hr: 'HR',
    payroll: 'Payroll',
    scm: 'Supply Chain',
    workflow: 'Workflow',
  },

  /*
   * Business Trip (BT-5). Per field: `return`, `other`, `meeting` are
   * generic codes that another module may give a different meaning.
   */
  purpose_category: {
    duty: 'Official Duty',
    site_visit: 'Site Visit',
    meeting: 'Meeting',
    training: 'Training',
    audit: 'Audit / Inspection',
    other: 'Other',
  },

  destination_type: {
    internal_location: 'Company Location',
    external_domestic: 'External — Domestic',
    external_international: 'External — International',
  },

  supersede_type: {
    replacement: 'Replacement',
    extension: 'Extension',
  },

  // Business Trip leg direction.
  direction: {
    outbound: 'Outbound',
    return: 'Return',
    intermediate: 'Intermediate',
  },
  /*
   * Asset Management (ASSET-6). Custody types are field-scoped here
   * because `common.status.employee` already means "The Employee" in
   * another domain — falling back to it would print the wrong phrase.
   */
  custody_type: {
    employee: 'Employee',
    organization: 'Department',
    storage: 'Storage',
  },
  source_custody_type: {
    employee: 'Employee',
    organization: 'Department',
    storage: 'Storage',
  },
  target_custody_type: {
    employee: 'Employee',
    organization: 'Department',
    storage: 'Storage',
  },
  condition: {
    good: 'Good',
    fair: 'Fair',
    damaged: 'Damaged',
    unserviceable: 'Unserviceable',
  },
  handover_condition: {
    good: 'Good',
    fair: 'Fair',
    damaged: 'Damaged',
    unserviceable: 'Unserviceable',
  },
  return_condition: {
    good: 'Good',
    fair: 'Fair',
    damaged: 'Damaged',
    unserviceable: 'Unserviceable',
  },
  transfer_condition: {
    good: 'Good',
    fair: 'Fair',
    damaged: 'Damaged',
    unserviceable: 'Unserviceable',
  },
  // Asset Return + Asset Transfer reasons (their codes do not overlap).
  reason: {
    end_of_use: 'End Of Use',
    separation: 'Employee Separation',
    replacement: 'Replacement',
    damage: 'Damage',
    reassignment: 'Reassignment',
    pic_change: 'PIC Change',
    relocation: 'Relocation',
    reorganization: 'Reorganization',
  },
  // Asset condition history source — read explicitly by the history tab.
  condition_source: {
    registration: 'Registration',
    inspection: 'Inspection',
    handover: 'Handover',
    return: 'Return',
    transfer: 'Transfer',
  },
  // Employee Group — derived travel document (TR/BT POLICY-1).
  travel_document: {
    travel_request: 'Travel Request',
    business_trip: 'Business Trip',
    both: 'Travel Request + Business Trip',
    none: 'No travel document enabled',
  },
  // Employee Group — configuration warnings; never block saving.
  travel_document_warnings: {
    both: 'Employees in this group can use both Travel Request and Business Trip. Use each document according to its intended travel purpose.',
    none: 'Employees in this group cannot use Travel Request or Business Trip.',
  },
} as const
