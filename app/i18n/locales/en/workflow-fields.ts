/*
| Label field layar Workflow — sisi bahasa Inggris.
|
| Kuncinya **nama field**, bukan kalimatnya: `fields.approver_type`,
| bukan `fields.approverType`. Nama itu yang stabil — ia sama dengan
| kunci payload API, kunci query string, dan kolom database — jadi
| memperbaiki kata "Approver Type" jadi "Approver" nanti tidak
| memutus satu pun terjemahan.
|
| Isinya sengaja **sama persis** dengan `label=` di
| `apps/workflow/api/*/

export default {
  definitions: {
    fields: {
      code: 'Code',
      name: 'Name',
      module: 'Module',
      document_type: 'Document Type',
      status: 'Status',
      version: 'Version',
      description: 'Description',
      company: 'Company',
      branch: 'Branch',
      location: 'Location',
      employee_group: 'Employee Group',
      scope_label: 'Applies To',
      specificity: 'Priority Score',
      is_active: 'Is active',
      instances: 'Running Documents',
    },
    // Grid Approval Step yang tertanam di layar ini menampilkan
    // field milik resource LAIN. Ruang kuncinya sendiri supaya
    // `name` di sini ('Nama Tahap') tidak bertabrakan dengan
    // `fields.name` milik Definition ('Nama').
    steps: {
      fields: {
        definition: 'Workflow',
        sequence: 'Step',
        name: 'Step Name',
        description: 'Description',
        approver_type: 'Approver Type',
        level: 'Level',
        approver_role: 'Role',
        approver_scope: 'Role Scope',
        approver_user: 'User',
        approver_position: 'Position',
        fallback_role: 'Fallback Role',
        approval_mode: 'Approval Mode',
        minimum_approvals: 'Minimum Approvals',
        is_required: 'Required',
        can_reject: 'Can Reject',
        can_return: 'Can Return',
        condition: 'Condition',
      },
    },
    tabs: {
      general: 'General',
      scope: 'Scope',
      steps: 'Approval Steps',
    },
  },

  steps: {
    fields: {
      definition: 'Workflow',
      sequence: 'Step',
      name: 'Step Name',
      description: 'Description',
      approver_type: 'Approver Type',
      level: 'Level',
      approver_role: 'Role',
      approver_scope: 'Role Scope',
      approver_user: 'User',
      approver_position: 'Position',
      fallback_role: 'Fallback Role',
      approval_mode: 'Approval Mode',
      minimum_approvals: 'Minimum Approvals',
      is_required: 'Required',
      can_reject: 'Can Reject',
      can_return: 'Can Return',
      condition: 'Condition',
      is_active: 'Is active',
    },
  },

  instances: {
    fields: {
      document_number: 'Document No.',
      document_label: 'Document',
      module: 'Module',
      document_type: 'Document Type',
      subject_employee: 'Employee',
      subject_number: 'Employee No.',
      status: 'Status',
      current_step_name: 'Waiting At',
      definition_name: 'Workflow',
      submitted_at: 'Submitted At',
      completed_at: 'Completed At',
      submitted_by_name: 'Submitted By',
      notes: 'Notes',
      company_name: 'Company',
      location_name: 'Location',
    },
    tabs: {
      document: 'Document',
      state: 'Workflow',
    },
  },

  delegations: {
    fields: {
      delegator: 'Delegator',
      delegate: 'Delegate',
      starts_at: 'Starts',
      ends_at: 'Ends',
      is_active: 'Active',
      is_running: 'Currently Active',
      module: 'Module',
      document_type: 'Document Type',
      reason: 'Reason',
    },
  },

} as const
