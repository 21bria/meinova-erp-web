/*
| Asset Management (ASSET-6).
|
| Kunci per module hasil generator: `assets.<module>.fields.<kolom>`,
| `.tabs.<tab>`, `.actions.<aksi>`, `.placeholder.search`. Namespace-nya
| diturunkan backend dari `framework_module` (`assets/register` →
| `assets.register`) — jangan diganti nama di sini.
|
| `ui` dipakai komponen tulis tangan (`app/modules/assets/<modul>/detail/`,
| `app/modules/assets/shared/`). Kode enum (kondisi, jenis custody,
| alasan) ada di `codes.ts`, bukan di sini.
*/
export default {
  title: 'Asset Management',

  categories: {
    fields: {
      code: 'Code',
      name: 'Name',
      description: 'Description',
      sort_order: 'Sort Order',
      is_active: 'Active',
      requires_serial_number: 'Serial Number Required',
      allow_employee_custody: 'Can Be Held By An Employee',
      allow_organization_custody: 'Can Be Held By A Department',
    },
    placeholder: { search: 'Search code or name...' },
  },

  register: {
    fields: {
      asset_code: 'Asset Code',
      status: 'Status',
      company: 'Owner Company',
      category: 'Category',
      name: 'Name',
      description: 'Description',
      manufacturer: 'Manufacturer',
      model: 'Model',
      serial_number: 'Serial Number',
      tag_number: 'Tag Number',
      condition: 'Condition',
      location: 'Location',
      facility: 'Facility',
      custody_type: 'Custody',
      custody_holder: 'Holder',
      current_custody: 'Current Custody',
      acquisition_date: 'Acquisition Date',
      acquisition_reference: 'Acquisition Reference',
      supplier_name: 'Supplier',
      warranty_until: 'Warranty Until',
      activated_at: 'Activated At',
      activated_by: 'Activated By',
      is_active: 'Active',
      overview: 'Overview',
      custody_history: 'Custody History',
      condition_history: 'Condition History',
      documents: 'Documents',
    },
    tabs: {
      general: 'General',
      placement: 'Placement',
      acquisition: 'Acquisition',
    },
    actions: {
      activate: {
        label: 'Activate',
        confirm: {
          title: 'Activate this asset?',
          description: 'The asset enters STORAGE custody at its location. Once active, it moves only through custody documents and can no longer be deleted.',
        },
      },
      record_condition: {
        label: 'Record Condition',
        fields: {
          condition: 'Condition',
          note: 'Note',
        },
      },
    },
    placeholder: { search: 'Search asset code, serial, tag, or name...' },
  },

  assignments: {
    fields: {
      document_number: 'Document No.',
      status: 'Status',
      summary: 'Summary',
      target_custody_type: 'Assign To',
      asset: 'Asset',
      employee: 'Employee',
      cross_company_reason: 'Cross-Company Reason',
      department: 'Department',
      pic_employee: 'PIC',
      location: 'Target Location',
      facility: 'Target Facility',
      purpose: 'Purpose',
      notes: 'Notes',
      company: 'Owner Company',
      source_location: 'Source Location',
      source_custody: 'Source Custody',
      is_cross_company: 'Cross-Company',
      employee_company: 'Employee Company',
      employee_location: 'Employee Location',
      employee_department: 'Employee Department',
      handover_date: 'Handover Date',
      handover_condition: 'Handover Condition',
      resulting_custody: 'Resulting Custody',
      submitted_at: 'Submitted At',
      approved_at: 'Approved At',
      rejected_at: 'Rejected At',
      cancelled_at: 'Cancelled At',
      completed_at: 'Completed At',
      completed_by: 'Completed By',
      is_active: 'Active',
    },
    tabs: {
      general: 'General',
      result: 'Result',
    },
    actions: {
      submit: {
        label: 'Submit',
        fields: {
          notes: 'Notes',
        },
      },
      approve: {
        label: 'Approve',
        fields: {
          notes: 'Notes',
        },
      },
      reject: {
        label: 'Reject',
        fields: {
          notes: 'Notes',
        },
      },
      complete: {
        label: 'Complete Handover',
        fields: {
          handover_date: 'Handover Date',
          condition: 'Condition at Handover',
          note: 'Note',
        },
        confirm: {
          title: 'Complete the handover?',
          description: 'Custody moves from storage to the recipient. The document can no longer change.',
        },
      },
      cancel: {
        label: 'Cancel',
        fields: {
          notes: 'Notes',
        },
      },
    },
    placeholder: { search: 'Search document no., asset, or employee no...' },
  },

  returns: {
    fields: {
      document_number: 'Document No.',
      status: 'Status',
      summary: 'Summary',
      asset: 'Asset',
      reason: 'Reason',
      destination_location: 'Storage Location',
      destination_facility: 'Storage Facility',
      notes: 'Notes',
      company: 'Owner Company',
      source_custody: 'Source Custody',
      source_custody_type: 'Returned From',
      source_employee: 'Employee',
      source_department: 'Department',
      source_pic_employee: 'PIC',
      source_location: 'Source Location',
      source_facility: 'Source Facility',
      return_date: 'Return Date',
      return_condition: 'Return Condition',
      resulting_custody: 'Resulting Custody',
      submitted_at: 'Submitted At',
      approved_at: 'Approved At',
      rejected_at: 'Rejected At',
      cancelled_at: 'Cancelled At',
      completed_at: 'Completed At',
      completed_by: 'Completed By',
      is_active: 'Active',
    },
    tabs: {
      general: 'General',
      source: 'Source',
      result: 'Result',
    },
    actions: {
      submit: {
        label: 'Submit',
        fields: {
          notes: 'Notes',
        },
      },
      approve: {
        label: 'Approve',
        fields: {
          notes: 'Notes',
        },
      },
      reject: {
        label: 'Reject',
        fields: {
          notes: 'Notes',
        },
      },
      complete: {
        label: 'Receive Return',
        fields: {
          return_date: 'Return Date',
          condition: 'Condition at Return',
          note: 'Note',
        },
        confirm: {
          title: 'Receive the return?',
          description: 'Custody moves back to the storage destination. The document can no longer change.',
        },
      },
      cancel: {
        label: 'Cancel',
        fields: {
          notes: 'Notes',
        },
      },
    },
    placeholder: { search: 'Search document no., asset, or employee no...' },
  },

  transfers: {
    fields: {
      document_number: 'Document No.',
      status: 'Status',
      summary: 'Summary',
      asset: 'Asset',
      target_custody_type: 'Transfer To',
      reason: 'Reason',
      target_employee: 'Employee',
      cross_company_reason: 'Cross-Company Reason',
      target_department: 'Department',
      target_pic_employee: 'PIC',
      target_location: 'Target Location',
      target_facility: 'Target Facility',
      notes: 'Notes',
      company: 'Owner Company',
      source_custody: 'Source Custody',
      source_custody_type: 'From',
      source_employee: 'Employee',
      source_department: 'Department',
      source_pic_employee: 'PIC',
      source_location: 'Source Location',
      source_facility: 'Source Facility',
      is_cross_company: 'Cross-Company',
      employee_company: 'Employee Company',
      employee_location: 'Employee Location',
      employee_department: 'Employee Department',
      transfer_date: 'Transfer Date',
      transfer_condition: 'Transfer Condition',
      resulting_custody: 'Resulting Custody',
      submitted_at: 'Submitted At',
      approved_at: 'Approved At',
      rejected_at: 'Rejected At',
      cancelled_at: 'Cancelled At',
      completed_at: 'Completed At',
      completed_by: 'Completed By',
      is_active: 'Active',
    },
    tabs: {
      general: 'General',
      source: 'Source',
      result: 'Result',
    },
    actions: {
      submit: {
        label: 'Submit',
        fields: {
          notes: 'Notes',
        },
      },
      approve: {
        label: 'Approve',
        fields: {
          notes: 'Notes',
        },
      },
      reject: {
        label: 'Reject',
        fields: {
          notes: 'Notes',
        },
      },
      complete: {
        label: 'Complete Transfer',
        fields: {
          transfer_date: 'Transfer Date',
          condition: 'Condition at Transfer',
          note: 'Note',
        },
        confirm: {
          title: 'Complete the transfer?',
          description: 'Custody moves to the target. The document can no longer change.',
        },
      },
      cancel: {
        label: 'Cancel',
        fields: {
          notes: 'Notes',
        },
      },
    },
    placeholder: { search: 'Search document no., asset, or employee no...' },
  },

  ui: {
    custody: {
      title: 'Current Custody',
      none: 'No custody yet — the asset becomes Storage when it is activated.',
      holder: 'Holder',
      employee: 'Employee',
      department: 'Department',
      pic: 'PIC',
      noPic: 'No PIC',
      location: 'Location',
      facility: 'Facility',
      since: 'Since',
      openedBy: 'Opened By',
      until: 'Until',
      current: 'Current',
      condition: 'Condition',
      storage: 'In storage — available for Assignment when the condition is fit.',
    },
    overview: {
      identity: 'Identity',
      acquisition: 'Acquisition',
      noValue: 'Book value and depreciation live in Fixed Asset, not here.',
    },
    history: {
      custodyEmpty: 'No custody history yet.',
      conditionEmpty: 'No condition history yet.',
      recordedBy: 'Recorded By',
      source: 'Source',
      from: 'From',
      to: 'To',
      note: 'Note',
      loadFailed: 'The history could not be loaded.',
    },
    documents: {
      assignments: 'Assignments',
      transfers: 'Transfers',
      returns: 'Returns',
      empty: 'No documents.',
      open: 'Open',
      date: 'Date',
    },
    lifecycle: {
      title: 'Lifecycle',
      from: 'From',
      to: 'To',
      approval: 'Approval',
      noWorkflow: 'No approval flow applies — the document was approved on submit.',
      hint: {
        draft: 'Draft — nothing is reserved yet. Submit to reserve the asset.',
        submitted: 'Submitted — the asset is reserved while it waits for approval.',
        approved: 'Approved — awaiting the physical handover. Custody has not moved yet.',
        completed: 'Completed — custody has moved. The document can no longer change.',
        rejected: 'Rejected — the reservation was released.',
        cancelled: 'Cancelled — the reservation was released.',
      },
      approvedBadge: 'Approved — awaiting handover',
    },
  },
}
